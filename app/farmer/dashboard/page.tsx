"use client"

import { useEffect, useMemo } from "react"
import useSWR from "swr"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import {
  PlusCircle,
  Package,
  CheckCircle2,
  AlertTriangle,
  CircleDollarSign,
  BarChart3,
  TrendingUp,
  Edit,
  Calendar,
  ClipboardList,
  Boxes,
  ArrowRight,
} from "lucide-react"

import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function FarmerDashboardPage() {
  const { user, loading, hasFetched } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (hasFetched && !loading && (!user || user.role !== "FARMER")) {
      router.replace("/login")
    }
  }, [user, loading, hasFetched, router])

  const { data: products = [], isLoading } = useSWR(
    () => (user ? `/api/farmer/products?farmerId=${user.id}` : null),
    fetcher
  )

  const total = products.length
  const inStock = products.filter((p: any) => p.inStock).length
  const soldOut = total - inStock
  const lowStock = products.filter((p: any) => p.inStock && p.quantity <= 10).length
  const revenue = products.reduce(
    (sum: number, p: any) => sum + p.price * p.quantity,
    0
  )

  const byCategory = useMemo(() => {
    const categories = ["vegetables", "fruits", "spices", "grains", "pulses", "dairy"]
    const revenueMap: Record<string, number> = {}
    products.forEach((p: any) => {
      revenueMap[p.category] = (revenueMap[p.category] || 0) + p.price * p.quantity
    })
    return categories.map((cat) => ({
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      revenue: revenueMap[cat] || 0,
    }))
  }, [products])

  if (loading || !user) return null

  return (
    <div className="container py-8 max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8 text-green-600" />
            <span className="gradient-text">Farmer Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.name}! Here&apos;s your farm overview.
          </p>
        </div>
        <Link href="/farmer/add-crop">
          <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/20">
            <PlusCircle className="h-4 w-4" />
            Add New Crop
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard icon={<Package className="h-5 w-5" />} label="Total Listings" value={total} loading={isLoading} color="green" />
        <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="In Stock" value={inStock} loading={isLoading} color="green" />
        <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Low / Out of Stock" value={`${lowStock} / ${soldOut}`} loading={isLoading} color="red" />
        <StatCard icon={<CircleDollarSign className="h-5 w-5" />} label="Inventory Value" value={`₹${revenue.toLocaleString("en-IN")}`} loading={isLoading} color="green" />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction href="/farmer/orders" icon={<ClipboardList className="h-5 w-5" />} label="Manage Orders" desc="View & update order status" color="bg-blue-50 dark:bg-blue-900/20" iconColor="text-blue-600" />
        <QuickAction href="/farmer/inventory" icon={<Boxes className="h-5 w-5" />} label="Inventory" desc="Stock levels & alerts" color="bg-amber-50 dark:bg-amber-900/20" iconColor="text-amber-600" />
        <QuickAction href="/farmer/analytics" icon={<BarChart3 className="h-5 w-5" />} label="Revenue Analytics" desc="Sales reports & trends" color="bg-purple-50 dark:bg-purple-900/20" iconColor="text-purple-600" />
        <QuickAction href="/farmer/crop-calendar" icon={<Calendar className="h-5 w-5" />} label="Crop Calendar" desc="Seasonal planting guide" color="bg-green-50 dark:bg-green-900/20" iconColor="text-green-600" />
      </div>

      {/* Chart */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Revenue by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-xl" />
          ) : byCategory.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory} margin={{ top: 20, right: 30, left: 0, bottom: 20 }} barCategoryGap="30%">
                <XAxis dataKey="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(val) => `₹${val}`} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "14px" }}
                />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                  {byCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.revenue === 0 ? "hsl(var(--muted))" : "url(#greenGradient)"} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity={1} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>No data yet. Add products to see revenue insights.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Products Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Products</h2>
          <Link href="/farmer/inventory">
            <Button variant="ghost" size="sm" className="text-green-600 gap-1">
              Full Inventory <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {isLoading ? (
          <Skeleton className="h-56 w-full rounded-xl" />
        ) : (
          <div className="rounded-2xl border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-left font-medium">Product</th>
                  <th className="p-4 text-left font-medium hidden sm:table-cell">Category</th>
                  <th className="p-4 text-left font-medium">Price</th>
                  <th className="p-4 text-left font-medium hidden md:table-cell">Qty</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 10).map((p: any) => (
                  <tr key={p.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border" onError={(e) => (e.currentTarget.src = "/placeholder.png")} />
                        <span className="font-medium line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 capitalize hidden sm:table-cell text-muted-foreground">{p.category}</td>
                    <td className="p-4 font-medium text-green-600">₹{p.price}</td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground">{p.quantity}</td>
                    <td className="p-4">
                      {p.inStock ? (
                        p.quantity <= 10 ? (
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs">
                            Low stock
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">
                            In stock
                          </Badge>
                        )
                      ) : (
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs">
                          Sold out
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/farmer/edit-product/${p.id}`}>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No products listed yet. Start by adding your first crop!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, loading: isLoading, color }: { icon: React.ReactNode; label: string; value: number | string; loading: boolean; color: string }) {
  const isGreen = color === "green"
  return (
    <Card className="border-border/50 premium-card">
      <CardContent className="p-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${isGreen ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-red-100 dark:bg-red-900/30 text-red-500"}`}>
          {icon}
        </div>
        {isLoading ? <Skeleton className="h-8 w-24" /> : <p className="text-2xl font-bold">{value}</p>}
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  )
}

function QuickAction({ href, icon, label, desc, color, iconColor }: { href: string; icon: React.ReactNode; label: string; desc: string; color: string; iconColor: string }) {
  return (
    <Link href={href}>
      <Card className="border-border/50 premium-card h-full">
        <CardContent className="p-5">
          <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center ${iconColor} mb-3`}>
            {icon}
          </div>
          <h3 className="font-semibold text-sm">{label}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        </CardContent>
      </Card>
    </Link>
  )
}