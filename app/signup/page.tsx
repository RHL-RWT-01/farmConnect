"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"

export default function SignupPage() {
  const { signup, loading, error } = useAuth()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "FARMER",
  })
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signup(form)
  }

  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
      <div className="container max-w-md px-4 space-y-6 bg-background p-6 rounded-xl shadow-xl border border-border 
      ring-1 ring-green-500/10 hover:shadow-[0_0_40px_0_rgba(34,197,94,0.3)] transition-shadow duration-300 ease-in-out">

        <h2 className="text-3xl font-bold text-center text-foreground">
          Create your{" "}
          <span className="text-green-600 dark:text-green-400 underline underline-offset-4">AgriConnect</span> Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="focus-visible:ring-green-500"
          />
          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="focus-visible:ring-green-500"
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="focus-visible:ring-green-500"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md border border-input bg-background text-foreground text-sm focus-visible:ring-green-500"
          >
            <option value="FARMER">Farmer</option>
            <option value="BUYER">Buyer</option>
          </select>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        {error && (
          <p className="text-sm text-center text-red-600">
            {error}
          </p>
        )}

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 dark:text-green-400 hover:underline">Log in</a>
        </p>
      </div>
    </section>
  )
}
