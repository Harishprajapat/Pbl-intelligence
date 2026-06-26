import mongoose from "mongoose";

const schoolResponseSchema = new mongoose.Schema({
  reportingMonth: { type: String, required: true },      // "2025-07"
  timestamp: { type: Date },
  schoolName: { type: String, required: true },
  schoolCode: { type: String, required: true },           // "SYN-264-AAKD"
  district: { type: String, required: true },
  block: { type: String, required: true },                // "District A - Block 001"
  conducted: { type: String, enum: ["Yes", "No"], required: true },
  evidenceSubmitted: { type: String, enum: ["Yes", "No"], required: true },
  classesConducted: { type: String },                     // "Classes 6, 7 and 8"
  subject: { type: String },                               // "Math and Science"

  class6Enrollment: { type: Number, default: 0 },
  class6ScienceAttendance: { type: Number, default: 0 },
  class6MathAttendance: { type: Number, default: 0 },

  class7Enrollment: { type: Number, default: 0 },
  class7ScienceAttendance: { type: Number, default: 0 },
  class7MathAttendance: { type: Number, default: 0 },

  class8Enrollment: { type: Number, default: 0 },
  class8ScienceAttendance: { type: Number, default: 0 },
  class8MathAttendance: { type: Number, default: 0 },

  totalEnrollment: { type: Number, default: 0 },
  totalAttendance: { type: Number, default: 0 },
  attendanceRate: { type: Number, default: 0 },
  riskStatus: { type: String, enum: ["On Track", "Behind", "At Risk", "Critical"] },
}, { timestamps: true });

// speeds up filtering by month/district/block — we'll use these constantly
schoolResponseSchema.index({ reportingMonth: 1, district: 1, block: 1 });

export default mongoose.model("SchoolResponse", schoolResponseSchema);