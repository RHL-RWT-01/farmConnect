import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token) as any;
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { name, phone, bio, location, image } = await req.json();

    const updated = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(image !== undefined && { image }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        location: true,
        phone: true,
        bio: true,
        verified: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
