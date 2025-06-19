"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/types/user"   // global type

export function useAuth() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [user, setUser]       = useState<User | null>(null)

  /* ------------------------------------------------------------------ */
  /* Fetch the current user from the server (cookie read server‑side)   */
  /* ------------------------------------------------------------------ */
  const fetchCurrentUser = async (): Promise<User | null> => {
    try {
      const res  = await fetch("/api/auth/me", { credentials: "include" })
      if (!res.ok) return null
      const data = (await res.json()) as { user: User | null }
      return data.user
    } catch {
      return null
    }
  }

  useEffect(() => {
    (async () => {
      const me = await fetchCurrentUser()
      if (me) setUser(me)
    })()
  }, [])


  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")

      const me = await fetchCurrentUser()
      setUser(me)
      router.push("/profile")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const signup = async (payload: {
    name: string
    email: string
    password: string
    role: string
  }) => {
    setLoading(true)
    try {
      const res  = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Signup failed")
      router.push("/login")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    document.cookie = "token=; Max-Age=0; path=/"
    setUser(null)
    router.push("/login")
  }

 
  return {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    signup,
    logout,
    refreshUser: async () => {
      const me = await fetchCurrentUser()
      setUser(me)
      return me
    },
  }
}
