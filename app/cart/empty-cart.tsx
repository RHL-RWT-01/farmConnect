"use client"

import Link from "next/link"
import { ShoppingBag, ArrowRight, Sprout } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-lg text-center animate-fade-in-up">
      <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-3xl flex items-center justify-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        Looks like you haven&apos;t added any products yet. Start shopping to fill your cart with fresh produce!
      </p>
      <Link href="/products">
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/20 gap-2 px-8" size="lg">
          <Sprout className="h-5 w-5" />
          Browse Products
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}
