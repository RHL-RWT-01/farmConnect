import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

type Params = {
  params: {
    id: string
  }
}

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { farmer: true },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


export async function PUT(req: NextRequest, { params }: Params) {
  const body = await req.json()

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}


export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
