"use client"

import { Building2, Sprout, TruckIcon } from "lucide-react"

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted dark:bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm text-green-800 dark:text-green-300">
              Simple Process
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How AgriConnect Works</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Our platform makes it easy for farmers to connect with businesses and sell their crops directly.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3 md:gap-12">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Sprout className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold">Farmers List Crops</h3>
            <p className="text-muted-foreground">
              Create a profile and list your available crops with details on quantity, quality, and pricing.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Building2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold">Businesses Browse & Order</h3>
            <p className="text-muted-foreground">
              Businesses search for crops, compare options, and place orders directly with farmers.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <TruckIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold">Delivery & Payment</h3>
            <p className="text-muted-foreground">
              Coordinate delivery and receive secure payments through our platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
