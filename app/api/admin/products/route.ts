import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  price: z.number().int().nonnegative(),
  compareAtPrice: z.number().int().nonnegative().nullable(),
  images: z.array(z.string().min(1)).min(1).max(4),
  stock: z.number().int().nonnegative(),
  categoryId: z.string().min(1),
  featured: z.boolean(),
  active: z.boolean().default(true),
});

export async function POST(request: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check all product details." }, { status: 400 });

  try {
    const product = await prisma.product.create({ data: parsed.data });
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error?.code === "P2002" ? "That product URL name already exists." : "Could not create product." }, { status: 400 });
  }
}
