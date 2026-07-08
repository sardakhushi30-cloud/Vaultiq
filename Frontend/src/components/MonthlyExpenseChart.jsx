import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function MonthlyExpenseChart({ data }) {
  return (
    <>
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Monthly Expense Trend
      </h2>

      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-slate-500">
            No monthly expense data available
          </p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip
                formatter={(value) => [`₹${value}`, "Expense"]}
              />

              <Bar
                dataKey="total"
                fill="#3B82F6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}