// src/hooks/useTour.ts
import { useState, useEffect } from "react";
import { api } from "../api/axios";
import type { ApiError } from "../types/ApiError";
import type { Tour } from "../types/Tour";

export function useTour(slug?: string | null) {
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function fetchTour() {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get(`/tours/${slug}`);

        const tourData: Tour = res.data.data.data;
        if (!cancelled) setTour(tourData);
      } catch (err) {
        if (cancelled) return;

        // STRICT, NO ANY
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
        if (!cancelled) setLoading(false);
      }
    }

    fetchTour();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { tour, loading, error };
}
