//This file contains the analytics controller function for the expense tracker applications.

import Expense from "../models/expensesModel.js";
import mongoose from "mongoose";

export const getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({ userId });

    const totalAmount = expenses.reduce((sum, e) => {
      return sum + Number(e.amount);
    }, 0);

    res.json({
      totalExpenses: expenses.length,
      totalAmount,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCategoryStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({ userId });

    const stats = {};

    expenses.forEach((e) => {
      const category = e.category || "Other";
      stats[category] = (stats[category] || 0) + Number(e.amount || 0);
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMonthlyStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const monthlyStats = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $group: {
          _id: {
            month: {
              $month: "$date",
            },
          },

          total: {
            $sum: "$amount",
          },
        },
      },

      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    const monthNames = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedData = monthlyStats.map((item) => ({
      month: monthNames[item._id.month],
      total: item.total,
    }));

    res.json(formattedData);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getTopCategory = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({ userId });

    const stats = {};

    expenses.forEach((e) => {
      const cat = e.category || "Other";
      stats[cat] = (stats[cat] || 0) + Number(e.amount || 0);
    });

    let topCategory = "";
    let max = 0;

    for (let key in stats) {
      if (stats[key] > max) {
        max = stats[key];
        topCategory = key;
      }
    }

    res.json({ topCategory, amount: max });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};