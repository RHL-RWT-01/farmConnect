"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PlusCircle, Package, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { Product } from "@/types/product";
import { useProductContext } from "@/contexts/ProductContext";

export default function FarmerDashboardPage() {
  const { products, loading } = useProductContext();
  const [myProducts, setMyProducts] = useState<Product[]>([]);

  // 📝 In a real app, you'd identify the logged‑in farmer by userId.
  // For demo, filter by role or simply show all products that have farmerId === "me".
  // 👉 Replace "myFarmerId" with the authenticated user id from your auth hook.
  const myFarmerId = "me";

  useEffect(() => {
    if (!loading) {
      setMyProducts(products.filter((p) => p.farmerId === myFarmerId));
    }
  }, [products, loading]);

  /* ─── Dashboard Stats ─────────────────────────────────── */
  const totalProducts = myProducts.length;
  const inStock = myProducts.filter((p) => p.inStock).length;
  const soldOut = totalProducts - inStock;

  const revenue = useMemo(() => {
    return myProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }, [myProducts]);

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="container py-8 max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
        <Button asChild className="gap-2">
          <Link href="/farmer/add-crop">
            <PlusCircle className="h-5 w-5" /> Add New Crop
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex items-center gap-2 text-green-600">
            <Package />
            <CardTitle>Total Listings</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalProducts}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2 text-green-600">
            <CheckCircle2 />
            <CardTitle>In Stock</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{inStock}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2 text-red-600">
            <Package />
            <CardTitle>Sold&nbsp;/ Out</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{soldOut}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-2 text-yellow-600">
            <Package />
            <CardTitle>Potential Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">₹{revenue.toFixed(0)}</CardContent>
        </Card>
      </div>

      <Separator />

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price (₹)</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myProducts.map((p) => (
              <tr key={p.id} className="border-b last:border-none hover:bg-muted/10">
                <td className="p-3 font-medium capitalize">{p.name}</td>
                <td className="p-3 capitalize">{p.category}</td>
                <td className="p-3">{p.price}</td>
                <td className="p-3">{p.quantity}</td>
                <td className="p-3">
                  {p.inStock ? (
                    <span className="text-green-600">In stock</span>
                  ) : (
                    <span className="text-destructive">Out</span>
                  )}
                </td>
                <td className="p-3 text-right space-x-2">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/farmer/edit-product/${p.id}`}>Edit</Link>
                  </Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </td>
              </tr>
            ))}
            {myProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                  No products listed yet. Click "Add New Crop" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
