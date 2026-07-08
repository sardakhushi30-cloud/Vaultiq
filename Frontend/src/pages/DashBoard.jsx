/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import ExpensePieChart from "../components/ExpensePieChart";
import MonthlyExpenseChart from "../components/MonthlyExpenseChart";
import RecentExpenses from "../components/RecentExpenses";
import ExpenseViewModal from "../components/ExpenseViewModal";
import EditExpenseModal from "../components/EditExpenseModal";
import SavingsCard from "../components/SavingsCard";

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [budget, setBudget] = useState({});
  const [categories, setCategories] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [income, setIncome] = useState(0);

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const token = localStorage.getItem("token");

  const totalSpent = summary.totalAmount || 0;
  const totalExpenses = summary.totalExpenses || 0;

  const budgetLimit = budget.limit || 0;
  const percentUsed =
    budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;

  const remaining = budgetLimit - totalSpent;

  const savings = income - totalSpent;
  const savingsPercent = income > 0 ? (savings / income) * 100 : 0;

  const refreshDashboard = async () => {
    try {
      const [res1, res2, res3, res4, res5] = await Promise.all([
        fetch("http://localhost:5000/api/analytics/summary", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/budget", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/analytics/categories", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/analytics/monthly", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/expense/recent", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setSummary(await res1.json() || {});
      setBudget(await res2.json() || {});
      setCategories(await res3.json() || {});
      setMonthlyData(await res4.json() || []);
      setRecentExpenses(await res5.json() || []);
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  useEffect(() => {
    if (token) refreshDashboard();
  }, [token]);

  return (
    <div className="space-y-10 bg-slate-50 min-h-screen p-6">

      {/* ================= HERO (ANIMATED) ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl p-8 bg-linear-to-r from-cyan-500 via-blue-500 to-violet-600 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20 animate-pulse bg-white/10" />

        <p className="text-xs tracking-[0.3em] uppercase text-white/70">
          Financial Overview
        </p>

        <h1 className="text-3xl font-bold mt-2">
          Expense Intelligence Dashboard
        </h1>

        <p className="text-sm text-white/80 mt-2 max-w-2xl">
          Track spending, analyze patterns, and optimize savings with real-time insights.
        </p>
      </motion.div>

      {/* ================= KPI CARDS (ANIMATED STAGGER) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {[
          { label: "Total Expenses", value: totalExpenses, color: "text-cyan-600" },
          { label: "Total Spent", value: `₹${totalSpent}`, color: "text-rose-500" },
          { label: "Savings", value: `₹${remaining}`, color: remaining < 0 ? "text-red-500" : "text-emerald-600" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
          >
            <p className="text-slate-500 text-sm">{item.label}</p>
            <h2 className={`text-3xl font-bold mt-2 ${item.color}`}>
              {item.value}
            </h2>
          </motion.div>
        ))}

      </div>

      {/* ================= ANALYTICS GRID ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">

          {/* BUDGET CARD */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-700">
                Budget Usage
              </h2>

              <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
                {percentUsed.toFixed(1)}%
              </span>
            </div>

            <div className="mt-5 h-3 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-cyan-500 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentUsed, 100)}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>

            <p className="text-sm text-slate-500 mt-3">
              You have used{" "}
              <span className="font-semibold">{percentUsed.toFixed(1)}%</span>{" "}
              of your budget.
            </p>
          </motion.div>

          {/* SAVINGS */}
          <motion.div whileHover={{ scale: 1.01 }}>
            <SavingsCard
              income={income}
              setIncome={setIncome}
              savings={savings}
              savingsPercent={savingsPercent}
            />
          </motion.div>

          {/* MONTHLY CHART */}
          <motion.div whileHover={{ scale: 1.01 }}>
            <MonthlyExpenseChart data={monthlyData} />
          </motion.div>

        </div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ExpensePieChart data={categories} />
        </motion.div>

      </div>

      {/* ================= RECENT EXPENSES ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
      >
        <RecentExpenses
          expenses={recentExpenses}
          onView={(expense) => {
            setSelectedExpense(expense);
            setOpenViewModal(true);
          }}
          onEdit={(expense) => {
            setSelectedExpense(expense);
            setOpenEditModal(true);
          }}
          onDelete={(expense) => {
            toast.success("Deleted");
          }}
        />
      </motion.div>

      {/* MODALS */}
      <ExpenseViewModal
        expense={selectedExpense}
        isOpen={openViewModal}
        onClose={() => setOpenViewModal(false)}
      />

      <EditExpenseModal
        expense={selectedExpense}
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
      />

    </div>
  );
}