"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Package, ArrowRight, Home, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center animate-fade-in-up">
        {/* Success Animation */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-20" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-3 gradient-text">
          Order Placed Successfully!
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        {orderId && (
          <p className="text-sm text-muted-foreground mb-8">
            Order ID: <span className="font-mono font-medium text-foreground">{orderId}</span>
          </p>
        )}

        <Card className="mb-8 border-green-200 dark:border-green-900/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-xs text-muted-foreground">Order Confirmed</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-muted rounded-xl flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Processing</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-muted rounded-xl flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Delivery</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {orderId && (
            <Link href={`/orders`}>
              <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                <Package className="h-4 w-4" />
                View Orders
              </Button>
            </Link>
          )}
          <Link href="/products">
            <Button variant="outline" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
