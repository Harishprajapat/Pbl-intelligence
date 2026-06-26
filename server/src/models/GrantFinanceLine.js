import mongoose from "mongoose";

const grantFinanceLineSchema = new mongoose.Schema({
  grantId: { type: String, required: true },
  reportingMonth: { type: String, required: true }, // "2025-07"
  budgetLine: { type: String, required: true },       // "Facilitator orientation"
  approvedBudgetUnits: { type: Number, default: 0 },
  monthlyUtilizedUnits: { type: Number, default: 0 },
  cumulativeUtilizedUnits: { type: Number, default: 0 },
  cumulativeUtilizationRate: { type: Number, default: 0 },
  financeNote: { type: String },
});

grantFinanceLineSchema.index({ grantId: 1, reportingMonth: 1 });

export default mongoose.model("GrantFinanceLine", grantFinanceLineSchema);