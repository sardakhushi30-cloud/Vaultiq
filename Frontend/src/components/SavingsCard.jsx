export default function SavingsCard({
  income,
  savings,
  savingsPercent,
  setIncome,
}) {
  const isNegative = savings < 0;

  return (
    <div className="glass-card rounded-3xl p-6 shadow-lg bg-white/60 backdrop-blur-md border border-white/40">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Savings Tracker
          </h2>
          <p className="text-xs text-gray-500">
            Track your monthly savings progress
          </p>
        </div>

        <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
          {savingsPercent.toFixed(1)}%
        </div>
      </div>

      {/* Income Input */}
      <div className="mb-5">
        <label className="text-sm text-gray-600 mb-1 block">
          Monthly Income
        </label>

        <input
          type="number"
          placeholder="e.g. 50000"
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
        />
      </div>

      {/* Savings Display */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">Current Savings</p>

          <h2
            className={`text-3xl font-bold mt-1 ${
              isNegative ? "text-red-500" : "text-green-600"
            }`}
          >
            ₹{savings.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="text-xs text-gray-500">
          Ideal target: 20%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-cyan-500 to-violet-500 transition-all duration-500"
          style={{ width: `${Math.min(savingsPercent, 100)}%` }}
        />
      </div>

      {/* Hint */}
      <p className="text-xs text-gray-400 mt-3">
        Tip: Try saving at least 20% of your income every month.
      </p>
    </div>
  );
}