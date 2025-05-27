"use client"

import { Button } from "@/components/ui/button"

export default function CallToAction() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-green-600 dark:bg-green-500 text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Ready to Transform Your Agricultural Business?
            </h2>
            <p className="max-w-[900px] md:text-xl">
              Join thousands of farmers and businesses already using FarmConnect to grow their operations.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-300">
              Sign Up Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-700">
              Request Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
