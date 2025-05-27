"use client"

import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import HeroSection from "@/components/sections/HeroSection"
import HowItWorks from "@/components/sections/HowItWorks"
import CallToAction from "@/components/sections/CallToAction"
import Benefits from "../utils/benefits"
import Reviews from "../utils/reviews"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <HowItWorks />
          <Benefits />
          <Reviews />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
