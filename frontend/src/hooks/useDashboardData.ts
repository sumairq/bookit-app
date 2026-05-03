import { useEffect, useState } from "react";
import {
  fetchOverviewStats,
  fetchCategoryDistribution,
  fetchPopularExperiences,
  fetchBookingsTrend,
} from "../api/admin";
import type {
  OverviewStats,
  CategoryDistribution,
  PopularExperience,
  BookingsTrendPoint,
} from "../types/Admin";

interface DashboardData {
  overview: OverviewStats | null;
  categories: CategoryDistribution[];
  popular: PopularExperience[];
  trend: BookingsTrendPoint[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    overview: null,
    categories: [],
    popular: [],
    trend: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [overview, categories, popular, trend] = await Promise.all([
          fetchOverviewStats(),
          fetchCategoryDistribution(),
          fetchPopularExperiences(8),
          fetchBookingsTrend(12),
        ]);
        if (cancelled) return;
        setData({ overview, categories, popular, trend });
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...data, loading, error };
}
