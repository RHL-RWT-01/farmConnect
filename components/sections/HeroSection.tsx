"use client"

import Image from "next/image"
import { ArrowRight, Search, Shield, Truck, Leaf, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push("/signup")
    } else if (user?.role === "BUYER") {
      router.push("/products")
    } else {
      router.push("/farmer/dashboard")
    }
  }

  return (
    <section id="home" className="relative w-full py-16 md:py-24 lg:py-32 xl:py-40 bg-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/3 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_550px] items-center">
          {/* LEFT SECTION */}
          <div className="flex flex-col justify-center space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium text-green-700 dark:text-green-400 animate-fade-in-down">
                <Leaf className="h-4 w-4" />
                India&apos;s Premier Agricultural Marketplace
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none">
                Direct{" "}
                <span className="gradient-text">Farm-to-Business</span>{" "}
                Marketplace
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground leading-relaxed">
                Empower farmers to list crops and connect with buyers directly.
                Eliminate middlemen, ensure fair pricing, and build a sustainable
                agricultural ecosystem.
              </p>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleClick}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-green-500/40 hover:-translate-y-0.5 text-base px-8"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base hover:-translate-y-0.5 transition-all duration-300"
                onClick={() => {
                  const el = document.getElementById("how-it-works")
                  el?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Learn More
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Verified</p>
                  <p className="text-xs text-muted-foreground">Sellers</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Pan India</p>
                  <p className="text-xs text-muted-foreground">Delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Fair</p>
                  <p className="text-xs text-muted-foreground">Pricing</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative animate-slide-in-right">
            <div className="relative">
              <Image
                src="/placeholder1.png?height=550&width=550"
                width={550}
                height={550}
                alt="Farm produce marketplace"
                className="mx-auto rounded-2xl object-cover sm:w-full lg:aspect-square
                  shadow-[0_30px_90px_rgba(34,197,94,0.15)] dark:shadow-[0_30px_90px_rgba(34,197,94,0.1)]
                  hover:scale-[1.02] transition-transform duration-500"
              />
              {/* Floating badges */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg animate-float">
                ✅ Verified Crops
              </div>
              <div className="absolute bottom-6 right-6 bg-white dark:bg-card text-foreground text-sm font-semibold px-4 py-3 rounded-xl shadow-xl border animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>500+ Active Farmers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
