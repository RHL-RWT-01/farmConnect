"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Direct Farm-to-Business Marketplace
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Connect farmers directly with businesses. List crops, find buyers, and grow your agricultural business with our platform.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="bg-green-500 hover:bg-green-600">
                <Link href="/signup" className="flex items-center">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
            <div className="mt-6 flex w-full max-w-md items-center space-x-2">
              <Input type="text" placeholder="Search for crops..." className="rounded-l-md border-r-0" />
              <Button type="submit" className="rounded-l-none bg-green-500 hover:bg-green-700">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>
          <Image
            src="/placeholder1.png?height=550&width=550"
            width={550}
            height={550}
            alt="Farm produce"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:aspect-square shadow-[0_25px_80px_rgba(0,150,0,0.85)]"
          />
        </div>
      </div>
    </section>
  )
} 
