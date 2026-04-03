"use client"

import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const reviews = [
  {
    name: "Rajesh Kumar",
    role: "Wheat Farmer, Haryana",
    rating: 5,
    text: "FarmConnect transformed my business. I now sell directly to restaurants and stores without any middlemen taking their cut. My income has increased by 35%!",
    initials: "RK",
  },
  {
    name: "Priya Sharma",
    role: "Restaurant Owner, Delhi",
    rating: 5,
    text: "The quality of produce we get through FarmConnect is outstanding. Fresh, organic vegetables delivered straight from farms. Our customers love the difference!",
    initials: "PS",
  },
  {
    name: "Mohammed Ali",
    role: "Organic Spice Farmer, Kerala",
    rating: 4,
    text: "The analytics dashboard helps me understand which products are in demand. I can plan my crops better and ensure nothing goes to waste. Excellent platform!",
    initials: "MA",
  },
  {
    name: "Sunita Patel",
    role: "Grocery Chain Buyer, Mumbai",
    rating: 5,
    text: "We switched to FarmConnect for 60% of our sourcing. The verified farmer network and transparent pricing make bulk purchasing seamless and cost-effective.",
    initials: "SP",
  },
  {
    name: "Arjun Reddy",
    role: "Mango Orchardist, AP",
    rating: 5,
    text: "Seasonal produce used to be risky — now I list early and get pre-orders. FarmConnect's secure payment system ensures I always get paid on time.",
    initials: "AR",
  },
  {
    name: "Lakshmi Devi",
    role: "Dairy Farmer, Gujarat",
    rating: 4,
    text: "From listing my ghee products to handling deliveries, FarmConnect makes everything simple. The AI assistant even helps me write better product descriptions!",
    initials: "LD",
  },
]

export default function Reviews() {
  return (
    <section id="testimonials" className="w-full py-20 md:py-28 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium text-green-700 dark:text-green-400 mb-4">
            <Star className="h-4 w-4 fill-current" />
            Trusted by Thousands
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl">
            What Our <span className="gradient-text">Users Say</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-lg">
            Real stories from farmers and buyers who transformed their business with FarmConnect
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {reviews.map((review, index) => (
            <Card
              key={index}
              className="border-border/50 premium-card overflow-hidden"
            >
              <CardContent className="p-6 space-y-4">
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-green-500/20" />

                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${
                        s <= review.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground/20"
                      }`}
                    />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
