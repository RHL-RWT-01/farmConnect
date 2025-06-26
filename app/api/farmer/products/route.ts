import { prisma } from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"


// GET /api/farmer/products?farmerId=<id>
export async function GET(req: NextRequest) {
  const farmerId = req.nextUrl.searchParams.get("farmerId")
  if (!farmerId) {
    return NextResponse.json({ error: "farmerId query param required" }, { status: 400 })
  }

  const products = await prisma.product.findMany({ where: { farmerId } })
  return NextResponse.json(products)
}



export async function POST(req: Request) {
  const data = await req.json()

  if (!data.farmerId) {
    return NextResponse.json({ error: "farmerId missing in body" }, { status: 400 })
  }

  const product = await prisma.product.create({
    data,
  })

  return NextResponse.json(product, { status: 201 })
}
