import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as any;
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { shippingAddress, notes } = body;

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: decoded.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const tax = subtotal * 0.07;
    const shipping = subtotal > 500 ? 0 : 49.99;
    const total = subtotal + tax + shipping;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: decoded.id,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: shippingAddress || "",
        notes: notes || "",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            total: item.product.price * item.quantity,
          })),
        },
      },
      include: {
        items: { include: { product: { include: { farmer: true } } } },
      },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { userId: decoded.id } });

    // Update product quantities
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          quantity: { decrement: item.quantity },
          inStock: item.product.quantity - item.quantity > 0,
        },
      });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as any;
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = decoded.role;

    let orders;

    if (role === "FARMER") {
      // Get orders that contain products from this farmer
      orders = await prisma.order.findMany({
        where: {
          items: {
            some: {
              product: { farmerId: decoded.id },
            },
          },
        },
        include: {
          items: { include: { product: { include: { farmer: true } } } },
          user: { select: { name: true, email: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      orders = await prisma.order.findMany({
        where: { userId: decoded.id },
        include: {
          items: { include: { product: { include: { farmer: true } } } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
