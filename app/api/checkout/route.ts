import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token) as any;
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();

    // For now, create a Dodo Payments checkout session
    // Since Dodo Payments requires a registered product, we create a payment link
    const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY;
    
    if (!DODO_API_KEY) {
      // Fallback: create order directly without payment gateway
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

      const order = await prisma.order.create({
        data: {
          userId: decoded.id,
          subtotal,
          tax,
          shipping,
          total,
          status: "CONFIRMED",
          paymentMethod: "COD",
          shippingAddress: body.shippingAddress || "",
          notes: body.notes || "",
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

      await prisma.cartItem.deleteMany({ where: { userId: decoded.id } });

      for (const item of cartItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: { decrement: item.quantity },
            inStock: item.product.quantity - item.quantity > 0,
          },
        });
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        redirectUrl: `/checkout/success?orderId=${order.id}`,
      });
    }

    // With Dodo Payments
    try {
      const DodoPayments = (await import("dodopayments")).default;
      const client = new DodoPayments({
        bearerToken: DODO_API_KEY,
        environment: process.env.NODE_ENV === "production" ? "live_mode" : "test_mode",
      });

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

      // Create order first
      const order = await prisma.order.create({
        data: {
          userId: decoded.id,
          subtotal,
          tax,
          shipping,
          total,
          status: "PENDING",
          paymentMethod: "DODO",
          shippingAddress: body.shippingAddress || "",
          notes: body.notes || "",
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
              total: item.product.price * item.quantity,
            })),
          },
        },
      });

      // Create Dodo checkout session
      const session = await client.payments.create({
        billing: {
          city: "Mumbai",
          country: "IN",
          state: "MH",
          street: body.shippingAddress || "N/A",
          zipcode: 400001,
        },
        customer: {
          email: decoded.email || "customer@farmconnect.com",
          name: decoded.name || "FarmConnect Customer",
        },
        payment_link: true,
        product_cart: cartItems.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?orderId=${order.id}`,
        metadata: {
          orderId: order.id,
          userId: decoded.id,
        },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { paymentId: session.payment_id },
      });

      return NextResponse.json({
        success: true,
        paymentLink: session.payment_link,
        orderId: order.id,
      });
    } catch (dodoError) {
      console.error("Dodo payment error:", dodoError);
      // Fallback to direct order
      return NextResponse.json(
        { error: "Payment service unavailable. Try Cash on Delivery." },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}
