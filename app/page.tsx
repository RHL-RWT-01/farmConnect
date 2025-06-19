import HeroSection from "@/components/sections/HeroSection"
import HowItWorks from "@/components/sections/HowItWorks"
import CallToAction from "@/components/sections/CallToAction"
import Benefits from "../utils/benefits"
import Reviews from "../utils/reviews"

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <HowItWorks />
      <Benefits />
      <Reviews />
      <CallToAction />
    </main>
  )
}
