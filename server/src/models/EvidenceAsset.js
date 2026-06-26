import mongoose from "mongoose";

const evidenceAssetSchema = new mongoose.Schema({
  recordId: { type: String, required: true },
  recordType: { type: String },        // e.g. "photo", "news_clipping"
  grantId: { type: String, required: true },
  reportingMonth: { type: String, required: true },
  district: { type: String },
  caption: { type: String },
  relativePath: { type: String, required: true }, // filename inside images/
});

evidenceAssetSchema.index({ grantId: 1, reportingMonth: 1 });

export default mongoose.model("EvidenceAsset", evidenceAssetSchema);