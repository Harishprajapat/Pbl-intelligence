import Grant from "../models/Grant.js";
import GrantFinanceLine from "../models/GrantFinanceLine.js";
import GrantPerformance from "../models/GrantPerformance.js";
import EvidenceAsset from "../models/EvidenceAsset.js";
import SchoolResponse from "../models/SchoolResponse.js";
import { generateGrantNarrative } from "../services/narrativeService.js";



// GET /api/grants
// List all grants — powers the grant selector dropdown
export async function listGrants(req, res) {
  try {
    const grants = await Grant.find({});
    res.json(grants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/grants/:grantId/months
// List reporting months available for a specific grant
export async function getGrantMonths(req, res) {
  try {
    const months = await GrantPerformance.distinct("reportingMonth", { grantId: req.params.grantId });
    res.json(months.sort());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/grants/:grantId/report?month=2025-08
// Returns the full fact panel: grant profile, finance, performance,
// live cross-check against primary PBL data for covered districts, and evidence.
// This is 100% deterministic — no AI involved here.
export async function getGrantReport(req, res) {
  try {
    const { grantId } = req.params;
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "month query param is required" });
    }

    const grant = await Grant.findOne({ grantId });
    if (!grant) return res.status(404).json({ error: "Grant not found" });

    const financeLines = await GrantFinanceLine.find({ grantId, reportingMonth: month });
    const performance = await GrantPerformance.findOne({ grantId, reportingMonth: month });
    const evidence = await EvidenceAsset.find({ grantId, reportingMonth: month });

    // Live cross-check: recompute attendance/participation directly from primary
    // school data for this grant's covered districts, for the same month.
    // This proves the report isn't just redisplaying static CSV numbers —
    // it's grounded in the same source of truth as the main dashboard.
    const liveStats = await SchoolResponse.aggregate([
      {
        $match: {
          reportingMonth: month,
          district: { $in: grant.coveredDistricts },
        },
      },
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
          weightedAttendanceSum: {
            $sum: { $multiply: ["$attendanceRate", "$totalEnrollment"] },
          },
        },
      },
    ]);

    const live = liveStats[0];
    const liveComputed = live
      ? {
          totalSchools: live.totalSchools,
          participationRate: Number((live.participatingSchools / live.totalSchools).toFixed(4)),
          evidenceRate: Number((live.evidenceSubmittedCount / live.totalSchools).toFixed(4)),
          attendanceRate: live.totalEnrollment > 0
            ? Number((live.weightedAttendanceSum / live.totalEnrollment).toFixed(4))
            : 0,
        }
      : null;

    res.json({
      grant: {
        grantId: grant.grantId,
        donor: grant.donor,
        grantName: grant.grantName,
        coveredDistricts: grant.coveredDistricts,
        periodStart: grant.periodStart,
        periodEnd: grant.periodEnd,
      },
      reportingMonth: month,
      finance: financeLines,
      performance: performance || null,
      liveComputedFromPrimaryData: liveComputed, // ground truth, separate from static CSV
      evidence,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/grants/:grantId/narrative
// Body: { month: "2025-08", aiEnabled: true }
// Reuses the same fact-gathering logic as getGrantReport, then generates narrative text.
export async function generateNarrative(req, res) {
  try {
    const { grantId } = req.params;
    const { month, aiEnabled } = req.body;
    console.log("DEBUG req.body:", req.body, "aiEnabled type:", typeof aiEnabled);

    if (!month) return res.status(400).json({ error: "month is required" });

    const grant = await Grant.findOne({ grantId });
    if (!grant) return res.status(404).json({ error: "Grant not found" });

    const finance = await GrantFinanceLine.find({ grantId, reportingMonth: month });
    const performance = await GrantPerformance.findOne({ grantId, reportingMonth: month });

    const liveStats = await SchoolResponse.aggregate([
      { $match: { reportingMonth: month, district: { $in: grant.coveredDistricts } } },
      {
        $group: {
          _id: null,
          totalSchools: { $sum: 1 },
          totalEnrollment: { $sum: "$totalEnrollment" },
          weightedAttendanceSum: { $sum: { $multiply: ["$attendanceRate", "$totalEnrollment"] } },
        },
      },
    ]);
    const live = liveStats[0];
    const liveComputedFromPrimaryData = {
      attendanceRate: live && live.totalEnrollment > 0
        ? Number((live.weightedAttendanceSum / live.totalEnrollment).toFixed(4))
        : 0,
    };

    const factPanel = { grant, reportingMonth: month, performance, liveComputedFromPrimaryData, finance };

    const result = await generateGrantNarrative(factPanel, aiEnabled);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}