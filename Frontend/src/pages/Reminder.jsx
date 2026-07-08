/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Reminder() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const isReminderExpired = (d, t) =>
    new Date(`${d}T${t}`) < new Date();

  const getStatus = (d, t) => {
    const now = new Date();
    const target = new Date(`${d}T${t}`);

    if (target.toDateString() === now.toDateString()) return "today";
    if (target > now) return "upcoming";
    return "overdue";
  };

  const fetchReminders = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reminder", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const filtered = data.filter(
        (r) => !isReminderExpired(r.date, r.time)
      );

      setReminders(filtered);
    } catch (err) {
      toast.error(err.message);
    }
  }, [token]);

  useEffect(() => {
    fetchReminders();
    const interval = setInterval(fetchReminders, 60000);
    return () => clearInterval(interval);
  }, [fetchReminders]);

  const handleSubmitReminder = async () => {
    if (!title || !date || !time)
      return toast.error("Fill required fields");

    try {
      setLoading(true);

      const url = editingId
        ? `http://localhost:5000/api/reminder/${editingId}`
        : "http://localhost:5000/api/reminder/add";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, date, time, note }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(editingId ? "Updated" : "Added");

      setTitle("");
      setDate("");
      setTime("");
      setNote("");
      setEditingId(null);

      fetchReminders();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-800 p-8 text-white shadow-xl">
        <p className="text-xs tracking-[0.3em] text-cyan-300 uppercase">
          Reminder Center
        </p>
        <h1 className="text-3xl font-bold mt-2">
          Never miss what matters
        </h1>
        <p className="text-slate-300 mt-2">
          Manage your tasks, deadlines and personal reminders
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* FORM */}
        <div className="bg-white/95 border border-slate-200 rounded-3xl p-6 shadow-xl">

          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {editingId ? "Edit Reminder" : "Create Reminder"}
          </h2>

          <input
            className="w-full p-3 mb-3 border rounded-xl"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="date"
              className="p-3 border rounded-xl"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <input
              type="time"
              className="p-3 border rounded-xl"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <textarea
            className="w-full p-3 border rounded-xl mb-4"
            placeholder="Notes (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button
            onClick={handleSubmitReminder}
            className="w-full py-3 rounded-xl bg-linear-to-r from-cyan-500 to-indigo-500 text-white font-semibold hover:scale-[1.02] transition"
          >
            {loading ? "Saving..." : "Save Reminder"}
          </button>

        </div>

        {/* LIST */}
        <div className="bg-white/95 border border-slate-200 rounded-3xl p-6 shadow-xl">

          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-slate-800">
              Your Reminders
            </h2>
            <span className="text-xs bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full">
              {reminders.length} active
            </span>
          </div>

          <div className="space-y-3">

            {reminders.map((r) => {
              const status = getStatus(r.date, r.time);

              return (
                <div
                  key={r._id}
                  className="p-4 rounded-2xl border bg-white hover:shadow-md transition hover:-translate-y-1"
                >

                  <div className="flex justify-between items-start">

                    <div>
                      <p className="font-semibold text-slate-800">
                        {r.title}
                      </p>

                      <p className="text-sm text-slate-500">
                        {r.date} • {r.time}
                      </p>

                      {r.note && (
                        <p className="text-xs text-slate-400 mt-1">
                          {r.note}
                        </p>
                      )}
                    </div>

                    {/* STATUS BADGE */}
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        status === "today"
                          ? "bg-yellow-100 text-yellow-700"
                          : status === "upcoming"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {status}
                    </span>

                  </div>
                </div>
              );
            })}

          </div>

        </div>

      </div>

    </div>
  );
}