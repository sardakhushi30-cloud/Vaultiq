import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Budget() {
  const [limit, setLimit] = useState("");
  const [budget, setBudget] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/budget", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setBudget(data);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchBudget();
  }, [token]);

  const saveBudget = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ limit }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Budget updated!");
      setBudget(data);
      setLimit("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const percent = budget.percentUsed || 0;

  const isSafe = percent <= 80;
  const isWarning = percent > 80 && percent <= 100;
  const isOver = percent > 100;

  return (
    <div className="space-y-8 bg-slate-50 min-h-screen p-6">

      {/* ================= HEADER ================= */}
      <div className="rounded-3xl p-8 bg-linear-to-r from-cyan-500 to-violet-500 text-white shadow-lg">

        <p className="text-xs tracking-[0.3em] uppercase text-white/70">
          Finance Dashboard
        </p>

        <h1 className="text-3xl font-bold mt-2">
          Budget Control Center
        </h1>

        <p className="text-sm text-white/80 mt-2 max-w-xl">
          Track spending, manage limits, and improve savings with smart insights.
        </p>

      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= MAIN CARD ================= */}
        <div className="lg:col-span-2">

          <div className="rounded-3xl p-6 bg-white shadow-md border border-slate-100 space-y-6">

            {/* HEADER ROW */}
            <div className="flex items-center justify-between">

              <h2 className="text-lg font-semibold text-slate-700">
                Budget Overview
              </h2>

              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                isSafe
                  ? "bg-emerald-100 text-emerald-600"
                  : isWarning
                  ? "bg-amber-100 text-amber-600"
                  : "bg-red-100 text-red-600"
              }`}>
                {isSafe ? "Healthy" : isWarning ? "At Risk" : "Over Budget"}
              </span>

            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-3 gap-4">

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500">Budget</p>
                <p className="text-xl font-bold text-slate-700">
                  ₹{budget.limit || 0}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500">Spent</p>
                <p className="text-xl font-bold text-rose-500">
                  ₹{budget.spent || 0}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500">Remaining</p>
                <p className={`text-xl font-bold ${
                  budget.remaining < 0
                    ? "text-rose-500"
                    : "text-emerald-600"
                }`}>
                  ₹{budget.remaining || 0}
                </p>
              </div>

            </div>

            {/* PROGRESS BAR */}
            <div className="space-y-2">

              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">

                <div
                  className={`h-full transition-all duration-700 ${
                    isOver
                      ? "bg-linear-to-r from-red-400 to-orange-500"
                      : isWarning
                      ? "bg-linear-to-r from-amber-400 to-orange-400"
                      : "bg-linear-to-r from-cyan-500 to-violet-500"
                  }`}
                  style={{
                    width: `${Math.min(percent, 100)}%`,
                  }}
                />

              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>{percent}% used</span>
                <span>{Math.max(100 - percent, 0)}% left</span>
              </div>

            </div>

            {/* INSIGHT BOX */}
            <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-100 text-sm text-slate-600">

              💡 Insight: You are currently spending{" "}
              <span className="font-semibold">
                {isSafe ? "within safe limits" : isWarning ? "near limit" : "above budget"}
              </span>

            </div>

          </div>
        </div>

        {/* ================= SIDE CARD ================= */}
        <div>

          <div className="rounded-3xl p-6 bg-white shadow-md border border-slate-100">

            <h2 className="text-lg font-semibold text-slate-700">
              Update Budget
            </h2>

            <p className="text-xs text-slate-500 mt-1 mb-4">
              Set monthly spending limit
            </p>

            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="Enter budget"
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 outline-none focus:ring-2 focus:ring-cyan-400 transition text-slate-700"
            />

            <button
              onClick={saveBudget}
              className="w-full mt-4 rounded-2xl bg-linear-to-r from-cyan-500 to-violet-500 py-3 font-semibold text-white shadow-md hover:scale-[1.02] transition"
            >
              Save Budget
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}