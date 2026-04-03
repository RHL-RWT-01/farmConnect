import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token) as any;
    if (!decoded || decoded.role !== "FARMER")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Revenue over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const orders = await prisma.order.findMany({
      where: {
        items: { some: { product: { farmerId: decoded.id } } },
        createdAt: { gte: sixMonthsAgo },
        status: { notIn: ["CANCELLED"] },
      },
      include: {
        items: {
          where: { product: { farmerId: decoded.id } },
          include: { product: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Monthly revenue
    const monthlyRevenue: Record<string, number> = {};
    for (const order of orders) {
      const month = new Date(order.createdAt).toLocaleString("en-IN", {
        month: "short",
        year: "numeric",
      });
      const orderRevenue = order.items.reduce((sum, item) => sum + item.total, 0);
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + orderRevenue;
    }

    // Top products
    const productRevenue: Record<string, { name: string; revenue: number; sold: number }> = {};
    for (const order of orders) {
      for (const item of order.items) {
        if (!productRevenue[item.productId]) {
          productRevenue[item.productId] = {
            name: item.product.name,
            revenue: 0,
            sold: 0,
          };
        }
        productRevenue[item.productId].revenue += item.total;
        productRevenue[item.productId].sold += item.quantity;
      }
    }

    const topProducts = Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Total stats
    const totalRevenue = orders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.total, 0),
      0
    );
    const totalOrders = orders.length;
    const totalItems = orders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
      0
    );

    // Products count
    const productCount = await prisma.product.count({
      where: { farmerId: decoded.id },
    });

    return NextResponse.json({
      monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({
        month,
        revenue,
      })),
      topProducts,
      totalRevenue,
      totalOrders,
      totalItems,
      productCount,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
