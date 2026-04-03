import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token) as any;
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "productId and rating (1-5) are required" },
        { status: 400 }
      );
    }

    const review = await prisma.review.upsert({
      where: {
        userId_productId: { userId: decoded.id, productId },
      },
      update: { rating, comment },
      create: {
        userId: decoded.id,
        productId,
        rating,
        comment,
      },
    });

    // Update product rating
    const agg = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: agg._avg.rating || 0,
        reviewCount: agg._count,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId required" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
