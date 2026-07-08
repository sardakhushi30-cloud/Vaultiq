//This file contains expense routes for API calling for the expense tracker application.

import express from "express";
import {
  addExpense,
  getExpenses,
  deleteExpense,
  getRecentExpenses,
  updateExpense,
} from "../controllers/expensesController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/", protect, getExpenses);
router.delete("/:id", protect, deleteExpense);
router.get("/recent", protect, getRecentExpenses);
router.put("/:id", protect, updateExpense);
export default router;