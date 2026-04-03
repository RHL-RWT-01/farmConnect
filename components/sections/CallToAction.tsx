"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CallToAction() {
  return (
    <section className="w-full py-20 md:py-28 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      {/* Decorative elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

      <div className="container px-4 md:px-6 relative">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Join India&apos;s fastest growing agri-marketplace
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl mb-6 leading-tight">
            Ready to Transform Your Agricultural Business?
          </h2>
          <p className="text-lg text-green-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re a farmer looking to reach more customers or a business
            seeking fresh, quality produce — FarmConnect has you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-green-50 shadow-xl shadow-black/10 text-base px-8 hover:-translate-y-0.5 transition-all duration-300"
              >
                Start Free Today <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/products">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-base px-8 hover:-translate-y-0.5 transition-all duration-300"
              >
                Browse Products
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20">
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-green-100 mt-1">Active Farmers</p>
            </div>
            <div>
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm text-green-100 mt-1">Products Listed</p>
            </div>
            <div>
              <p className="text-3xl font-bold">₹5Cr+</p>
              <p className="text-sm text-green-100 mt-1">Trade Volume</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
