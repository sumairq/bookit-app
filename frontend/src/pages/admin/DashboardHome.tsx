import { useAuth } from "../../context/useAuth";
import { useDashboardData } from "../../hooks/useDashboardData";
import KpiCard from "../../components/admin/KpiCard";
import BookingsTrendChart from "../../components/admin/BookingsTrendChart";
import CategoryDistributionChart from "../../components/admin/CategoryDistributionChart";
import PopularExperiencesTable from "../../components/admin/PopularExperiencesTable";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-US");

export default function DashboardHome() {
  const { user } = useAuth();
  const { overview, categories, popular, trend, loading, error } = useDashboardData();
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

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <SkeletonGrid />
      ) : (
        <>
          <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiCard
              label="Experiences"
              value={number.format(overview?.totalExperiences ?? 0)}
              hint={`${overview?.totalCategories ?? 0} categories`}
            />
            <KpiCard
              label="Bookings"
              value={number.format(overview?.totalBookings ?? 0)}
              hint={`${currency.format(overview?.totalRevenue ?? 0)} revenue`}
            />
            <KpiCard
              label="Guides"
              value={number.format(overview?.totalGuides ?? 0)}
              hint={`${overview?.guidesByRole.leadGuide ?? 0} lead · ${
                overview?.guidesByRole.guide ?? 0
              } guide`}
            />
            <KpiCard
              label="Users"
              value={number.format(overview?.totalUsers ?? 0)}
              hint="Registered customers"
            />
          </section>

          <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <BookingsTrendChart data={trend} />
            </div>
            <div>
              <CategoryDistributionChart data={categories} />
            </div>
          </section>

          <section>
            <PopularExperiencesTable rows={popular} />
          </section>
        </>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="h-72 animate-pulse rounded-xl border border-slate-200 bg-white lg:col-span-2" />
        <div className="h-72 animate-pulse rounded-xl border border-slate-200 bg-white" />
      </div>
      <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />
    </div>
  );
}
