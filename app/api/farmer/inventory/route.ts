import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Get inventory with stock alerts
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token) as any;
    if (!decoded || decoded.role !== "FARMER")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const products = await prisma.product.findMany({
      where: { farmerId: decoded.id },
      orderBy: { updatedAt: "desc" },
    });

    const lowStock = products.filter((p) => p.inStock && p.quantity <= 10);
    const outOfStock = products.filter((p) => !p.inStock || p.quantity <= 0);
    const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // Category breakdown
    const categoryBreakdown: Record<string, { count: number; value: number }> = {};
    for (const p of products) {
      if (!categoryBreakdown[p.category]) {
        categoryBreakdown[p.category] = { count: 0, value: 0 };
      }
      categoryBreakdown[p.category].count++;
      categoryBreakdown[p.category].value += p.price * p.quantity;
    }

    return NextResponse.json({
      products,
      summary: {
        total: products.length,
        inStock: products.filter((p) => p.inStock).length,
        lowStock: lowStock.length,
        outOfStock: outOfStock.length,
        totalValue,
      },
      lowStockProducts: lowStock,
      outOfStockProducts: outOfStock,
      categoryBreakdown,
    });
  } catch (error) {
    console.error("Inventory error:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}
