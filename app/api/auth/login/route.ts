import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"


const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  )
  const response = NextResponse.json({ token, user: { id: user.id, name: user.name, role: user.role } })
  response.cookies.set("token", token, {
    httpOnly: process.env.NODE_ENV==="production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
