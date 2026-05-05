import { useEffect, useState } from "react";
import { fetchBookings } from "../../api/admin";
import type { AdminBooking, Pagination as PaginationT } from "../../types/Admin";
import Pagination from "../../components/admin/Pagination";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default function BookingsAdmin() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdminBooking[]>([]);
  const [pagination, setPagination] = useState<PaginationT>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBookings({ page, limit: 20 })
      .then((res) => {
        if (cancelled) return;
        setData(res.bookings);
        setPagination(res.pagination);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="mt-1 text-sm text-slate-500">
          All bookings, most recent first.
        </p>
      </header>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Experience</th>
                <th className="px-5 py-3 text-right font-medium">Price</th>
                <th className="px-5 py-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-5 py-4">
                        <div className="h-5 animate-pulse rounded bg-slate-100" />
                      </td>
                    </tr>
                  ))
                : data.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 text-slate-600">
                        {dateFmt.format(new Date(b.createdAt))}
                      </td>
                      <td className="px-5 py-3">
                        {b.user ? (
                          <>
                            <p className="font-medium text-slate-900">{b.user.name}</p>
                            <p className="text-xs text-slate-500">{b.user.email}</p>
                          </>
                        ) : (
                          <span className="text-slate-400">Deleted user</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-700">
                        {b.experience?.name ?? (
                          <span className="text-slate-400">Deleted experience</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-slate-900">
                        {currency.format(b.price)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                            b.paid
                              ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
                              : "bg-amber-100 text-amber-700 ring-amber-200"
                          }`}
                        >
                          {b.paid ? "Paid" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                    No bookings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200">
          <Pagination pagination={pagination} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
