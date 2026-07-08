//This page is for cleaning up past reminders from the database.
//It is scheduled to run every day at midnight using node-cron in server.js.

import Reminder from "../models/reminderModel.js";

export const cleanupPastReminders = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const result = await Reminder.deleteMany({ date: { $lt: today } });
    if (result.deletedCount > 0) {
      console.log(`Reminder cleanup removed ${result.deletedCount} reminders older than ${today}.`);
    }
  } catch (error) {
    console.error("Reminder cleanup failed:", error);
  }
};


