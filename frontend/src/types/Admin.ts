export interface OverviewStats {
  totalExperiences: number;
  totalCategories: number;
  totalBookings: number;
  totalUsers: number;
  totalGuides: number;
  guidesByRole: { guide: number; leadGuide: number };
  totalRevenue: number;
}

export interface CategoryDistribution {
  category: string;
  count: number;
  avgPrice: number;
  avgRating: number;
}

export interface PopularExperience {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  imageCover: string;
  ratingsAverage: number;
  bookings: number;
  revenue: number;
}

export interface BookingsTrendPoint {
  year: number;
  month: number;
  bookings: number;
  revenue: number;
}

export interface GuideSummary {
  _id: string;
  name: string;
  email: string;
  role: "guide" | "lead-guide";
  photo: string;
  experienceCount: number;
  bookingCount: number;
  revenue: number;
  avgRating: number | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "guide" | "lead-guide" | "admin";
  photo: string;
}

export interface AdminBooking {
  _id: string;
  price: number;
  paid: boolean;
  createdAt: string;
  user: { _id: string; name: string; email: string } | null;
  experience: { _id: string; name: string } | null;
}

export interface GuideDetail {
  guide: {
    _id: string;
    name: string;
    email: string;
    role: "guide" | "lead-guide";
    photo: string;
  };
  experiences: AdminExperience[];
  metrics: {
    experienceCount: number;
    bookingCount: number;
    revenue: number;
    avgRating: number;
  };
}

export interface AdminExperience {
  _id: string;
  name: string;
  slug: string;
  category: string;
  duration: number;
  capacity: number;
  price: number;
  priceDiscount?: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  summary: string;
  description: string;
  imageCover: string;
}
