import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Experience } from "../api/experiences";
import type { ApiError } from "../types/ApiError";

export function useMyExperiences() {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMyExperiences() {
      try {
        const res = await api.get("/bookings/my-experiences");

        const experiences: Experience[] = res.data?.data?.experiences ?? [];

        if (!cancelled) {
          setData(experiences);
        }
      } catch (err) {
        if (cancelled) return;

        const errorResponse = err as {
          response?: { data?: ApiError };
        };

        setError(
          errorResponse.response?.data?.message ||
            "Failed to load your experiences."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMyExperiences();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
