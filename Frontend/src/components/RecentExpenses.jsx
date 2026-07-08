import { useNavigate } from "react-router-dom";

export default function RecentExpenses({
  expenses = [],
  onView,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-3xl p-6 shadow-lg">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Recent Expenses
        </h2>

        <button
          onClick={() => navigate("/expenses")}
          className="group flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition-all duration-300 hover:bg-cyan-600 hover:text-white"
        >
          View All
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>

      {/* EMPTY STATE */}
      {expenses.length === 0 ? (
        <div className="flex justify-center items-center h-52">
          <p className="text-slate-500">No recent expenses found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3">

            <thead>
              <tr>
                <th className="pb-3 text-left text-xs uppercase tracking-wider text-slate-500">
                  Title
                </th>
                <th className="pb-3 text-left text-xs uppercase tracking-wider text-slate-500">
                  Category
                </th>
                <th className="pb-3 text-left text-xs uppercase tracking-wider text-slate-500">
                  Date
                </th>
                <th className="pb-3 text-right text-xs uppercase tracking-wider text-slate-500">
                  Amount
                </th>
                <th className="pb-3 text-center text-xs uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                >

                  {/* TITLE */}
                  <td className="rounded-l-2xl px-5 py-5">
                    <p className="font-semibold text-slate-800">
                      {expense.title}
                    </p>
                    <p className="text-xs text-slate-400">Expense</p>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-5 py-5">
                    <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700">
                      {expense.category}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="px-5 py-5 text-slate-600">
                    {new Date(expense.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* AMOUNT */}
                  <td className="px-5 py-5 text-right">
                    <span className="text-lg font-bold text-rose-500">
                      ₹{expense.amount}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="rounded-r-2xl px-5 py-5 text-center">
                    <div className="flex justify-center gap-2">

                      {/* VIEW */}
                      <button
                        onClick={() => onView(expense)}
                        className="rounded-xl bg-cyan-100 p-2 text-cyan-700 transition hover:scale-110 hover:bg-cyan-500 hover:text-white"
                      >
                        👁️
                      </button>

                      {/* EDIT */}
                      <button
                        onClick={() => onEdit(expense)}
                        className="rounded-xl bg-yellow-100 p-2 text-yellow-700 transition hover:scale-110 hover:bg-yellow-500 hover:text-white"
                      >
                        ✏️
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => onDelete(expense)}
                        className="rounded-xl bg-red-100 p-2 text-red-700 transition hover:scale-110 hover:bg-red-500 hover:text-white"
                      >
                        🗑️
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}