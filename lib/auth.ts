import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function readToken() {
  if (typeof document === "undefined") return null;
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));
  return token ? token.split("=")[1] : null;
}
