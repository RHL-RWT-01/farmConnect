import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


const badRequest = (msg: string) =>
  NextResponse.json({ error: msg }, { status: 400 });


export async function GET(req: NextRequest) {
  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) return badRequest("userId query param required");

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: { include: { farmer: true } } },
  });
  return NextResponse.json({ cartItems });
}

export async function POST(req: NextRequest) {
  const { userId, productId, quantity = 1 } = await req.json();

  if (!userId || !productId || quantity <= 0)
    return badRequest("userId, productId and positive quantity required");

  await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId, productId, quantity },
  });

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: { include: { farmer: true } } },
  });
  return NextResponse.json(cartItems);
}

export async function PATCH(req: NextRequest) {
  const { userId, productId, quantity } = await req.json();
  if (!userId || !productId || quantity == null)
    return badRequest("userId, productId and quantity required");

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { userId, productId } });
  } else {
    await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity },
    });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: { include: { farmer: true } } },
  });
  return NextResponse.json(cartItems);
}

/* --------------- DELETE /api/cart  ---------------
   Either body JSON or query string:
   - Body : { userId, productId }
   - Query: ?userId=xxx&productId=yyy
-------------------------------------------------- */
export async function DELETE(req: NextRequest) {
  // try JSON body first
  let userId: string | null = null;
  let productId: string | null = null;
  try {
    const body = await req.json();
    userId = body?.userId;
    productId = body?.productId;
  } catch {
    /* ignore if no body */
  }

  const url = new URL(req.url);
  userId = userId || url.searchParams.get("userId");
  productId = productId || url.searchParams.get("productId");

  if (!userId || !productId) return badRequest("userId and productId required");

  await prisma.cartItem.deleteMany({ where: { userId, productId } });

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: { include: { farmer: true } } },
  });
  return NextResponse.json(cartItems);
}
