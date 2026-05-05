import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchExperiencesPaged,
  updateExperience,
  deleteExperience,
} from "../../api/admin";
import { ChevronDown } from "lucide-react";
import type {
  AdminExperience,
  Pagination as PaginationT,
} from "../../types/Admin";
import { useAuth } from "../../context/useAuth";
import Pagination from "../../components/admin/Pagination";
import Modal from "../../components/admin/Modal";

const CATEGORIES = ["art", "fitness", "outdoors", "food", "craft", "tech"];

export default function ExperiencesAdmin() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<AdminExperience[]>([]);
  const [pagination, setPagination] = useState<PaginationT>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminExperience | null>(null);
  const [deleting, setDeleting] = useState<AdminExperience | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const handle = setTimeout(() => {
      fetchExperiencesPaged({
        page,
        limit: 20,
        category: category || undefined,
        search: search || undefined,
      })
        .then((res) => {
          if (cancelled) return;
          setData(res.experiences);
          setPagination(res.pagination);
          setError(null);
        })
        .catch((err) => {
          if (cancelled) return;
          setError(err instanceof Error ? err.message : "Failed to load");
        })
        .finally(() => !cancelled && setLoading(false));
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [page, category, search, reloadKey]);

  function refresh() {
    setReloadKey((k) => k + 1);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Experiences</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isAdmin ? "Manage all experiences" : "Read-only view"}
          </p>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name…"
          className="w-72 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
        />

        {/* Custom Select */}
        <div className="relative inline-block">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-10 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c[0].toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronDown size={14} className="text-slate-500" />
          </div>
        </div>

        {isAdmin && (
          <span
            className="ml-auto text-xs text-slate-500"
            title="Creating experiences requires image upload — coming in a follow-up step."
          >
            New experience flow coming soon
          </span>
        )}
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
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 text-right font-medium">Duration</th>
                <th className="px-5 py-3 text-right font-medium">Capacity</th>
                <th className="px-5 py-3 text-right font-medium">Price</th>
                <th className="px-5 py-3 text-right font-medium">Rating</th>
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
                : data.map((exp) => (
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
                      {isAdmin && (
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditing(exp)}
                              className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleting(exp)}
                              className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
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
                    No experiences match this filter.
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

      <EditExperienceModal
        experience={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          refresh();
        }}
      />

      <DeleteExperienceModal
        experience={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={() => {
          setDeleting(null);
          refresh();
        }}
      />
    </div>
  );
}

function EditExperienceModal({
  experience,
  onClose,
  onSaved,
}: {
  experience: AdminExperience | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<AdminExperience>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (experience) {
      setForm({
        name: experience.name,
        category: experience.category,
        duration: experience.duration,
        capacity: experience.capacity,
        price: experience.price,
        summary: experience.summary,
        description: experience.description,
      });
      setError(null);
    }
  }, [experience]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!experience) return;
    setSaving(true);
    setError(null);
    try {
      await updateExperience(experience._id, form);
      onSaved();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? // @ts-expect-error narrow
            err.response?.data?.message
          : null;
      setError(message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={!!experience}
      title="Edit experience"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-exp-form"
            disabled={saving}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </>
      }
    >
      <form id="edit-exp-form" onSubmit={save} className="space-y-4">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <Field label="Name">
          <input
            type="text"
            value={form.name ?? ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <select
              value={form.category ?? ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c[0].toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Price (USD)">
            <input
              type="number"
              value={form.price ?? 0}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              min={0}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Duration (days)">
            <input
              type="number"
              value={form.duration ?? 0}
              onChange={(e) =>
                setForm({ ...form, duration: Number(e.target.value) })
              }
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              min={1}
            />
          </Field>
          <Field label="Capacity">
            <input
              type="number"
              value={form.capacity ?? 0}
              onChange={(e) =>
                setForm({ ...form, capacity: Number(e.target.value) })
              }
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              min={1}
            />
          </Field>
        </div>

        <Field label="Summary">
          <input
            type="text"
            value={form.summary ?? ""}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="h-24 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
        </Field>
      </form>
    </Modal>
  );
}

function DeleteExperienceModal({
  experience,
  onClose,
  onDeleted,
}: {
  experience: AdminExperience | null;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    if (!experience) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteExperience(experience._id);
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal
      open={!!experience}
      title="Delete experience"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={deleting}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete"}
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
        Permanently delete <strong>{experience?.name}</strong>? This action
        cannot be undone.
      </p>
    </Modal>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}
