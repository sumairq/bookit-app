const styles: Record<string, string> = {
  admin: "bg-violet-100 text-violet-700 ring-violet-200",
  "lead-guide": "bg-emerald-100 text-emerald-700 ring-emerald-200",
  guide: "bg-sky-100 text-sky-700 ring-sky-200",
  user: "bg-slate-100 text-slate-700 ring-slate-200",
};

const labels: Record<string, string> = {
  admin: "Admin",
  "lead-guide": "Lead Guide",
  guide: "Guide",
  user: "User",
};

export default function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
        styles[role] ?? styles.user
      }`}
    >
      {labels[role] ?? role}
    </span>
  );
}
