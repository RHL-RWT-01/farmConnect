import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret"

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return null
  }
}
