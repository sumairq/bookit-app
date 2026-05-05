import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { fetchUsers } from "../../api/admin";
import type { AdminUser, Pagination as PaginationT } from "../../types/Admin";
import Pagination from "../../components/admin/Pagination";
import RoleBadge from "../../components/admin/RoleBadge";

export default function UsersAdmin() {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState<"" | AdminUser["role"]>("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<AdminUser[]>([]);
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
    const handle = setTimeout(() => {
      fetchUsers({
        page,
        limit: 20,
        role: role || undefined,
        search: search || undefined,
      })
        .then((res) => {
          if (cancelled) return;
          setData(res.users);
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
  }, [page, role, search]);

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          All registered users across the platform.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email…"
          className="w-72 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
        />

        <div className="relative inline-block min-w-[180px]">
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value as typeof role);
              setPage(1);
            }}
            className="appearance-none w-full rounded-md border border-slate-200 bg-white px-3 py-2 pr-10 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="guide">Guide</option>
            <option value="lead-guide">Lead Guide</option>
            <option value="admin">Admin</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronDown size={14} className="text-slate-500" />
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
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={3} className="px-5 py-4">
                        <div className="h-5 animate-pulse rounded bg-slate-100" />
                      </td>
                    </tr>
                  ))
                : data.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-900">
                        {u.name}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{u.email}</td>
                      <td className="px-5 py-3">
                        <RoleBadge role={u.role} />
                      </td>
                    </tr>
                  ))}
              {!loading && data.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No users match your filters.
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
