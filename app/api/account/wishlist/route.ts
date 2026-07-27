import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ productId: z.string().min(1) });

export async function POST(request: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Please sign in" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid product" }, { status: 400 });

  const key = { userId_productId: { userId, productId: parsed.data.productId } };
  const existing = await prisma.wishlistItem.findUnique({ where: key });
  if (existing) {
    await prisma.wishlistItem.delete({ where: key });
    return NextResponse.json({ saved: false });
  }

  await prisma.wishlistItem.create({ data: { userId, productId: parsed.data.productId } });
  return NextResponse.json({ saved: true });
}
