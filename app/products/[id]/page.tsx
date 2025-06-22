"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Leaf, Minus, Plus, ShoppingCart } from "lucide-react"

import { useProductContext } from "@/contexts/ProductContext"
import { useCartContext } from "@/contexts/CartContext"

export default function ProductPage({ params }: { params: { id: string } }) {
  const { products } = useProductContext()
  const { addToCart } = useCartContext() 
  const [quantity, setQuantity] = useState(1)

  /* ─── Locate product from context ───────────────────────── */
  const product = products.find((p) => p.id === params.id)
  if (!product) notFound()

  /* ─── Handlers ──────────────────────────────────────────── */
  const increment = () => {
    if (quantity < product.quantity) setQuantity(q => q + 1)
  }
  const decrement = () => {
    if (quantity > 1) setQuantity(q => q - 1)
  }
  const handleAdd = () => addToCart(product, quantity)

  return (
    <div className="container py-8 px-4 md:px-6">
      <Link
        href="/products"
        className="inline-flex items-center text-sm font-medium mb-6 hover:underline text-green-600 dark:text-green-400"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden shadow-xl border border-muted">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover rounded-xl transition-all duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {product.organic && (
            <Badge className="absolute top-4 left-4 bg-green-600 text-white dark:bg-green-500">
              <Leaf className="mr-1 h-3.5 w-3.5" /> Organic
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <header>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Link
                href={`/farmers/${product.farmer.id}`}
                className="hover:underline hover:text-green-600 dark:hover:text-green-400"
              >
                {product.farmer.name}
              </Link>
              <span className="mx-2">•</span>
              <span>{product.farmer.location}</span>
            </div>
          </header>

          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ₹{product.price.toFixed(2)}
            <span className="text-base font-normal text-muted-foreground"> / {product.unit}</span>
          </p>

          <p className="text-muted-foreground">{product.description}</p>

          <Separator />

          {/* Quantity + Add */}
          <div className="space-y-4">
            <div className="flex items-center flex-wrap">
              <span className="font-medium mr-4">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={decrement} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={increment}
                  disabled={quantity >= product.quantity || !product.inStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="ml-4 text-sm text-muted-foreground">
                {product.inStock ? `${product.quantity} available` : "Out of stock"}
              </span>
            </div>

            <Button
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
              onClick={handleAdd}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>

            <div className="text-sm text-muted-foreground">
              Category:{" "}
              <span className="font-medium capitalize">{product.category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
