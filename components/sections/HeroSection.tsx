"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background transition-colors">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_600px] items-center">
          {/* LEFT SECTION */}
          <div className="flex flex-col justify-center space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-foreground">
                Direct Farm-to-Business Marketplace
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Empower farmers to list crops and connect with buyers directly. Eliminate middlemen and ensure fair pricing for all.
              </p>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white transition-transform transform hover:scale-105"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="transition-transform transform hover:scale-105"
              >
                Learn More
              </Button>
            </div>

            {/* SEARCH BAR */}
            <div className="mt-6 flex w-full max-w-md items-center space-x-2">
              <Input
                type="text"
                placeholder="Search for crops..."
                className="rounded-l-md border-r-0 focus-visible:ring-green-500"
              />
              <Button
                type="submit"
                className="rounded-l-none bg-green-600 hover:bg-green-700"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <Image
              src="/placeholder1.png?height=550&width=550"
              width={550}
              height={550}
              alt="Farm produce"
              className="mx-auto rounded-xl object-cover sm:w-full lg:aspect-square transition-all 
                shadow-[0_30px_90px_rgba(34,197,94,0.5)] dark:shadow-[0_30px_90px_rgba(34,197,94,0.3)] hover:scale-105 duration-300"
            />
            {/* Optional image label or badge */}
            <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
              Verified Crops
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
