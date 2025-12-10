import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { AuthContext } from "./AuthContext";
import type { User } from "../types/Auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("AuthProvider mounted");

  // Restore session on refresh
  useEffect(() => {
    async function loadUser() {
      console.log("Restoring user session...");

      try {
        const res = await api.get("/api/v1/users/me");
        setUser(res.data.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  async function login(email: string, password: string) {
    await api.post("/api/v1/users/login", { email, password });

    // Get user after cookie is set
    const res = await api.get("/api/v1/users/me");
    setUser(res.data.data.data);
  }

  async function logout() {
    await api.get("/api/v1/users/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
