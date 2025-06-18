"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "FARMER",
  })

  const router = useRouter()

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
      alert("Signup failed")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white rounded shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" required />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded" required />

        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="FARMER">Farmer</option>
          <option value="BUYER">Buyer</option>
        </select>

        <Button type="submit" className="w-full">Sign Up</Button>

        <p className="text-center text-sm">Already have an account? <a href="/login" className="text-blue-600">Log in</a></p>
      </form>
    </div>
  )
}
