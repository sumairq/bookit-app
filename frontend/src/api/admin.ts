import { api } from "./axios";
import type {
  OverviewStats,
  CategoryDistribution,
  PopularExperience,
  BookingsTrendPoint,
  GuideSummary,
  Pagination,
  AdminUser,
  AdminBooking,
  AdminExperience,
  GuideDetail,
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

export async function fetchGuideById(id: string): Promise<GuideDetail> {
  const res = await api.get(`/admin/guides/${id}`);
  return res.data.data;
}

export async function fetchUsers(params: {
  page?: number;
  limit?: number;
  role?: AdminUser["role"];
  search?: string;
} = {}): Promise<{ users: AdminUser[]; pagination: Pagination }> {
  const res = await api.get("/admin/users", { params });
  return { users: res.data.data.users, pagination: res.data.pagination };
}

export async function fetchBookings(params: {
  page?: number;
  limit?: number;
} = {}): Promise<{ bookings: AdminBooking[]; pagination: Pagination }> {
  const res = await api.get("/admin/bookings", { params });
  return { bookings: res.data.data.bookings, pagination: res.data.pagination };
}

export interface ExperiencesPage {
  experiences: AdminExperience[];
  pagination: Pagination;
}

export async function fetchExperiencesPaged(params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
} = {}): Promise<ExperiencesPage> {
  const res = await api.get("/admin/experiences", { params });
  return {
    experiences: res.data.data.experiences,
    pagination: res.data.pagination,
  };
}

export async function updateExperience(
  id: string,
  body: Partial<AdminExperience>
): Promise<AdminExperience> {
  const res = await api.patch(`/experiences/${id}`, body);
  return res.data.data.data;
}

export async function deleteExperience(id: string): Promise<void> {
  await api.delete(`/experiences/${id}`);
}
