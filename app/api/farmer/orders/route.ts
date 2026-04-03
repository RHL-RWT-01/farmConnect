import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Farmer: get orders that contain their products
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token) as any;
    if (!decoded || decoded.role !== "FARMER")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {
      items: { some: { product: { farmerId: decoded.id } } },
    };
    if (status && status !== "all") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          where: { product: { farmerId: decoded.id } },
          include: { product: true },
        },
        user: { select: { id: true, name: true, email: true, image: true, phone: true, location: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Farmer orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// Farmer: update order status
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token) as any;
    if (!decoded || decoded.role !== "FARMER")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { orderId, status } = await req.json();
    if (!orderId || !status)
      return NextResponse.json({ error: "orderId and status required" }, { status: 400 });

    const validStatuses = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status))
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Create notification for buyer
    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: `Order ${status.toLowerCase()}`,
        message: `Your order #${order.id.slice(0, 8).toUpperCase()} has been ${status.toLowerCase()}.`,
        type: status === "CANCELLED" ? "warning" : "success",
        link: "/orders",
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
