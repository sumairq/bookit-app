import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchGuideById, promoteGuide } from "../../api/admin";
import type { GuideDetail as GuideDetailT } from "../../types/Admin";
import { useAuth } from "../../context/useAuth";
import RoleBadge from "../../components/admin/RoleBadge";
import KpiCard from "../../components/admin/KpiCard";
import Modal from "../../components/admin/Modal";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-US");

export default function GuideDetail() {
  const { id = "" } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [data, setData] = useState<GuideDetailT | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchGuideById(id)
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load guide");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          to="/admin/guides"
          className="text-sm text-slate-500 hover:underline"
        >
          ← Back to guides
        </Link>
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error ?? "Guide not found."}
        </div>
      </div>
    );
  }

  const { guide, experiences, metrics } = data;

  return (
    <div className="mx-auto max-w-7xl">
      <Link
        to="/admin/guides"
        className="mb-4 inline-block text-sm text-slate-500 hover:underline"
      >
        ← Back to guides
      </Link>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-lg font-semibold uppercase text-slate-600">
            {guide.name
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{guide.name}</h1>
              <RoleBadge role={guide.role} />
            </div>
            <p className="mt-1 text-sm text-slate-500">{guide.email}</p>
          </div>
        </div>

        {isAdmin && guide.role === "guide" && (
          <button
            onClick={() => setPromoteOpen(true)}
            className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
          >
            Promote to Lead Guide
          </button>
        )}
      </header>

      <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Experiences" value={number.format(metrics.experienceCount)} />
        <KpiCard label="Bookings" value={number.format(metrics.bookingCount)} />
        <KpiCard label="Revenue" value={currency.format(metrics.revenue)} />
        <KpiCard
          label="Avg rating"
          value={metrics.avgRating ? metrics.avgRating.toFixed(1) : "—"}
          hint="Across hosted experiences"
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold tracking-tight">
            Hosted experiences
          </h2>
        </div>

        {experiences.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-500">
            This guide isn't assigned to any experiences yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 text-right font-medium">Duration</th>
                  <th className="px-5 py-3 text-right font-medium">Capacity</th>
                  <th className="px-5 py-3 text-right font-medium">Price</th>
                  <th className="px-5 py-3 text-right font-medium">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {experiences.map((exp) => (
                  <tr key={exp._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link
                        to={`/experience/${exp.slug}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {exp.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 capitalize text-slate-600">
                      {exp.category}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-slate-600">
                      {exp.duration}d
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-slate-600">
                      {exp.capacity}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-slate-900">
                      ${exp.price}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-slate-600">
                      {exp.ratingsAverage.toFixed(1)}{" "}
                      <span className="text-xs text-slate-400">
                        ({exp.ratingsQuantity})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={promoteOpen}
        title="Promote to Lead Guide"
        onClose={() => setPromoteOpen(false)}
        footer={
          <>
            <button
              onClick={() => setPromoteOpen(false)}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <PromoteButton
              guideId={guide._id}
              onDone={() => {
                setPromoteOpen(false);
                setReloadKey((k) => k + 1);
              }}
            />
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Promote <strong>{guide.name}</strong> from Guide to Lead Guide. They will
          gain read access to the admin dashboard.
        </p>
      </Modal>
    </div>
  );
}

function PromoteButton({
  guideId,
  onDone,
}: {
  guideId: string;
  onDone: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setPending(true);
    setError(null);
    try {
      await promoteGuide(guideId);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to promote");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {error && <span className="mr-3 text-xs text-red-600">{error}</span>}
      <button
        onClick={go}
        disabled={pending}
        className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {pending ? "Promoting…" : "Promote"}
      </button>
    </>
  );
}
