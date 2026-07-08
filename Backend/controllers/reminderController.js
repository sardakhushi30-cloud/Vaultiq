//This file contains the reminder controller functions for the expense tracker application.

import Reminder from "../models/reminderModel.js";

export const addReminder = async (req, res) => {
  try {
    const { title, date, time, note } = req.body;

    const reminder = await Reminder.create({
      userId: req.user.id,
      title,
      date,
      time,
      note,
    });

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReminders = async (req, res) => {
  try {
    // Remove reminders older than today (cleanup at day change)
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
    await Reminder.deleteMany({ userId: req.user.id, date: { $lt: today } });

    const reminders = await Reminder.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    // Filter out reminders whose date+time has already passed for today
    const nowHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`; // HH:MM

    const activeReminders = reminders.filter((reminder) => {
      if (reminder.date > today) return true;
      if (reminder.date < today) return false;
      // reminder.date === today -> compare times as strings HH:MM
      return reminder.time >= nowHHMM;
    });

    res.json(activeReminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const { title, date, time, note } = req.body;

    const updatedReminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, date, time, note },
      { new: true }
    );

    if (!updatedReminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json(updatedReminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const deletedReminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedReminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json({ message: "Reminder deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodayReminders = async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0];

    // Cleanup old reminders (dates before today)
    await Reminder.deleteMany({ userId: req.user.id, date: { $lt: today } });

    // Get today's reminders and sort by time
    const todayReminders = await Reminder.find({
      userId: req.user.id,
      date: today,
    }).sort({ time: 1 });

    // Get tomorrow's reminders to show as "upcoming"
    const tomorrowReminders = await Reminder.find({
      userId: req.user.id,
      date: tomorrow,
    }).sort({ time: 1 });

    // Filter out expired reminders from today (do not delete)
    const now = new Date();
    const nowHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`; // HH:MM
    const activeToday = todayReminders.filter((reminder) => {
      return reminder.time >= nowHHMM;
    });

    // Combine today's active reminders with tomorrow's reminders
    res.status(200).json({
      today: activeToday,
      tomorrow: tomorrowReminders,
      all: [...activeToday, ...tomorrowReminders],
    });
  } catch (error) {
    console.error("Error fetching today's reminders:", error);
    res.status(500).json({
      message: "Failed to fetch today's reminders",
    });
  }
};

// Debug: return all reminders for the user (no filtering)
export const getAllReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};