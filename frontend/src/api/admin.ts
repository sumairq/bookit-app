import { api } from "./axios";
import type {
  OverviewStats,
  CategoryDistribution,
  PopularExperience,
  BookingsTrendPoint,
  GuideSummary,
  Pagination,
} from "../types/Admin";

export async function fetchOverviewStats(): Promise<OverviewStats> {
  const res = await api.get("/admin/stats/overview");
  return res.data.data;
}

export async function fetchCategoryDistribution(): Promise<CategoryDistribution[]> {
  const res = await api.get("/admin/stats/by-category");
  return res.data.data.distribution;
}

export async function fetchPopularExperiences(
  limit = 10
): Promise<PopularExperience[]> {
  const res = await api.get("/admin/stats/popular", { params: { limit } });
  return res.data.data.popular;
}

export async function fetchBookingsTrend(
  months = 12
): Promise<BookingsTrendPoint[]> {
  const res = await api.get("/admin/stats/bookings-trend", { params: { months } });
  return res.data.data.trend;
}

export async function fetchGuides(params: {
  page?: number;
  limit?: number;
  role?: "guide" | "lead-guide";
} = {}): Promise<{ guides: GuideSummary[]; pagination: Pagination }> {
  const res = await api.get("/admin/guides", { params });
  return { guides: res.data.data.guides, pagination: res.data.pagination };
}

export async function promoteGuide(id: string): Promise<void> {
  await api.patch(`/admin/users/${id}/promote`);
}
