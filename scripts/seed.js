import { mockProducts } from "../data/mock-products.js";

import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

async function main() {
  for (const p of mockProducts) {
    await prisma.user.upsert({
      where: { id: p.farmer.id },
      update: {},
      create: {
        id: p.farmer.id,
        name: p.farmer.name,
        email: `${p.farmer.id}@example.com`,
        password: "hashed",
        role: "FARMER",
      },
    });

    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        unit: p.unit,
        image: p.image,
        category: p.category,
        organic: p.organic,
        inStock: p.inStock,
        quantity: p.quantity,
        farmerId: p.farmer.id,
      },
    });
  }
}

main()
  .then(() => console.log("🌱 Seeding complete"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
