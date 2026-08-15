import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).optional(),
  price: z.number().nonnegative().optional(),
  estimatedDays: z.string().min(2).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check the delivery details." }, { status: 400 });
  const { price, ...rest } = parsed.data;
  const zone = await prisma.deliveryZone.update({
    where: { id: params.id },
    data: { ...rest, ...(price !== undefined ? { price: Math.round(price * 100) } : {}) },
  });
  return NextResponse.json(zone);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.deliveryZone.update({ where: { id: params.id }, data: { active: false } });
  return NextResponse.json({ success: true });
}
