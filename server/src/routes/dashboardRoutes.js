import express from "express";
import {
  getDashboardSummary,
  getMonthlyTrend,
  getFilterOptions,
  getGeographyPerformance,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", getDashboardSummary);
router.get("/trend", getMonthlyTrend);
router.get("/filters", getFilterOptions);
router.get("/geography", getGeographyPerformance);

export default router;