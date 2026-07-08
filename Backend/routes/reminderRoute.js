//This file contains the reminder routes for API calling for the expense tracker application.

import express from "express";
import {
  addReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  getTodayReminders,
   getAllReminders,
} from "../controllers/reminderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addReminder);
router.get("/today", protect, getTodayReminders);
router.get("/all", protect, getAllReminders);
router.get("/", protect, getReminders);
router.put("/:id", protect, updateReminder);
router.delete("/:id", protect, deleteReminder);

export default router;
