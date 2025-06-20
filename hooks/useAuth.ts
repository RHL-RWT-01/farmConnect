"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/user"; // global type
import { readToken, verifyToken } from "@/lib/auth";

export function useAuth() {
  const router = useRouter();
  const [hasFetched, setHasFetched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchCurrentUser = async (): Promise<User | null> => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // 🔐 ensures cookie is sent with the request
      });

      if (!res.ok) {
        console.warn("Failed to fetch user:", res.status);
        return null;
      }

      const data = await res.json();
      return data.user as User;
    } catch (err) {
      console.error("Error fetching current user:", err);
      return null;
    }
  };
  useEffect(() => {
    (async () => {
      setLoading(true);
      const me = await fetchCurrentUser();
      if (me) setUser(me);
      setHasFetched(true);
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Login call
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Step 2: Get current user
      const meRes = await fetch("/api/auth/me", {
        credentials: "include", // ✅ sends cookies
      });

      const { user } = await meRes.json(); // expects `{ user: ... }`

      // Step 3: Handle user logic safely
      if (user) {
        setUser(user);

        // ✅ Redirect based on role
        router.push("/profile");
      } else {
        console.warn("Login succeeded, but user fetch failed");
        setError("Failed to fetch user profile.");
      }
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    document.cookie = "token=; Max-Age=0; path=/";
    setUser(null);
    router.push("/login");
  };

  return {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    signup,
    logout,
    hasFetched,
    refreshUser: async () => {
      const me = await fetchCurrentUser();
      setUser(me);
      return me;
    },
  };
}
