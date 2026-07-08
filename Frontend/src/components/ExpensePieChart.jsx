import {
  ResponsiveContainer,PieChart,Pie,Cell,Tooltip,Legend,} from "recharts";
  const COLORS = ["#06b6d4","#3b82f6","#8b5cf6","#10b981","#f97316","#ef4444","#facc15","#14b8a6",];

  export default function ExpensePieChart({ data }) {
    // Convert objects into array for Recharts
    const chartData = Object.entries(data).map(([category, amount]) => ({
        name: category,
        value: amount,
    }));

    return (
    <div className="glass-card rounded-3xl p-6 flex flex-col items-center">
     <h2 className="self-start mb-5 text-lg font-semibold">
        Expense Category Breakdown
      </h2>

      {chartData.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-20">
          No expense data available
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={50}
              outerRadius={90}
              label={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`₹${value}`, "Spent"]}
            />

            <Legend
    verticalAlign="bottom"
    align="center"
    iconType="circle"
/>
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}