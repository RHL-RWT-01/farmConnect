"use client"

import {
  Shield,
  Leaf,
  TrendingDown,
  DollarSign,
  Truck,
  BarChart3,
  Award,
} from "lucide-react"

const benefits = [
  {
    icon: <TrendingDown className="h-6 w-6" />,
    title: "Eliminate Middlemen",
    description:
      "Farmers sell directly to buyers, increasing their earnings by up to 40% while reducing prices for consumers.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Verified Sellers",
    description:
      "Every farmer and business is verified, ensuring trust, authenticity, and quality in every transaction.",
  },
  {
    icon: <Leaf className="h-6 w-6" />,
    title: "Organic & Fresh",
    description:
      "Browse a wide selection of organic and freshly harvested produce from farms across India.",
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Fair Pricing",
    description:
      "Transparent pricing with no hidden fees. See exactly what you pay and what farmers earn.",
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Pan-India Delivery",
    description:
      "Reliable logistics network ensures your produce reaches you fresh, anywhere in India.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Smart Analytics",
    description:
      "Farmers get real-time insights into sales, trends, and customer preferences to grow their business.",
  },
]

export default function Benefits() {
  return (
    <section id="features" className="w-full py-20 md:py-28 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium text-green-700 dark:text-green-400 mb-4">
            <Award className="h-4 w-4" />
            Why Choose Us
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Benefits of <span className="gradient-text">FarmConnect</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-lg">
            Building a transparent, efficient, and sustainable agricultural ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border hover:border-green-500/30 premium-card"
            >
              <div className="w-14 h-14 mb-5 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 shadow-sm">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}