import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return false;
  }
  return true;
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const {
    name, slug, description, price, compareAtPrice,
    images, stock, categoryId, featured,
  } = body;

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      compareAtPrice: compareAtPrice || null,
      images,
      stock,
      categoryId,
      featured: !!featured,
    },
  });

  return NextResponse.json(product);
}
