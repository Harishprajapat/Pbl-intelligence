import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Grant from "../models/Grant.js";
import GrantFinanceLine from "../models/GrantFinanceLine.js";
import GrantPerformance from "../models/GrantPerformance.js";
import EvidenceAsset from "../models/EvidenceAsset.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvDir = path.join(__dirname, "../../data/grant_evidence/csv");

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

async function seedGrants() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected for grant seeding");

  // ---- 1. Grant Profile + Finance ----
  const financeRows = await readCSV(path.join(csvDir, "01_Grant_Profile_and_Finance.csv"));

  await Grant.deleteMany({});
  await GrantFinanceLine.deleteMany({});

  // build unique Grant profiles (dedupe since each grant appears 15x in this file)
  const grantMap = new Map();
  for (const row of financeRows) {
    if (!grantMap.has(row.grant_id)) {
      grantMap.set(row.grant_id, {
        grantId: row.grant_id,
        donor: row.donor,
        grantName: row.grant_name,
        periodStart: new Date(row.period_start),
        periodEnd: new Date(row.period_end),
        coveredDistricts: row.covered_districts.split(";").map(d => d.trim()),
      });
    }
  }
  await Grant.insertMany([...grantMap.values()]);
  console.log(`Inserted ${grantMap.size} grants`);

  const financeLines = financeRows.map(row => ({
    grantId: row.grant_id,
    reportingMonth: row.reporting_month,
    budgetLine: row.budget_line,
    approvedBudgetUnits: Number(row.approved_budget_units) || 0,
    monthlyUtilizedUnits: Number(row.monthly_utilized_units) || 0,
    cumulativeUtilizedUnits: Number(row.cumulative_utilized_units) || 0,
    cumulativeUtilizationRate: Number(row.cumulative_utilization_rate) || 0,
    financeNote: row.finance_note,
  }));
  await GrantFinanceLine.insertMany(financeLines);
  console.log(`Inserted ${financeLines.length} finance line items`);

  // ---- 2. Grant Performance ----
  const perfRows = await readCSV(path.join(csvDir, "02_Grant_Performance_and_Report_Material.csv"));
  await GrantPerformance.deleteMany({});

  const performance = perfRows.map(row => ({
    grantId: row.grant_id,
    reportingMonth: row.reporting_month,
    reportStatus: row.report_status,
    riskStatus: row.risk_status,
    milestoneSummary: row.milestone_summary,
    draftReportText: row.draft_report_text,
    metrics: {
      periodEndDate: row.period_end_date,
      reportDueDate: row.report_due_date,
      coveredDistricts: row.covered_districts.split(";").map(d => d.trim()),
      sampledSchoolRecords: Number(row.sampled_school_records) || 0,
      schoolsCompletedPBL: Number(row.schools_completed_pbl) || 0,
      pblCompletionRate: Number(row.pbl_completion_rate) || 0,
      schoolsWithEvidence: Number(row.schools_with_evidence) || 0,
      evidenceSubmissionRate: Number(row.evidence_submission_rate) || 0,
      totalEnrollment: Number(row.total_enrollment) || 0,
      totalAttendance: Number(row.total_attendance) || 0,
      attendanceRate: Number(row.attendance_rate) || 0,
    },
  }));
  await GrantPerformance.insertMany(performance);
  console.log(`Inserted ${performance.length} performance records`);

  // ---- 3. Evidence Assets ----
  const evidenceRows = await readCSV(path.join(csvDir, "03_Evidence_and_Media_Index.csv"));
  await EvidenceAsset.deleteMany({});

  const evidence = evidenceRows.map(row => ({
    recordId: row.record_id,
    recordType: row.record_type,
    grantId: row.grant_id,
    reportingMonth: row.reporting_month,
    district: row.district,
    caption: row.summary_or_caption,
    relativePath: row.relative_path,
  }));
  await EvidenceAsset.insertMany(evidence);
  console.log(`Inserted ${evidence.length} evidence assets`);

  console.log("Grant seeding complete.");
  await mongoose.disconnect();
}

seedGrants().catch((err) => {
  console.error("Grant seed failed:", err);
  process.exit(1);
});