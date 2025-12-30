import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Experience } from "../api/experiences";
import type { ApiError } from "../types/ApiError";

export function useExperiences() {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchExperiences() {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/experiences");

        const experiences: Experience[] = res.data?.data?.data ?? [];

        if (!cancelled) {
          setData(experiences);
        }
      } catch (err) {
        if (cancelled) return;

        const errorResponse = err as {
          response?: { data?: ApiError };
        };

        const apiError = errorResponse.response?.data;

        setError(apiError?.message || "Failed to load experiences.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchExperiences();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
