"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3,
  ArrowUpRight,
  Edit,
  Boxes,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/useAuth"

interface InventoryData {
  products: any[]
  summary: {
    total: number
    inStock: number
    lowStock: number
    outOfStock: number
    totalValue: number
  }
  lowStockProducts: any[]
  outOfStockProducts: any[]
  categoryBreakdown: Record<string, { count: number; value: number }>
}

export default function FarmerInventoryPage() {
  const { user, loading: authLoading, hasFetched } = useAuth()
  const router = useRouter()
  const [inventory, setInventory] = useState<InventoryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (hasFetched && !authLoading && (!user || user.role !== "FARMER")) {
      router.replace("/login")
    }
  }, [user, authLoading, hasFetched, router])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const res = await fetch("/api/farmer/inventory", { credentials: "include" })
        const data = await res.json()
        setInventory(data)
      } catch {
        console.error("Failed to load inventory")
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  if (authLoading || !user) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Boxes className="h-8 w-8 text-green-600" />
            <span className="gradient-text">Inventory Manager</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Track stock levels, get alerts, and manage your crop inventory
          </p>
        </div>
        <Link href="/farmer/add-crop">
          <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
            <Package className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatCard
          icon={<Package className="h-5 w-5" />}
          label="Total Products"
          value={loading ? null : String(inventory?.summary.total || 0)}
          bg="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="In Stock"
          value={loading ? null : String(inventory?.summary.inStock || 0)}
          bg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Low Stock"
          value={loading ? null : String(inventory?.summary.lowStock || 0)}
          bg="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600"
        />
        <StatCard
          icon={<XCircle className="h-5 w-5" />}
          label="Out of Stock"
          value={loading ? null : String(inventory?.summary.outOfStock || 0)}
          bg="bg-red-100 dark:bg-red-900/30"
          iconColor="text-red-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Product List */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                All Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : !inventory?.products.length ? (
                <p className="text-center py-8 text-muted-foreground">No products yet.</p>
              ) : (
                <div className="space-y-3">
                  {inventory.products.map((p) => {
                    const stockPercent = p.quantity > 0 ? Math.min((p.quantity / 100) * 100, 100) : 0
                    const isLow = p.inStock && p.quantity <= 10
                    const isOut = !p.inStock || p.quantity <= 0

                    return (
                      <div
                        key={p.id}
                        className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover border"
                          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm truncate">{p.name}</p>
                            {isOut && (
                              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs rounded-full">
                                Out
                              </Badge>
                            )}
                            {isLow && !isOut && (
                              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs rounded-full">
                                Low
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={stockPercent} className="flex-1 h-1.5" />
                            <span className="text-xs text-muted-foreground w-16 text-right">
                              {p.quantity} {p.unit}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-600">₹{p.price}</p>
                          <Link href={`/farmer/edit-product/${p.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 mt-1">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Low Stock Alerts */}
          <Card className="border-amber-200 dark:border-amber-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-20 w-full" />
              ) : !inventory?.lowStockProducts.length ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  All products well stocked ✅
                </p>
              ) : (
                <div className="space-y-2">
                  {inventory.lowStockProducts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{p.name}</span>
                      <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">
                        {p.quantity} left
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-600" />
                By Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-32 w-full" />
              ) : !inventory?.categoryBreakdown ? (
                <p className="text-sm text-muted-foreground text-center py-4">No data</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(inventory.categoryBreakdown).map(([cat, data]) => (
                    <div key={cat} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm capitalize">{cat}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{data.count} items</span>
                        <p className="text-xs text-muted-foreground">
                          ₹{data.value.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inventory Value */}
          <Card className="border-green-200 dark:border-green-900/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Inventory Value</p>
              {loading ? (
                <Skeleton className="h-10 w-32 mx-auto" />
              ) : (
                <p className="text-3xl font-bold text-green-600">
                  ₹{(inventory?.summary.totalValue || 0).toLocaleString("en-IN")}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  bg,
  iconColor,
}: {
  icon: React.ReactNode
  label: string
  value: string | null
  bg: string
  iconColor: string
}) {
  return (
    <Card className="border-border/50 premium-card">
      <CardContent className="p-5">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${iconColor} mb-3`}>
          {icon}
        </div>
        {value ? <p className="text-2xl font-bold">{value}</p> : <Skeleton className="h-8 w-16" />}
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  )
}
