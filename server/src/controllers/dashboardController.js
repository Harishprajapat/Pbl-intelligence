import SchoolResponse from "../models/SchoolResponse.js";
import { classifyRisk } from "../services/riskEngine.js";

// Builds a Mongo filter object from query params — reused by every endpoint below
function buildFilter(query) {
  const filter = {};
  if (query.month) filter.reportingMonth = query.month;
  if (query.district) filter.district = query.district;
  if (query.block) filter.block = query.block;
  if (query.subject) filter.subject = query.subject;
  if (query.grade) {
    // "grade" filter means: classesConducted string contains that class number
    filter.classesConducted = { $regex: query.grade, $options: "i" };
  }
  return filter;
}

// GET /api/dashboard/summary?month=2025-08&district=...&block=...&grade=...&subject=...
export async function getDashboardSummary(req, res) {
  try {
    const filter = buildFilter(req.query);

    const [result] = await SchoolResponse.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalSchools: { $sum: 1 },
          participatingSchools: {
            $sum: { $cond: [{ $eq: ["$conducted", "Yes"] }, 1, 0] },
          },
          evidenceSubmittedCount: {
            $sum: { $cond: [{ $eq: ["$evidenceSubmitted", "Yes"] }, 1, 0] },
          },
          totalEnrollment: { $sum: "$totalEnrollment" },
          totalAttendance: { $sum: "$totalAttendance" },
          weightedAttendanceSum: {
            $sum: { $multiply: ["$attendanceRate", "$totalEnrollment"] },
          },
        },
      },
    ]);

    if (!result) {
      return res.json({
        totalSchools: 0, participatingSchools: 0, participationRate: 0,
        evidenceSubmittedCount: 0, evidenceRate: 0,
        totalEnrollment: 0, totalAttendance: 0, attendanceRate: 0,
      });
    }

    const participationRate = result.totalSchools > 0 ? result.participatingSchools / result.totalSchools : 0;
    const evidenceRate = result.totalSchools > 0 ? result.evidenceSubmittedCount / result.totalSchools : 0;
    const attendanceRate = result.totalEnrollment > 0 ? result.weightedAttendanceSum / result.totalEnrollment : 0;

    res.json({
      totalSchools: result.totalSchools,
      participatingSchools: result.participatingSchools,
      participationRate: Number(participationRate.toFixed(4)),
      evidenceSubmittedCount: result.evidenceSubmittedCount,
      evidenceRate: Number(evidenceRate.toFixed(4)),
      totalEnrollment: result.totalEnrollment,
      totalAttendance: result.totalAttendance,
      attendanceRate: Number(attendanceRate.toFixed(4)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/dashboard/trend?district=...&block=...&grade=...&subject=...
// Returns the summary for each of the 3 months — powers month-over-month comparison
export async function getMonthlyTrend(req, res) {
  try {
    // build filter WITHOUT month, then group by month in one single query
    const { month, ...rest } = req.query;
    const filter = buildFilter(rest);

    const results = await SchoolResponse.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$reportingMonth",
          totalSchools: { $sum: 1 },
          participatingSchools: {
            $sum: { $cond: [{ $eq: ["$conducted", "Yes"] }, 1, 0] },
          },
          evidenceSubmittedCount: {
            $sum: { $cond: [{ $eq: ["$evidenceSubmitted", "Yes"] }, 1, 0] },
          },
          totalEnrollment: { $sum: "$totalEnrollment" },
          weightedAttendanceSum: {
            $sum: { $multiply: ["$attendanceRate", "$totalEnrollment"] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = results.map(r => ({
      month: r._id,
      totalSchools: r.totalSchools,
      participationRate: r.totalSchools > 0 ? Number((r.participatingSchools / r.totalSchools).toFixed(4)) : 0,
      evidenceRate: r.totalSchools > 0 ? Number((r.evidenceSubmittedCount / r.totalSchools).toFixed(4)) : 0,
      attendanceRate: r.totalEnrollment > 0 ? Number((r.weightedAttendanceSum / r.totalEnrollment).toFixed(4)) : 0,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/dashboard/filters
// Returns distinct values to populate filter dropdowns on the frontend
export async function getFilterOptions(req, res) {
  try {
    const districts = await SchoolResponse.distinct("district");
    const blocks = await SchoolResponse.distinct("block");
    const subjects = await SchoolResponse.distinct("subject");
    const months = await SchoolResponse.distinct("reportingMonth");

    res.json({
      months: months.sort(),
      districts: districts.sort(),
      blocks: blocks.sort(),
      subjects: subjects.sort(),
      grades: ["6", "7", "8"], // fixed set, not derived from messy free-text column
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/dashboard/geography?level=district&month=2025-08
export async function getGeographyPerformance(req, res) {
  try {
    const level = req.query.level === "block" ? "block" : "district";
    const filter = buildFilter(req.query);

    const groupField = level === "block" ? "$block" : "$district";

    const results = await SchoolResponse.aggregate([
      { $match: filter },
      {
        $group: {
          _id: groupField,
          district: { $first: "$district" },
          totalSchools: { $sum: 1 },
          participatingSchools: {
            $sum: { $cond: [{ $eq: ["$conducted", "Yes"] }, 1, 0] },
          },
          evidenceSubmittedCount: {
            $sum: { $cond: [{ $eq: ["$evidenceSubmitted", "Yes"] }, 1, 0] },
          },
          totalEnrollment: { $sum: "$totalEnrollment" },
          weightedAttendanceSum: {
            $sum: { $multiply: ["$attendanceRate", "$totalEnrollment"] },
          },
        },
      },
    ]);

    const formatted = results.map(g => {
      const attendanceRate = g.totalEnrollment > 0 ? g.weightedAttendanceSum / g.totalEnrollment : 0;
      return {
        name: g._id,
        district: g.district,
        totalSchools: g.totalSchools,
        participationRate: Number((g.participatingSchools / g.totalSchools).toFixed(4)),
        evidenceRate: Number((g.evidenceSubmittedCount / g.totalSchools).toFixed(4)),
        attendanceRate: Number(attendanceRate.toFixed(4)),
        riskStatus: classifyRisk(attendanceRate),
      };
    });

    formatted.sort((a, b) => b.attendanceRate - a.attendanceRate);

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}