import mongoose from "mongoose";

const grantPerformanceSchema = new mongoose.Schema({
  grantId: { type: String, required: true },
  reportingMonth: { type: String, required: true },
  reportStatus: { type: String },
  riskStatus: { type: String },
  milestoneSummary: { type: String },
  draftReportText: { type: String },
  // any numeric performance metrics from the CSV — generic map so we don't
  // need to know every column name in advance
  metrics: { type: mongoose.Schema.Types.Mixed },
});

grantPerformanceSchema.index({ grantId: 1, reportingMonth: 1 });

export default mongoose.model("GrantPerformance", grantPerformanceSchema);