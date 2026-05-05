import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { fetchGuides, promoteGuide } from "../../api/admin";
import type {
  GuideSummary,
  Pagination as PaginationT,
} from "../../types/Admin";
import { useAuth } from "../../context/useAuth";
import Pagination from "../../components/admin/Pagination";
import RoleBadge from "../../components/admin/RoleBadge";
import Modal from "../../components/admin/Modal";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function GuidesAdmin() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [page, setPage] = useState(1);
  const [role, setRole] = useState<"" | "guide" | "lead-guide">("");
  const [data, setData] = useState<GuideSummary[]>([]);
  const [pagination, setPagination] = useState<PaginationT>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoting, setPromoting] = useState<GuideSummary | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchGuides({ page, limit: 20, role: role || undefined })
      .then((res) => {
        if (cancelled) return;
        setData(res.guides);
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
  }, [page, role, reloadKey]);

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Guides</h1>
        <p className="mt-1 text-sm text-slate-500">
          Performance metrics across hosted experiences.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative inline-block">
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value as typeof role);
              setPage(1);
            }}
            className="appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-10 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
          >
            <option value="">All roles</option>
            <option value="guide">Guide</option>
            <option value="lead-guide">Lead Guide</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

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
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 text-right font-medium">
                  Experiences
                </th>
                <th className="px-5 py-3 text-right font-medium">Bookings</th>
                <th className="px-5 py-3 text-right font-medium">Revenue</th>
                <th className="px-5 py-3 text-right font-medium">Avg rating</th>
                {isAdmin && (
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={isAdmin ? 7 : 6} className="px-5 py-4">
                        <div className="h-5 animate-pulse rounded bg-slate-100" />
                      </td>
                    </tr>
                  ))
                : data.map((g) => (
                    <tr key={g._id} className="hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <Link
                          to={`/admin/guides/${g._id}`}
                          className="font-medium text-slate-900 hover:underline"
                        >
                          {g.name}
                        </Link>
                        <p className="text-xs text-slate-500">{g.email}</p>
                      </td>
                      <td className="px-5 py-3">
                        <RoleBadge role={g.role} />
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-slate-600">
                        {g.experienceCount}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-slate-900">
                        {g.bookingCount}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-slate-600">
                        {currency.format(g.revenue)}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-slate-600">
                        {g.avgRating ? g.avgRating.toFixed(1) : "—"}
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-3 text-right">
                          {g.role === "guide" ? (
                            <button
                              onClick={() => setPromoting(g)}
                              className="rounded-md border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                            >
                              Promote
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
              {!loading && data.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdmin ? 7 : 6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No guides found.
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

      <PromoteModal
        guide={promoting}
        onClose={() => setPromoting(null)}
        onPromoted={() => {
          setPromoting(null);
          setReloadKey((k) => k + 1);
        }}
      />
    </div>
  );
}

function PromoteModal({
  guide,
  onClose,
  onPromoted,
}: {
  guide: GuideSummary | null;
  onClose: () => void;
  onPromoted: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    if (!guide) return;
    setPending(true);
    setError(null);
    try {
      await promoteGuide(guide._id);
      onPromoted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to promote");
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal
      open={!!guide}
      title="Promote to Lead Guide"
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={pending}
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {pending ? "Promoting…" : "Promote"}
          </button>
        </>
      }
    >
      {error && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <p className="text-sm text-slate-600">
        Promote <strong>{guide?.name}</strong> from Guide to Lead Guide. They
        will gain read access to the admin dashboard.
      </p>
    </Modal>
  );
}
