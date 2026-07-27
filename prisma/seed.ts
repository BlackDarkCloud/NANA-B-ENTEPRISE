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
    create: { name: "Admin", email: adminEmail, password: hashed, role: "ADMIN" },
  });

  const categories = [
    { name: "Home Appliances", slug: "home-appliances" },
    { name: "Kitchen & Dining", slug: "kitchen-dining" },
    { name: "Outdoor & Garden", slug: "outdoor-garden" },
    { name: "Lifestyle", slug: "lifestyle" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({ where: { slug: category.slug }, update: category, create: category });
  }

  const categoryRecords = await prisma.category.findMany();
  const categoryId = (slug: string) => {
    const category = categoryRecords.find((item) => item.slug === slug);
    if (!category) throw new Error(`Missing category: ${slug}`);
    return category.id;
  };

  const products = [
    {
      name: "Premium Stainless Steel Blender",
      slug: "premium-stainless-steel-blender",
      description: "A dependable everyday blender with a generous glass jug and variable speed control for smoothies, soups, sauces and more.",
      price: 69900, compareAtPrice: 79900, images: ["/assets/blender.jpg"], stock: 18, featured: true,
      categoryId: categoryId("kitchen-dining"),
    },
    {
      name: "Digital Family Air Fryer",
      slug: "digital-family-air-fryer",
      description: "Enjoy crisp, delicious meals with less oil. The roomy basket and simple controls make everyday cooking quicker and cleaner.",
      price: 89900, compareAtPrice: 99900, images: ["/assets/air-fryer.jpg"], stock: 15, featured: true,
      categoryId: categoryId("kitchen-dining"),
    },
    {
      name: "1.7L Electric Kettle",
      slug: "1-7l-electric-kettle",
      description: "Fast-boil electric kettle with a comfortable handle, automatic shut-off and an elegant finish for any kitchen or office.",
      price: 34900, compareAtPrice: 39900, images: ["/assets/electric-kettle.jpg"], stock: 26, featured: true,
      categoryId: categoryId("home-appliances"),
    },
    {
      name: "50-inch UHD Smart TV",
      slug: "50-inch-uhd-smart-tv",
      description: "Bring movies, football and streaming home with a vivid 4K display, slim profile and easy access to your favourite entertainment.",
      price: 429900, compareAtPrice: 469900, images: ["/assets/smart-tv.jpg"], stock: 8, featured: true,
      categoryId: categoryId("home-appliances"),
    },
    {
      name: "Rechargeable Table Fan",
      slug: "rechargeable-table-fan",
      description: "Quiet, compact cooling for your desk, bedside or counter with adjustable airflow and rechargeable convenience.",
      price: 44900, compareAtPrice: null, images: ["/assets/table-fan.jpg"], stock: 22, featured: true,
      categoryId: categoryId("lifestyle"),
    },
    {
      name: "7-piece Non-stick Cookware Set",
      slug: "7-piece-non-stick-cookware-set",
      description: "A coordinated non-stick cookware collection built for easy family meals, comfortable handling and simple cleanup.",
      price: 129900, compareAtPrice: 149900, images: ["/assets/cookware-set.jpg"], stock: 12, featured: true,
      categoryId: categoryId("kitchen-dining"),
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({ where: { slug: product.slug }, update: product, create: product });
  }

  const zones = [
    { name: "Accra Metro", price: 1500, estimatedDays: "1-2 days" },
    { name: "Greater Accra (Outskirts)", price: 2500, estimatedDays: "2-3 days" },
    { name: "Other Regions", price: 4000, estimatedDays: "3-5 days" },
  ];

  for (const zone of zones) {
    const existing = await prisma.deliveryZone.findFirst({ where: { name: zone.name } });
    if (!existing) await prisma.deliveryZone.create({ data: zone });
  }

  console.log(`Seed complete: ${products.length} products and ${categories.length} categories are ready.`);
}

main()
  .catch((error) => { console.error(error); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
