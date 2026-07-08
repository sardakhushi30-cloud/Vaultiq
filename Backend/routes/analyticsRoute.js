//This file contains analytics routes for API calling for the expense tracker application.

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getSummary,
  getCategoryStats,
  getMonthlyStats,
  getTopCategory
} from "../controllers/analyticsController.js";

const router = express.Router();



router.get("/summary", protect, getSummary);
router.get("/categories", protect, getCategoryStats);
router.get("/monthly", protect, getMonthlyStats);
router.get("/top-category", protect, getTopCategory);

export default router;