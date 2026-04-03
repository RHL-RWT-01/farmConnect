import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-dodo-signature");
    
    // In production, verify signature with DODO_PAYMENTS_WEBHOOK_KEY
    // const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
    
    const event = await req.json();
    
    const eventType = event.type || event.event_type;
    const data = event.data || event;

    switch (eventType) {
      case "payment.succeeded":
      case "payment_succeeded": {
        const orderId = data.metadata?.orderId;
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: "CONFIRMED",
              paymentId: data.payment_id || data.id,
            },
          });

          // Clear cart for the user
          const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
          });

          if (order) {
            await prisma.cartItem.deleteMany({
              where: { userId: order.userId },
            });

            // Update product quantities
            for (const item of order.items) {
              await prisma.product.update({
                where: { id: item.productId },
                data: {
                  quantity: { decrement: item.quantity },
                },
              });
            }
          }
        }
        break;
      }

      case "payment.failed":
      case "payment_failed": {
        const orderId = data.metadata?.orderId;
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
