"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { use } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChevronLeft,
  Leaf,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  MapPin,
  Shield,
  Truck,
  MessageCircle,
  Send,
  Heart,
} from "lucide-react"
import { useCartContext } from "@/contexts/CartContext"
import { useAuth } from "@/hooks/useAuth"
import type { Product, Review } from "@/types/product"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { addToCart } = useCartContext()
  const { user, isAuthenticated } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/api/products?page=1&limit=100`)
        const data = await res.json()
        const found = data.products?.find((p: any) => p.id === resolvedParams.id)
        if (found) {
          setProduct({
            ...found,
            farmer: {
              id: found.farmer?.id || found.farmerId,
              name: found.farmer?.name || "Unknown",
              location: found.farmer?.location || "",
              image: found.farmer?.image || "",
            },
          })
        }

        // Fetch reviews
        const revRes = await fetch(`/api/reviews?productId=${resolvedParams.id}`)
        const revData = await revRes.json()
        setReviews(revData.reviews || [])
      } catch {
        console.error("Failed to load product")
      } finally {
        setLoading(false)
      }
    })()
  }, [resolvedParams.id])

  const submitReview = async () => {
    if (!reviewText.trim()) return
    setSubmittingReview(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: resolvedParams.id,
          rating: reviewRating,
          comment: reviewText,
        }),
      })
      if (res.ok) {
        const revRes = await fetch(`/api/reviews?productId=${resolvedParams.id}`)
        const revData = await revRes.json()
        setReviews(revData.reviews || [])
        setReviewText("")
        setReviewRating(5)
      }
    } catch {
      console.error("Failed to submit review")
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-8 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-8 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    )
  }

  const increment = () => {
    if (quantity < product.quantity) setQuantity((q) => q + 1)
  }
  const decrement = () => {
    if (quantity > 1) setQuantity((q) => q - 1)
  }

  return (
    <div className="container py-8 px-4 md:px-6 max-w-6xl">
      <Link
        href="/products"
        className="inline-flex items-center text-sm font-medium mb-6 hover:underline text-green-600 dark:text-green-400 transition-colors"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl border border-border/50 group">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {product.organic && (
            <Badge className="absolute top-4 left-4 bg-green-600 text-white rounded-full shadow-lg">
              <Leaf className="mr-1 h-3.5 w-3.5" /> Organic
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2 rounded-full">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              <span>{product.farmer.name} • {product.farmer.location}</span>
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Rating */}
            {(product.reviewCount || 0) > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${
                        s <= Math.round(product.rating || 0)
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          <p className="text-3xl font-bold text-green-600">
            ₹{product.price.toFixed(2)}
            <span className="text-base font-normal text-muted-foreground ml-2">
              / {product.unit}
            </span>
          </p>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <Separator />

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 text-xs">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Verified Seller</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Truck className="h-4 w-4 text-green-600" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Star className="h-4 w-4 text-green-600" />
              <span>Quality Assured</span>
            </div>
          </div>

          <Separator />

          {/* Quantity + Add */}
          <div className="space-y-4">
            <div className="flex items-center flex-wrap gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-xl overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrement}
                  disabled={quantity <= 1}
                  className="rounded-none"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={increment}
                  disabled={quantity >= product.quantity || !product.inStock}
                  className="rounded-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.inStock
                  ? `${product.quantity} available`
                  : "Out of stock"}
              </span>
            </div>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/20 transition-all hover:shadow-green-500/40"
              onClick={() => addToCart(product, quantity)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>

            {/* Wishlist & Message Farmer */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/wishlist", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({ productId: product.id }),
                    })
                    const data = await res.json()
                    if (data.action === "added") {
                      alert("Added to wishlist!")
                    } else {
                      alert("Removed from wishlist")
                    }
                  } catch {
                    alert("Please log in to save items")
                  }
                }}
              >
                <Heart className="h-4 w-4" />
                Save
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={async () => {
                  if (!isAuthenticated) {
                    alert("Please log in to message farmers")
                    return
                  }
                  try {
                    await fetch("/api/messages", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({
                        receiverId: product.farmer.id,
                        content: `Hi! I'm interested in your product "${product.name}" listed at ₹${product.price}/${product.unit}. Is it still available?`,
                      }),
                    })
                    alert("Message sent! Check your Messages page.")
                  } catch {
                    alert("Failed to send message")
                  }
                }}
              >
                <MessageCircle className="h-4 w-4" />
                Message Farmer
              </Button>
            </div>
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>
              Category: <strong className="capitalize text-foreground">{product.category}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-green-600" />
          Reviews ({reviews.length})
        </h2>

        {/* Write review */}
        {isAuthenticated && user?.role === "BUYER" && (
          <Card className="mb-6 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Write a Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setReviewRating(s)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        s <= reviewRating
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground/30 hover:text-amber-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full px-4 py-3 text-sm bg-muted rounded-xl border-0 outline-none focus:ring-2 focus:ring-green-500/30 resize-none min-h-[100px]"
              />
              <Button
                onClick={submitReview}
                disabled={!reviewText.trim() || submittingReview}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Send className="mr-2 h-4 w-4" />
                {submittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Review list */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-bold text-green-600">
                        {review.user.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.user.name}</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-3.5 w-3.5 ${
                                s <= review.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/50">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground text-sm">
                No reviews yet. Be the first to review this product!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
