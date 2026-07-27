import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notifyCustomerOfStatus } from "@/lib/email";
import { NextResponse } from "next/server";
import { z } from "zod";

const statusSchema = z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = statusSchema.safeParse((await req.json()).status);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status: parsed.data },
    include: { items: true, user: true },
  });

  const notification = await notifyCustomerOfStatus(order);
  return NextResponse.json({ order, notification });
}
