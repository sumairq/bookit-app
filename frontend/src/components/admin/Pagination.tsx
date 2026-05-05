import type { Pagination as PaginationT } from "../../types/Admin";

interface Props {
  pagination: PaginationT;
  onChange: (page: number) => void;
}

export default function Pagination({ pagination, onChange }: Props) {
  const { page, pages, total, limit } = pagination;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-5 py-3 text-sm">
      <p className="text-slate-500">
        {total === 0 ? "No results" : `Showing ${from}–${to} of ${total}`}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="rounded-md border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="tabular-nums text-slate-500">
          Page {page} of {Math.max(1, pages)}
        </span>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= pages}
          className="rounded-md border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
