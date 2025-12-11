import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Tour } from "../types/Tour";

export default function useTours() {
  const [data, setData] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTours() {
      try {
        const res = await api.get("/tours");
        setData(res.data.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load tours.");
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  return { data, loading, error };
}
