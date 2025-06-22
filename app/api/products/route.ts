import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "12")
  const skip = (page - 1) * limit

  const products = await prisma.product.findMany({
    skip,
    take: limit,
    include: { farmer: true },
    // orderBy: { createdAt: "desc" }, 
  })

  const total = await prisma.product.count()

  return NextResponse.json({ products, total })
}
