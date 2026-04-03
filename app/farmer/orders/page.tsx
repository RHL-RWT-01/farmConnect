"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Package,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  ArrowRight,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

const statusFlow: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"]

const statusConfig: Record<OrderStatus, { icon: React.ReactNode; color: string; label: string }> = {
  PENDING: { icon: <Clock className="h-4 w-4" />, color: "status-pending", label: "Pending" },
  CONFIRMED: { icon: <CheckCircle2 className="h-4 w-4" />, color: "status-confirmed", label: "Confirmed" },
  PROCESSING: { icon: <Package className="h-4 w-4" />, color: "status-processing", label: "Processing" },
  SHIPPED: { icon: <Truck className="h-4 w-4" />, color: "status-shipped", label: "Shipped" },
  DELIVERED: { icon: <CheckCircle2 className="h-4 w-4" />, color: "status-delivered", label: "Delivered" },
  CANCELLED: { icon: <XCircle className="h-4 w-4" />, color: "status-cancelled", label: "Cancelled" },
}

export default function FarmerOrdersPage() {
  const { user, loading: authLoading, hasFetched } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    if (hasFetched && !authLoading && (!user || user.role !== "FARMER")) {
      router.replace("/login")
    }
  }, [user, authLoading, hasFetched, router])

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/farmer/orders?status=${filter}`, { credentials: "include" })
      const data = await res.json()
      setOrders(data.orders || [])
    } catch {
      console.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetchOrders()
  }, [user, filter])

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId)
    try {
      const res = await fetch("/api/farmer/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      if (res.ok) {
        toast({ title: "Order updated", description: `Status changed to ${newStatus}` })
        fetchOrders()
      } else {
        toast({ title: "Error", description: "Failed to update order", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" })
    } finally {
      setUpdatingId(null)
    }
  }

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    const idx = statusFlow.indexOf(current)
    if (idx === -1 || idx >= statusFlow.length - 1) return null
    return statusFlow[idx + 1]
  }

  if (authLoading || !user) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="h-8 w-8 text-green-600" />
          <span className="gradient-text">Order Management</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and track customer orders for your products
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(
          (status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
              className={filter === status ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            >
              {status === "all" ? "All" : statusConfig[status as OrderStatus]?.label || status}
            </Button>
          )
        )}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card className="py-16 border-border/50">
          <CardContent className="text-center">
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">No orders found</h3>
            <p className="text-muted-foreground text-sm">
              {filter === "all"
                ? "No customer orders yet."
                : `No ${filter.toLowerCase()} orders.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 stagger-children">
          {orders.map((order) => {
            const sc = statusConfig[order.status as OrderStatus]
            const nextStatus = getNextStatus(order.status as OrderStatus)

            return (
              <Card key={order.id} className="border-border/50 premium-card overflow-hidden">
                <CardContent className="p-6">
                  {/* Header row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Badge className={`${sc.color} flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium`}>
                        {sc.icon}
                        {sc.label}
                      </Badge>
                      <span className="text-sm font-mono text-muted-foreground">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xl font-bold text-green-600">
                      ₹{order.items.reduce((s: number, i: any) => s + i.total, 0).toFixed(0)}
                    </p>
                  </div>

                  {/* Customer info */}
                  {order.user && (
                    <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-muted/50 rounded-xl text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{order.user.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{order.user.email}</span>
                      </div>
                      {order.user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{order.user.phone}</span>
                        </div>
                      )}
                      {order.user.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{order.user.location}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.product.name}</span>
                          <span className="text-muted-foreground">x{item.quantity}</span>
                        </div>
                        <span className="font-medium">₹{item.total.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                    <>
                      <Separator className="mb-4" />
                      <div className="flex gap-2 flex-wrap">
                        {nextStatus && (
                          <Button
                            size="sm"
                            onClick={() => updateStatus(order.id, nextStatus)}
                            disabled={updatingId === order.id}
                            className="bg-green-600 hover:bg-green-700 text-white gap-1"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                            Mark as {statusConfig[nextStatus].label}
                          </Button>
                        )}
                        {order.status === "PENDING" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(order.id, "CANCELLED")}
                            disabled={updatingId === order.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
