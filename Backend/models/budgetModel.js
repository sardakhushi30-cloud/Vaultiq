//This file contains the budget model for data storage in the expense tracker application.

import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Budget", budgetSchema);