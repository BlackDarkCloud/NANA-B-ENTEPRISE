import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@nanab.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      password: hashed,
      role: "ADMIN",
    },
  });

  const categories = [
    { name: "Home Appliances", slug: "home-appliances" },
    { name: "Kitchen & Dining", slug: "kitchen-dining" },
    { name: "Outdoor & Garden", slug: "outdoor-garden" },
    { name: "Lifestyle", slug: "lifestyle" },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  const zones = [
    { name: "Accra Metro", price: 1500, estimatedDays: "1-2 days" },
    { name: "Greater Accra (Outskirts)", price: 2500, estimatedDays: "2-3 days" },
    { name: "Other Regions", price: 4000, estimatedDays: "3-5 days" },
  ];

  for (const z of zones) {
    const existing = await prisma.deliveryZone.findFirst({ where: { name: z.name } });
    if (!existing) await prisma.deliveryZone.create({ data: z });
  }

  console.log(`Seed complete. Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
