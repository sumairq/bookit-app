import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BookingsTrendPoint } from "../../types/Admin";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function BookingsTrendChart({
  data,
}: {
  data: BookingsTrendPoint[];
}) {
  const chartData = data.map((d) => ({
    label: `${MONTHS[d.month - 1]} ${String(d.year).slice(2)}`,
    bookings: d.bookings,
    revenue: d.revenue,
  }));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-base font-semibold tracking-tight text-slate-900">
          Bookings trend
        </h2>
        <span className="text-xs text-slate-500">Last 12 months</span>
      </div>

      {chartData.length === 0 ? (
        <EmptyChart />
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="bookingsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#0f172a", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#0f172a"
                strokeWidth={2}
                fill="url(#bookingsFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-slate-200 text-sm text-slate-500">
      No bookings yet.
    </div>
  );
}
