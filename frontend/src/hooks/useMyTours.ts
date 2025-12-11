import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Tour } from "../types/Tour";

export default function useMyTours() {
  const [data, setData] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyTours() {
      try {
        const res = await api.get("bookings/my-tours");
        setData(res.data.data.tours); // assuming backend returns {tours: []}
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load your tours.");
      } finally {
        setLoading(false);
      }
    }
    fetchMyTours();
  }, []);

  return { data, loading, error };
}
