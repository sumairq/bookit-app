import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryDistribution } from "../../types/Admin";

const COLORS: Record<string, string> = {
  art: "#6366f1",
  fitness: "#10b981",
  outdoors: "#f59e0b",
  food: "#ef4444",
  craft: "#8b5cf6",
  tech: "#0ea5e9",
};

const FALLBACK = "#94a3b8";

export default function CategoryDistributionChart({
  data,
}: {
  data: CategoryDistribution[];
}) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-base font-semibold tracking-tight text-slate-900">
          Categories
        </h2>
        <span className="text-xs text-slate-500">{total} experiences</span>
      </div>

      {total === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-slate-200 text-sm text-slate-500">
          No experiences yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_1fr]">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="category"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={COLORS[entry.category] ?? FALLBACK}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="space-y-2">
            {data.map((entry) => {
              const pct = total === 0 ? 0 : Math.round((entry.count / total) * 100);
              return (
                <li
                  key={entry.category}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[entry.category] ?? FALLBACK }}
                    />
                    <span className="capitalize text-slate-700">{entry.category}</span>
                  </span>
                  <span className="tabular-nums text-slate-500">
                    {entry.count} <span className="text-slate-400">· {pct}%</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
