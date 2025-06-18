"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "FARMER",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push("/login")
    } else {
      alert("Signup failed. Try again.")
    }
  }

  return (
    <section className="w-full py-20 md:py-32 lg:py-40">
      <div className="container max-w-md px-4 space-y-6 bg-background p-6 rounded-xl shadow-lg border border-border">
        <h2 className="text-3xl font-bold text-center text-foreground">Create your AgriConnect Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <Input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
          <Input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-input bg-background text-foreground text-sm"
          >
            <option value="FARMER">Farmer</option>
            <option value="BUYER">Buyer</option>
          </select>

          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">Log in</a>
        </p>
      </div>
    </section>
  )
}
