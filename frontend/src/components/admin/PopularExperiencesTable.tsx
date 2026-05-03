import { Link } from "react-router-dom";
import type { PopularExperience } from "../../types/Admin";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function PopularExperiencesTable({
  rows,
}: {
  rows: PopularExperience[];
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-baseline justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold tracking-tight text-slate-900">
          Most popular experiences
        </h2>
        <span className="text-xs text-slate-500">By bookings</span>
      </div>

      {rows.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-slate-500">
          No bookings yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Experience</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 text-right font-medium">Rating</th>
                <th className="px-5 py-3 text-right font-medium">Bookings</th>
                <th className="px-5 py-3 text-right font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row._id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link
                      to={`/experience/${row.slug}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {row.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 capitalize text-slate-600">
                    {row.category}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-600">
                    {row.ratingsAverage.toFixed(1)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums font-medium text-slate-900">
                    {row.bookings}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-600">
                    {currency.format(row.revenue)}
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
