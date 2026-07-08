//This file contains the expense controller functions for the expense tracker application

import Expense from "../models/expensesModel.js";

// ADD EXPENSE
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const expense = await Expense.create({
      userId: req.user.id,
      title,
      amount,
      category,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET EXPENSES
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE EXPENSE
export const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get Recent Expenses
export const getRecentExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.user.id,
    })
      .sort({ date: -1 })
      .limit(5);

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//Update Expenses 
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category } = req.body;

    const expense = await Expense.findOne({
      _id: id,
      userId: req.user.id, // important for security
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.title = title ?? expense.title;
    expense.amount = amount ?? expense.amount;
    expense.category = category ?? expense.category;

    const updatedExpense = await expense.save();

    res.status(200).json({
      message: "Expense updated successfully",
      updatedExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};