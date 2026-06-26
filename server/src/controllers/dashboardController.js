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
    const rows = await SchoolResponse.find(filter);

    const totalSchools = rows.length;
    const participatingSchools = rows.filter(r => r.conducted === "Yes").length;
    const evidenceSubmittedCount = rows.filter(r => r.evidenceSubmitted === "Yes").length;
    const totalEnrollment = rows.reduce((sum, r) => sum + r.totalEnrollment, 0);
    const totalAttendance = rows.reduce((sum, r) => sum + r.totalAttendance, 0);

    const participationRate = totalSchools > 0 ? participatingSchools / totalSchools : 0;
    const evidenceRate = totalSchools > 0 ? evidenceSubmittedCount / totalSchools : 0;
    const attendanceRate = totalEnrollment > 0 ? totalAttendance / totalEnrollment : 0;

    res.json({
      totalSchools,
      participatingSchools,
      participationRate: Number(participationRate.toFixed(4)),
      evidenceSubmittedCount,
      evidenceRate: Number(evidenceRate.toFixed(4)),
      totalEnrollment,
      totalAttendance,
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
    const months = ["2025-07", "2025-08", "2025-09"];
    const results = [];

    for (const month of months) {
      const filter = buildFilter({ ...req.query, month });
      const rows = await SchoolResponse.find(filter);

      const totalSchools = rows.length;
      const participatingSchools = rows.filter(r => r.conducted === "Yes").length;
      const evidenceSubmittedCount = rows.filter(r => r.evidenceSubmitted === "Yes").length;
      const totalEnrollment = rows.reduce((sum, r) => sum + r.totalEnrollment, 0);
      const totalAttendance = rows.reduce((sum, r) => sum + r.totalAttendance, 0);

      results.push({
        month,
        totalSchools,
        participationRate: totalSchools > 0 ? Number((participatingSchools / totalSchools).toFixed(4)) : 0,
        evidenceRate: totalSchools > 0 ? Number((evidenceSubmittedCount / totalSchools).toFixed(4)) : 0,
        attendanceRate: totalEnrollment > 0 ? Number((totalAttendance / totalEnrollment).toFixed(4)) : 0,
      });
    }

    res.json(results);
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

function classifyGeoRisk(rate) {
  return classifyRisk(rate);
}

// GET /api/dashboard/geography?level=district&month=2025-08
export async function getGeographyPerformance(req, res) {
  try {
    const level = req.query.level === "block" ? "block" : "district";
    const filter = buildFilter(req.query);

    const rows = await SchoolResponse.find(filter);

    const groups = {};
    for (const r of rows) {
      const key = r[level];
      if (!groups[key]) {
        groups[key] = {
          name: key,
          district: r.district,
          totalSchools: 0,
          participatingSchools: 0,
          evidenceSubmittedCount: 0,
          totalEnrollment: 0,
          weightedAttendanceSum: 0,
        };
      }
      const g = groups[key];
      g.totalSchools += 1;
      if (r.conducted === "Yes") g.participatingSchools += 1;
      if (r.evidenceSubmitted === "Yes") g.evidenceSubmittedCount += 1;
      g.totalEnrollment += r.totalEnrollment;
      g.weightedAttendanceSum += r.attendanceRate * r.totalEnrollment;
    }

    const result = Object.values(groups).map(g => {
      const attendanceRate = g.totalEnrollment > 0 ? g.weightedAttendanceSum / g.totalEnrollment : 0;
      return {
        name: g.name,
        district: g.district,
        totalSchools: g.totalSchools,
        participationRate: Number((g.participatingSchools / g.totalSchools).toFixed(4)),
        evidenceRate: Number((g.evidenceSubmittedCount / g.totalSchools).toFixed(4)),
        attendanceRate: Number(attendanceRate.toFixed(4)),
        riskStatus: classifyGeoRisk(attendanceRate),
      };
    });

    result.sort((a, b) => b.attendanceRate - a.attendanceRate);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}