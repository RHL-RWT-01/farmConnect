"use client"

import { Sprout, Search, ShoppingCart, TrendingUp, Package, Star } from "lucide-react"

const steps = [
  {
    icon: <Sprout className="h-7 w-7" />,
    title: "Farmers List Crops",
    description: "Farmers register and list their fresh produce with details, pricing, and photos.",
    step: "01",
  },
  {
    icon: <Search className="h-7 w-7" />,
    title: "Buyers Browse & Search",
    description: "Businesses and consumers browse verified products with advanced filters.",
    step: "02",
  },
  {
    icon: <ShoppingCart className="h-7 w-7" />,
    title: "Order Directly",
    description: "Place orders with secure checkout — pay online or choose cash on delivery.",
    step: "03",
  },
  {
    icon: <Package className="h-7 w-7" />,
    title: "Track & Receive",
    description: "Track your order status in real-time and receive fresh produce at your doorstep.",
    step: "04",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-20 md:py-28 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium text-green-700 dark:text-green-400 mb-4">
            <TrendingUp className="h-4 w-4" />
            Simple Process
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl">
            How <span className="gradient-text">FarmConnect</span> Works
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-lg">
            A seamless journey from farm to your business in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-card border hover:border-green-500/30 premium-card text-center"
            >
              {/* Step number */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                {step.step}
              </div>

              <div className="w-16 h-16 mx-auto mb-5 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
