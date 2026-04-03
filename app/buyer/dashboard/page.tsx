"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ShoppingBag,
  Package,
  Heart,
  TrendingUp,
  Clock,
  ChevronRight,
  Star,
  ArrowRight,
  ShoppingCart,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/useAuth"
import type { Order } from "@/types/product"

export default function BuyerDashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlist, setWishlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user || user.role !== "BUYER")) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, user, router])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const [ordersRes, wishlistRes] = await Promise.all([
          fetch("/api/orders", { credentials: "include" }),
          fetch("/api/wishlist", { credentials: "include" }),
        ])
        const ordersData = await ordersRes.json()
        const wishlistData = await wishlistRes.json()
        setOrders(ordersData.orders || [])
        setWishlist(wishlistData.wishlist || [])
      } catch {
        console.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  if (authLoading || !user) return null

  const recentOrders = orders.slice(0, 5)
  const totalSpent = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.total, 0)
  const activeOrders = orders.filter(
    (o) => !["DELIVERED", "CANCELLED"].includes(o.status)
  ).length

  const statusColors: Record<string, string> = {
    PENDING: "status-pending",
    CONFIRMED: "status-confirmed",
    PROCESSING: "status-processing",
    SHIPPED: "status-shipped",
    DELIVERED: "status-delivered",
    CANCELLED: "status-cancelled",
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-green-600" />
          <span className="gradient-text">Buyer Dashboard</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user.name}! Here&apos;s your shopping overview.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger-children">
        <Card className="border-border/50 premium-card">
          <CardContent className="p-5">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 mb-3">
              <Package className="h-5 w-5" />
            </div>
            {loading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{orders.length}</p>}
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 premium-card">
          <CardContent className="p-5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-3">
              <Clock className="h-5 w-5" />
            </div>
            {loading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{activeOrders}</p>}
            <p className="text-sm text-muted-foreground">Active Orders</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 premium-card">
          <CardContent className="p-5">
            <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 mb-3">
              <Heart className="h-5 w-5" />
            </div>
            {loading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{wishlist.length}</p>}
            <p className="text-sm text-muted-foreground">Wishlist Items</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 premium-card">
          <CardContent className="p-5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 mb-3">
              <TrendingUp className="h-5 w-5" />
            </div>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-bold">₹{totalSpent.toLocaleString("en-IN")}</p>
            )}
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Recent Orders
              </CardTitle>
              <Link href="/orders">
                <Button variant="ghost" size="sm" className="text-green-600 gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No orders yet</p>
                  <Link href="/products">
                    <Button className="mt-3 bg-green-600 hover:bg-green-700 text-white gap-2" size="sm">
                      <ShoppingCart className="h-4 w-4" /> Start Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-mono text-muted-foreground">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <Badge className={`${statusColors[order.status]} text-xs px-2 py-0`}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {order.items?.length || 0} items •{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                      <p className="font-semibold text-green-600">₹{order.total.toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Wishlist Preview */}
        <div>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Wishlist
              </CardTitle>
              <Link href="/buyer/wishlist">
                <Button variant="ghost" size="sm" className="text-green-600 gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : wishlist.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No saved items</p>
                  <Link href="/products">
                    <Button variant="outline" className="mt-3 gap-2" size="sm">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlist.slice(0, 4).map((item: any) => (
                    <Link key={item.id} href={`/products/${item.product.id}`}>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-xs text-green-600 font-semibold">
                            ₹{item.product.price}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/50 mt-4">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/products" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <ShoppingBag className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Browse Products</span>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </div>
              </Link>
              <Link href="/cart" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">View Cart</span>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </div>
              </Link>
              <Link href="/orders" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
                  <Package className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium">Track Orders</span>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
