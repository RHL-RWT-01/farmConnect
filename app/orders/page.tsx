"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ChevronRight,
  ShoppingBag,
  Search,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/useAuth"
import type { Order, OrderStatus } from "@/types/product"

const statusConfig: Record<
  OrderStatus,
  { icon: React.ReactNode; color: string; label: string }
> = {
  PENDING: { icon: <Clock className="h-4 w-4" />, color: "status-pending", label: "Pending" },
  CONFIRMED: { icon: <CheckCircle2 className="h-4 w-4" />, color: "status-confirmed", label: "Confirmed" },
  PROCESSING: { icon: <Package className="h-4 w-4" />, color: "status-processing", label: "Processing" },
  SHIPPED: { icon: <Truck className="h-4 w-4" />, color: "status-shipped", label: "Shipped" },
  DELIVERED: { icon: <CheckCircle2 className="h-4 w-4" />, color: "status-delivered", label: "Delivered" },
  CANCELLED: { icon: <XCircle className="h-4 w-4" />, color: "status-cancelled", label: "Cancelled" },
}

export default function OrdersPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | OrderStatus>("all")

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login")
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const res = await fetch("/api/orders", { credentials: "include" })
        const data = await res.json()
        setOrders(data.orders || [])
      } catch {
        console.error("Failed to fetch orders")
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter)

  if (authLoading || !user) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8 text-green-600" />
            <span className="gradient-text">
              {user.role === "FARMER" ? "Incoming Orders" : "My Orders"}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {user.role === "FARMER"
              ? "Manage orders from your customers"
              : "Track your purchases and order history"}
          </p>
        </div>
        {user.role === "BUYER" && (
          <Link href="/products">
            <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
              <ShoppingBag className="h-4 w-4" />
              Shop More
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(
          ["all", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const
        ).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
            className={
              filter === status
                ? "bg-green-600 hover:bg-green-700 text-white"
                : ""
            }
          >
            {status === "all" ? "All" : statusConfig[status].label}
          </Button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">No orders found</h3>
            <p className="text-muted-foreground text-sm">
              {filter === "all"
                ? "You haven't placed any orders yet."
                : `No ${statusConfig[filter as OrderStatus]?.label.toLowerCase()} orders.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 stagger-children">
          {filteredOrders.map((order) => {
            const sc = statusConfig[order.status]
            return (
              <Card
                key={order.id}
                className="premium-card overflow-hidden cursor-pointer"
                onClick={() => {}} 
              >
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          className={`${sc.color} flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium`}
                        >
                          {sc.icon}
                          {sc.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-sm font-mono text-muted-foreground mb-1">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""} •{" "}
                        {order.items
                          .slice(0, 3)
                          .map((i) => i.product.name)
                          .join(", ")}
                        {order.items.length > 3 && ` +${order.items.length - 3} more`}
                      </p>
                      {order.user && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Customer: {order.user.name}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        ₹{order.total.toFixed(2)}
                      </p>
                      <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
