"use client"

import { Minus, Plus, ShoppingBag, Trash2, Shield, Truck, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartActions } from "./cart-actions"
import EmptyCart from "./empty-cart"
import { useCartContext } from "@/contexts/CartContext"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCartContext()

  const cartItemsMap = cart.reduce((acc, item) => {
    const key = item.product.id
    if (!acc[key]) acc[key] = { ...item.product, quantity: 0, farmer: item.product.farmer }
    acc[key].quantity += item.quantity
    return acc
  }, {} as Record<string, typeof cart[number]["product"] & { quantity: number }>)

  const cartItems = Object.values(cartItemsMap)

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = subtotal * 0.07
  const shipping = subtotal > 500 ? 0 : 49.99
  const total = subtotal + tax + shipping

  const isEmpty = cartItems.length === 0

  if (isEmpty) {
    return <EmptyCart />
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
          <ShoppingBag className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold gradient-text">Your Cart</h1>
          <p className="text-sm text-muted-foreground">{cartItems.length} item{cartItems.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4 stagger-children">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden premium-card border-border/50">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-36 w-full sm:h-auto sm:w-36 flex-shrink-0 bg-muted">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          From: {item.farmer?.name || "Unknown"}
                        </p>
                        <p className="font-bold text-green-600 text-lg mt-2">
                          ₹{item.price.toFixed(2)}
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            / {item.unit}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center rounded-xl border overflow-hidden">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-none"
                            disabled={item.quantity <= 1}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/products">
              <Button variant="outline" className="gap-2 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="border-border/50 sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (7%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {subtotal <= 500 && (
                  <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
                    💡 Free shipping on orders above ₹500
                  </p>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col">
              <CartActions />
            </CardFooter>
          </Card>

          {/* Trust badges */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 text-xs">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 text-xs">
              <Truck className="h-4 w-4 text-green-600" />
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
