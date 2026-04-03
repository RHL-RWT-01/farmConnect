"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2, CreditCard, Truck, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function CartActions() {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online")
  const router = useRouter()
  const { toast } = useToast()

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          paymentMethod,
          shippingAddress: "",
          notes: "",
        }),
      })

      const data = await res.json()

      if (data.success) {
        if (data.paymentLink) {
          // Redirect to Dodo Payments
          window.location.href = data.paymentLink
        } else if (data.redirectUrl) {
          router.push(data.redirectUrl)
        }
      } else {
        toast({
          title: "Checkout Failed",
          description: data.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to process checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Payment Method Selection */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPaymentMethod("online")}
            className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
              paymentMethod === "online"
                ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                : "border-border hover:border-green-300"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Pay Online
          </button>
          <button
            onClick={() => setPaymentMethod("cod")}
            className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
              paymentMethod === "cod"
                ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                : "border-border hover:border-green-300"
            }`}
          >
            <Truck className="h-4 w-4" />
            Cash on Delivery
          </button>
        </div>
      </div>

      <Button
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-green-500/40"
        size="lg"
        onClick={handleCheckout}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4" />
            {paymentMethod === "online"
              ? "Pay Securely"
              : "Place Order (COD)"}
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Shield className="h-3 w-3" />
        <span>Secure checkout powered by Dodo Payments</span>
      </div>
    </div>
  )
}
