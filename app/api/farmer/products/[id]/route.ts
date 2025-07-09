import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    id: string;
  };
};

// GET /api/farmer/products/[id]
// This endpoint retrieves a product by ID
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { farmer: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


// PUT /api/farmer/products/[id]
// This endpoint updates a product by ID
export async function PUT(req: NextRequest, { params }: Params) {
  const id = params.id;

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("Update error:", error);

    if (error.code === "P2025") {
      // Prisma error: Record not found
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE /api/farmer/products/[id]
// This endpoint deletes a product by ID
export async function DELETE(_: NextRequest, { params }: Params) {
  const id = params.id;

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Delete error:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
