"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  TrendingUp,
  Package,
  DollarSign,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts"

import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Analytics {
  monthlyRevenue: { month: string; revenue: number }[]
  topProducts: { name: string; revenue: number; sold: number }[]
  totalRevenue: number
  totalOrders: number
  totalItems: number
  productCount: number
}

export default function FarmerAnalyticsPage() {
  const { user, loading: authLoading, hasFetched } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
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
        const res = await fetch("/api/analytics", { credentials: "include" })
        const data = await res.json()
        setAnalytics(data)
      } catch {
        console.error("Failed to fetch analytics")
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  if (authLoading || !user) return null

  return (
    <div className="container py-8 max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-green-600" />
          <span className="gradient-text">Analytics Dashboard</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your performance, revenue, and product insights
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Total Revenue"
          value={loading ? null : `₹${(analytics?.totalRevenue || 0).toLocaleString("en-IN")}`}
          trend="+12%"
        />
        <StatCard
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Total Orders"
          value={loading ? null : String(analytics?.totalOrders || 0)}
          trend="+8%"
        />
        <StatCard
          icon={<Package className="h-5 w-5" />}
          label="Items Sold"
          value={loading ? null : String(analytics?.totalItems || 0)}
          trend="+15%"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Active Products"
          value={loading ? null : String(analytics?.productCount || 0)}
          trend="+3"
        />
      </div>

      {/* Revenue Chart */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <Skeleton className="h-full w-full rounded-xl" />
          ) : analytics?.monthlyRevenue?.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthlyRevenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(val) => `₹${val}`}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "14px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>No revenue data yet. Start selling to see insights.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            Top Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : analytics?.topProducts?.length ? (
            <div className="space-y-3">
              {analytics.topProducts.map((product, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-bold text-green-600">
                      #{i + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.sold} units sold
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-600">
                    ₹{product.revenue.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">
              No product data yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode
  label: string
  value: string | null
  trend: string
}) {
  return (
    <Card className="border-border/50 premium-card">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
            {icon}
          </div>
          <div className="flex items-center gap-0.5 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
            <ArrowUpRight className="h-3 w-3" />
            {trend}
          </div>
        </div>
        {value ? (
          <p className="text-2xl font-bold">{value}</p>
        ) : (
          <Skeleton className="h-8 w-24" />
        )}
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  )
}
