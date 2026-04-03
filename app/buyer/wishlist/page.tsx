"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/useAuth"
import { useCartContext } from "@/contexts/CartContext"
import { useToast } from "@/hooks/use-toast"

export default function WishlistPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { addToCart } = useCartContext()
  const { toast } = useToast()
  const router = useRouter()
  const [wishlist, setWishlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user)) router.push("/login")
  }, [authLoading, isAuthenticated, user, router])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const res = await fetch("/api/wishlist", { credentials: "include" })
        const data = await res.json()
        setWishlist(data.wishlist || [])
      } catch {
        console.error("Failed to load wishlist")
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  const removeFromWishlist = async (productId: string) => {
    try {
      await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      })
      setWishlist((prev) => prev.filter((item) => item.product.id !== productId))
      toast({ title: "Removed from wishlist" })
    } catch {
      toast({ title: "Error", description: "Failed to remove item", variant: "destructive" })
    }
  }

  const handleAddToCart = (product: any) => {
    addToCart(product)
    toast({ title: "Added to cart", description: product.name })
  }

  if (authLoading || !user) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center">
          <Heart className="h-6 w-6 text-pink-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold gradient-text">My Wishlist</h1>
          <p className="text-sm text-muted-foreground">{wishlist.length} saved items</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <Card className="py-16 border-border/50">
          <CardContent className="text-center">
            <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">Your wishlist is empty</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Save products you love and come back to them later.
            </p>
            <Link href="/products">
              <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                <ShoppingBag className="h-4 w-4" /> Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {wishlist.map((item: any) => (
            <Card key={item.id} className="border-border/50 premium-card overflow-hidden">
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(item.product.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
              <CardContent className="p-4">
                <Link href={`/products/${item.product.id}`}>
                  <h3 className="font-semibold hover:text-green-600 transition-colors line-clamp-1">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.product.farmer?.name || "Unknown Farmer"}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-green-600">
                    ₹{item.product.price}
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      /{item.product.unit}
                    </span>
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(item.product)}
                    disabled={!item.product.inStock}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-full gap-1"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
