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
} from "lucide-react"

import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

const fetcher = (url: string) => fetch(url).then(r => r.json())

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
      category: cat,
      revenue: revenueMap[cat] || 0,
    }))
  }, [products])

  if (loading || !user) return null

  return (
    <div className="container py-8 max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-green-700">Farmer Dashboard</h1>
        <Button asChild className="gap-2 bg-green-600 hover:bg-green-700 text-white">
          <Link href="/farmer/add-crop">
            <PlusCircle className="h-5 w-5" /> Add New Crop
          </Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Package className="text-green-600" />} label="Total Listings" value={total} loading={isLoading} />
        <StatCard icon={<CheckCircle2 className="text-green-600" />} label="In Stock" value={inStock} loading={isLoading} />
        <StatCard icon={<AlertTriangle className="text-red-500" />} label="Out of Stock" value={soldOut} loading={isLoading} />
        <StatCard icon={<CircleDollarSign className="text-green-600" />} label="Potential ₹" value={`₹${revenue.toFixed(0)}`} loading={isLoading} />
      </div>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700">Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : byCategory.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={byCategory}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                barCategoryGap="30%"
              >
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12, fill: '#166534' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(val) => `₹${val}`}
                  tick={{ fontSize: 12, fill: '#166534' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, "Revenue"]}
                  labelStyle={{ fontWeight: "bold", color: '#14532d' }}
                  contentStyle={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    fontSize: "14px",
                  }}
                />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                  {byCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.revenue === 0 ? "#bbf7d0" : "url(#greenGradient)"}
                    />
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
            <p className="text-muted-foreground text-sm">
              No data yet. Add products to see revenue insights.
            </p>
          )}
        </CardContent>
      </Card>

      <Separator />

      {isLoading ? (
        <Skeleton className="h-56 w-full" />
      ) : (
        <ProductTable products={products} />
      )}
    </div>
  )
}

function StatCard({ icon, label, value, loading }: { icon: React.ReactNode, label: string, value: number | string, loading: boolean }) {
  return (
    <Card className="border-green-100">
      <CardHeader className="flex items-center gap-2 text-green-700">{icon}<CardTitle>{label}</CardTitle></CardHeader>
      <CardContent className="text-2xl font-bold text-green-800">
        {loading ? <Skeleton className="h-8 w-20" /> : value}
      </CardContent>
    </Card>
  )
}

function ProductTable({ products }: { products: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="border-b bg-green-200 text-green-900">
          <tr>
            <th className="p-3">Product</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Qty</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b last:border-none hover:bg-green-100">
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-md border"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                  <span className="capitalize font-medium text-green-900">{p.name}</span>
                </div>
              </td>
              <td className="p-3 capitalize text-green-800">{p.category}</td>
              <td className="p-3 text-green-700">₹{p.price}</td>
              <td className="p-3 text-green-700">{p.quantity}</td>
              <td className="p-3">
                {p.inStock ? (
                  <span className="text-green-600">In stock</span>
                ) : (
                  <span className="text-red-600">Out</span>
                )}
              </td>
              <td className="p-3 text-right space-x-2">
                <Link href={`/farmer/edit-product/${p.id}`} className="text-green-600 hover:underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-muted-foreground">
                No products listed yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}