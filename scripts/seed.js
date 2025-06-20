// scripts/seed.ts (example)

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("test1234", 10)

  await prisma.user.upsert({
    where: { email: "farmer@agri.com" },
    update: {},
    create: {
      name: "Rahul",
      email: "test@agri.com",
      password,
      role: "FARMER",
    },
  })
}

main().finally(() => prisma.$disconnect())
