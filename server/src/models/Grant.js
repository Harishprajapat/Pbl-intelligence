import mongoose from "mongoose";

const grantSchema = new mongoose.Schema({
  grantId: { type: String, required: true, unique: true }, // "GRANT_AA_2025"
  donor: { type: String, required: true },
  grantName: { type: String, required: true },
  periodStart: { type: Date },
  periodEnd: { type: Date },
  coveredDistricts: [{ type: String }], // ["District T", "District G", ...]
});

export default mongoose.model("Grant", grantSchema);