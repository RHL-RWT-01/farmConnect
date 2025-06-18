"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/auth/callback/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push("/products")
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white rounded shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Log In</h2>

        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded" required />

        <Button type="submit" className="w-full">Log In</Button>

        <p className="text-center text-sm">Don’t have an account? <a href="/signup" className="text-blue-600">Sign up</a></p>
      </form>
    </div>
  )
}
