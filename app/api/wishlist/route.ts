import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token) as any;
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: decoded.id },
      include: {
        product: {
          include: { farmer: { select: { id: true, name: true, location: true, image: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ wishlist });
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token) as any;
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { productId } = await req.json();
    if (!productId)
      return NextResponse.json({ error: "productId required" }, { status: 400 });

    // Toggle: if exists, remove; if not, add
    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId: decoded.id, productId } },
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: "removed", productId });
    } else {
      await prisma.wishlist.create({
        data: { userId: decoded.id, productId },
      });
      return NextResponse.json({ action: "added", productId });
    }
  } catch (error) {
    console.error("Wishlist toggle error:", error);
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token) as any;
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { productId } = await req.json();
    if (!productId)
      return NextResponse.json({ error: "productId required" }, { status: 400 });

    await prisma.wishlist.deleteMany({
      where: { userId: decoded.id, productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Wishlist delete error:", error);
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 });
  }
}
