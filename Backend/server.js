//This file contains the main server file of the expense tracker application.

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";

import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import expenseRoute from "./routes/expenseRoutes.js";

import analyticsRoute from "./routes/analyticsRoute.js";
import budgetRoute from "./routes/budgetRoute.js";
import reminderRoute from "./routes/reminderRoute.js";
import { cleanupPastReminders } from "./utils/reminderCleanup.js";

dotenv.config();

const app = express();

// middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect DB
connectDB();

// routes
app.use("/api/user", userRoute);
app.use("/api/expense", expenseRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/budget", budgetRoute);
app.use("/api/reminder", reminderRoute);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Server is running properly.");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});