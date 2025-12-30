// src/hooks/useExperience.ts
import { useState, useEffect } from "react";
import { api } from "../api/axios";
import type { ApiError } from "../types/ApiError";
import type { Experience } from "../api/experiences";

export function useExperience(slug?: string | null) {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function fetchExperience() {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get(`/experiences/slug/${slug}`);
        console.log(res);

        const experienceData: Experience = res.data.data.data;

        if (!cancelled) {
          setExperience(experienceData);
        }
      } catch (err) {
        if (cancelled) return;

        const errorResponse = err as {
          response?: { data?: ApiError };
        };

        const apiError = errorResponse.response?.data;

        if (apiError?.message) {
          setError(apiError.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchExperience();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { experience, loading, error };
}
