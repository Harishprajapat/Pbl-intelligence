import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import SchoolResponse from "../models/SchoolResponse.js";
import { computeSchoolMetrics } from "../services/riskEngine.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../../data");

const files = [
  "PBL_School_Response_Data_July_2025.csv",
  "PBL_School_Response_Data_August_2025.csv",
  "PBL_School_Response_Data_September_2025.csv",
];

// Maps the long CSV question-text headers to our clean schema field names
function mapRow(raw) {
  const base = {
    reportingMonth: raw["Reporting Month"],
    timestamp: new Date(raw["Timestamp"]),
    schoolName: raw["What is the name of your school?"],
    schoolCode: raw["What is your school's synthetic school code?"],
    district: raw["What is the name of your district?"],
    block: raw["Block Details"],
    conducted: raw["Was the PBL project conducted in your school this month?"],
    evidenceSubmitted: raw["Was evidence submitted for the completed PBL project?"],
    classesConducted: raw["In which class/classes did you conduct the PBL project?"],
    subject: raw["Which subject do you teach?"],

    class6Enrollment: Number(raw["Total number of students enrolled in Class 6, including all sections"]) || 0,
    class6ScienceAttendance: Number(raw["Average student attendance during the Class 6 PBL Science session. If you did not teach Science in Class 6, enter 0."]) || 0,
    class6MathAttendance: Number(raw["Average student attendance during the Class 6 PBL Math session. If you did not teach Math in Class 6, enter 0."]) || 0,

    class7Enrollment: Number(raw["Total number of students enrolled in Class 7, including all sections"]) || 0,
    class7ScienceAttendance: Number(raw["Average student attendance during the Class 7 PBL Science session. If you did not teach Science in Class 7, enter 0."]) || 0,
    class7MathAttendance: Number(raw["Average student attendance during the Class 7 PBL Math session. If you did not teach Math in Class 7, enter 0."]) || 0,

    class8Enrollment: Number(raw["Total number of students enrolled in Class 8, including all sections"]) || 0,
    class8ScienceAttendance: Number(raw["Average student attendance during the Class 8 PBL Science session. If you did not teach Science in Class 8, enter 0."]) || 0,
    class8MathAttendance: Number(raw["Average student attendance during the Class 8 PBL Math session. If you did not teach Math in Class 8, enter 0."]) || 0,
  };

  // We compute these ourselves with our own riskEngine instead of trusting
  // the CSV's pre-baked "Derived:" columns — proves our logic is correct.
  const computed = computeSchoolMetrics(base);

  return { ...base, ...computed };
}

async function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => rows.push(mapRow(row)))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected for seeding");

  await SchoolResponse.deleteMany({});
  console.log("Cleared existing SchoolResponse data");

  let totalInserted = 0;
  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const rows = await readCSV(filePath);
    await SchoolResponse.insertMany(rows);
    totalInserted += rows.length;
    console.log(`Inserted ${rows.length} rows from ${file}`);
  }

  console.log(`Done. Total inserted: ${totalInserted}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});