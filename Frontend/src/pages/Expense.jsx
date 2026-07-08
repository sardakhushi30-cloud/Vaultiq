/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import EditExpenseModal from "../components/EditExpenseModal";

export default function Expenses() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const token = localStorage.getItem("token");

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/expense", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setExpenses(data);
    } catch (err) {
      toast.error(err.message);
    }
  }, [token]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async () => {
    if (!title || !amount || !category) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/expense/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          amount: Number(amount),
          category,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Expense added");

      setTitle("");
      setAmount("");
      setCategory("");

      fetchExpenses();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/expense/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Deleted");
      fetchExpenses();
    } catch {
      toast.error("Delete failed");
    }
  };

  const categories = [
    "food","travel","shopping","bills","health","education",
    "entertainment","personal","gifts","subscriptions","savings",
    "investments","gym","miscellaneous"
  ];

  return (
    <div className="space-y-8 bg-slate-50 min-h-screen p-6">

      {/* ================= HERO ================= */}
      <div className="rounded-3xl p-8 bg-linear-to-r from-slate-900 via-indigo-900 to-slate-800 text-white shadow-xl">

        <p className="text-xs tracking-[0.3em] uppercase text-cyan-300">
          Expense Intelligence
        </p>

        <h1 className="text-3xl font-bold mt-2">
          Track Every Transaction
        </h1>

        <p className="text-sm text-white/70 mt-2 max-w-2xl">
          Log, analyze, and manage your spending with precision.
        </p>

      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= ADD EXPENSE ================= */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">

          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Add Expense
          </h2>

          {/* CATEGORY CHIPS */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs border transition ${
                  category === cat
                    ? "bg-cyan-500 text-white border-cyan-500"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* INPUTS */}
          <input
            type="text"
            placeholder="Expense title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 rounded-xl border border-slate-200 p-3 focus:ring-2 focus:ring-cyan-200 outline-none"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mb-4 rounded-xl border border-slate-200 p-3 focus:ring-2 focus:ring-cyan-200 outline-none"
          />

          <button
            onClick={handleAddExpense}
            disabled={loading}
            className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-violet-600 py-3 text-white font-semibold hover:scale-[1.02] transition"
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>

        </div>

        {/* ================= EXPENSE LIST ================= */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-700">
              Recent Expenses
            </h2>

            <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
              {expenses.length} transactions
            </span>
          </div>

          {expenses.length === 0 && (
            <p className="text-slate-400 text-sm">
              No expenses recorded yet
            </p>
          )}

          <div className="space-y-3">

            {expenses.map((exp) => (
              <div
                key={exp._id}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition bg-slate-50"
              >

                <div>
                  <p className="font-semibold text-slate-700">
                    {exp.title}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    <span className="px-2 py-1 bg-cyan-50 text-cyan-600 rounded-full">
                      {exp.category}
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-rose-500">
                    ₹{exp.amount}
                  </p>

                  <div className="flex gap-2 mt-2 justify-end">

                    <button
                      onClick={() => {
                        setSelectedExpense(exp);
                        setOpenEditModal(true);
                      }}
                      className="text-xs px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 hover:bg-cyan-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="text-xs px-3 py-1 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100"
                    >
                      Delete
                    </button>

                  </div>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* MODAL */}
      <EditExpenseModal
        expense={selectedExpense}
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
      />

    </div>
  );
}