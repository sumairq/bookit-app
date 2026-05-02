import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { AuthContext } from "./AuthContext";
import type { User } from "../types/Auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on refresh
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get("/users/me");
        setUser(res.data.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  // Don't render children until session is restored to avoid flash of logged-out UI
  if (loading) return null;

  async function login(email: string, password: string) {
    await api.post("/users/login", { email, password });

    // Get user after cookie is set
    const res = await api.get("/users/me");
    setUser(res.data.data.data);
  }

  async function signup(name: string, email: string, password: string, passwordConfirm: string) {
    await api.post("/users/signup", { name, email, password, passwordConfirm });
    const res = await api.get("/users/me");
    setUser(res.data.data.data);
  }

  async function logout() {
    await api.get("/users/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
