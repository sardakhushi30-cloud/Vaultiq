/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

export default function ExpenseEditModal({
  expense,
  isOpen,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
  });

  // ✅ Sync expense → form when modal opens
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || "",
        category: expense.category || "",
        amount: expense.amount || "",
        date: expense.date
          ? new Date(expense.date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [expense]);

  if (!isOpen || !expense) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...expense,
      ...formData,
      amount: Number(formData.amount),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            Edit Expense
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-slate-500 hover:text-red-500"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          {/* Title */}
          <div>
            <p className="text-sm text-slate-500">Title</p>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-xl border p-2 mt-1"
              required
            />
          </div>

          {/* Category */}
          <div>
            <p className="text-sm text-slate-500">Category</p>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border p-2 mt-1 capitalize"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <p className="text-sm text-slate-500">Amount</p>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full rounded-xl border p-2 mt-1"
              required
            />
          </div>

          {/* Date */}
          <div>
            <p className="text-sm text-slate-500">Date</p>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-xl border p-2 mt-1"
              required
            />
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gray-200 px-5 py-2 text-slate-700 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-cyan-600 px-5 py-2 text-white hover:bg-cyan-700"
            >
              Update
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}