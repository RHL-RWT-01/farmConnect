import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const token = cookie
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) return NextResponse.json({ user: null });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: (payload as any).id },
    select: { id: true, name: true, email: true, role: true, image:true },
  });

  console.log("User fetched:", user);
  return NextResponse.json({ user }); 
}

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") ?? ""
  const token = cookie
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1]

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 403 })

  try {
    const { name, image, location } = await req.json()

    const updatedUser = await prisma.user.update({
      where: { id: (payload as any).id },
      data: {
        ...(name && { name }),
        ...(image && { image }),
        ...(location && { location }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        location: true,
        role: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      { message: "User profile updated", user: updatedUser },
      { status: 200 }
    )
  } catch (err) {
    console.error("Profile update failed:", err)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}