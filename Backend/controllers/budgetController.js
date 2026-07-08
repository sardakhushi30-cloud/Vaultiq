//This file contains the budget controller function for the application.

import Budget from "../models/budgetModel.js";
import Expense from "../models/expensesModel.js";

export const getBudget = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const budget = await Budget.findOne({ userId });

    const expenses = await Expense.find({ userId });

    const spent = expenses.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );

    const limit = budget?.limit || 0;

    const remaining = limit - spent;

    const percentUsed =
      limit > 0 ? (spent / limit) * 100 : 0;

    res.json({
      limit,
      spent,
      remaining,
      percentUsed,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const saveBudget = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const { limit } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { userId },
      { limit },
      { new: true, upsert: true }
    );

    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};