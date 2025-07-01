"use client"

import { useEffect, useMemo } from "react"
import useSWR from "swr"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
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
  /* ── Auth guard ────────────────────────── */
  const { user, loading, hasFetched } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (hasFetched && !loading && (!user || user.role !== "FARMER")) {
      router.replace("/login")
    }
  }, [user, loading, hasFetched, router])

  /* ── Fetch products ────────────────────── */
  const { data: products = [], isLoading } = useSWR(
    () => (user ? `/api/farmer/products?farmerId=${user.id}` : null),
    fetcher
  )

  /* ── KPI calculations ──────────────────── */
  const total = products.length
  const inStock = products.filter((p: any) => p.inStock).length
  const soldOut = total - inStock
  const revenue = products.reduce(
    (sum: number, p: any) => sum + p.price * p.quantity,
    0
  )

  /* Bar-chart data */
  const byCategory = useMemo(() => {
    const map: Record<string, number> = {}
    products.forEach((p: any) => {
      map[p.category] = (map[p.category] || 0) + p.price * p.quantity
    })
    return Object.entries(map).map(([k, v]) => ({ category: k, revenue: v }))
  }, [products])

  /* ── UI starts here ────────────────────── */
  if (loading || !user) return null

  return (
    <div className="container py-8 max-w-6xl space-y-8">
      {/* Heading row */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
        <Button asChild className="gap-2">
          <Link href="/farmer/add-crop">
            <PlusCircle className="h-5 w-5" /> Add New Crop
          </Link>
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Package />} label="Total Listings" value={total} loading={isLoading} />
        <StatCard icon={<CheckCircle2 />} label="In Stock" value={inStock} loading={isLoading} />
        <StatCard icon={<AlertTriangle />} label="Out of Stock" value={soldOut} loading={isLoading} />
        <StatCard icon={<CircleDollarSign />} label="Potential ₹" value={`₹${revenue.toFixed(0)}`} loading={isLoading} />
      </div>

      {/* Revenue by category chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : byCategory.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" />
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

      {/* Products table */}
      {isLoading ? (
        <Skeleton className="h-56 w-full" />
      ) : (
        <ProductTable products={products} />
      )}
    </div>
  )
}

/* ───────────── Helper components ───────────── */
function StatCard({
  icon,
  label,
  value,
  loading,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  loading: boolean
}) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2">{icon}<CardTitle>{label}</CardTitle></CardHeader>
      <CardContent className="text-2xl font-bold">
        {loading ? <Skeleton className="h-8 w-20" /> : value}
      </CardContent>
    </Card>
  )
}

function ProductTable({ products }: { products: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="border-b bg-muted/30">
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
            <tr key={p.id} className="border-b last:border-none hover:bg-muted/10">
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-md border"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")} // optional
                  />
                  <span className="capitalize font-medium">{p.name}</span>
                </div>
              </td>
              <td className="p-3 capitalize">{p.category}</td>
              <td className="p-3">₹{p.price}</td>
              <td className="p-3">{p.quantity}</td>
              <td className="p-3">
                {p.inStock ? (
                  <span className="text-green-600">In stock</span>
                ) : (
                  <span className="text-destructive">Out</span>
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

