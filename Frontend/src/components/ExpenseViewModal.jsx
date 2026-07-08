export default function ExpenseViewModal({
  expense,
  isOpen,
  onClose,
}) {
  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold text-slate-800">
            Expense Details
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-slate-500 hover:text-red-500"
          >
            ×
          </button>

        </div>

        <div className="mt-8 space-y-5">

          <div>
            <p className="text-sm text-slate-500">
              Title
            </p>

            <p className="font-semibold text-lg">
              {expense.title}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Category
            </p>

            <p className="capitalize font-semibold">
              {expense.category}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Amount
            </p>

            <p className="text-2xl font-bold text-rose-500">
              ₹{expense.amount}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Date
            </p>

            <p>
              {new Date(expense.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

        </div>

        <div className="mt-8 flex justify-end">

          <button
            onClick={onClose}
            className="rounded-xl bg-cyan-600 px-5 py-2 text-white hover:bg-cyan-700"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}