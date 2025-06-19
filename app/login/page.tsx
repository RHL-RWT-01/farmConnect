"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
    const router = useRouter()
    const [form, setForm] = useState({ email: "", password: "" })

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
            alert("Invalid credentials.")
        }
    }

    return (
        <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
            <div className="container max-w-md px-4 space-y-6 bg-background p-6 rounded-xl shadow-xl border border-border 
    ring-1 ring-green-500/10 hover:shadow-[0_0_40px_0_rgba(34,197,94,0.3)] transition-shadow duration-300 ease-in-out">

                <h2 className="text-3xl font-bold text-center text-foreground">
                    Welcome back to{" "}
                    <span className="text-green-600 dark:text-green-400 underline underline-offset-4">AgriConnect</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors"
                    >
                        Log In
                    </Button>
                </form>

                <p className="text-sm text-center text-muted-foreground">
                    Don’t have an account?{" "}
                    <a href="/signup" className="text-green-600 dark:text-green-400 hover:underline">Sign up</a>
                </p>
            </div>
        </section>

    )
}
