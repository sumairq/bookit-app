import { useAuth } from "../../context/useAuth";

export default function DashboardHome() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back, {user?.name}.{" "}
          {isAdmin
            ? "You have full administrative access."
            : "You're viewing in read-only mode."}
        </p>
      </header>

      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="text-sm text-slate-500">
          KPI cards, charts, and tables land here in step 3.
        </p>
      </div>
    </div>
  );
}
