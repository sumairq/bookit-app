import { api } from "./axios";

/* =========================
   Domain Types
========================= */

export interface StartLocation {
  description: string;
  type: "Point";
  coordinates: [number, number];
  address: string;
}

export interface Location {
  _id: string;
  description: string;
  type: "Point";
  coordinates: [number, number];
  day: number;
}

export interface Host {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: "lead-guide" | "guide" | "host";
}

export interface Review {
  _id: string;
  review: string;
  rating: number;
  experience: string;
  user: {
    _id: string;
    name: string;
    photo: string;
  };
  createdAt: string;
  id: string;
}

export interface Experience {
  _id: string;
  name: string;
  slug: string;
  duration: number;
  capacity: number;
  category: "art" | "fitness" | "outdoors" | "food" | "craft" | "tech";
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startLocation: StartLocation;
  timeSlots: string[];
  locations: Location[];
  hosts: Host[];
  reviews: Review[];
}

/* =========================
   API Response Shape
========================= */

interface ExperiencesResponse {
  status: "success";
  results: number;
  data: {
    experiences: Experience[];
  };
}

interface ExperienceResponse {
  status: "success";
  data: {
    experience: Experience;
  };
}

/* =========================
   API Calls
========================= */

export const getAllExperiences = async (): Promise<Experience[]> => {
  const res = await api.get<ExperiencesResponse>("/experiences");
  return res.data.data.experiences;
};

export const getExperienceBySlug = async (
  slug: string
): Promise<Experience> => {
  const res = await api.get<ExperienceResponse>(`/experiences/slug/${slug}`);
  return res.data.data.experience;
};
