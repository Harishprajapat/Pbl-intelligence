import express from "express";
import { listGrants, getGrantMonths, getGrantReport, generateNarrative } from "../controllers/grantController.js";

const router = express.Router();

router.get("/", listGrants);
router.get("/:grantId/months", getGrantMonths);
router.get("/:grantId/report", getGrantReport);
router.post("/:grantId/narrative", generateNarrative);

export default router;