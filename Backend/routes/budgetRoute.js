//This file contains the budget routes for API calling for the expense tracker application.

import express from "express";
import { saveBudget, getBudget } from "../controllers/budgetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, saveBudget);
router.get("/", protect, getBudget);

export default router;