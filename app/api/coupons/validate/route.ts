import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code, subtotal } = await req.json();

  const coupon = await prisma.coupon.findUnique({ where: { code: code?.toUpperCase() } });

  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
  }
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
  }
  if (subtotal < coupon.minOrderAmount) {
    return NextResponse.json(
      { error: `Minimum order amount not met for this coupon` },
      { status: 400 }
    );
  }

  const discount =
    coupon.type === "PERCENTAGE"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;

  return NextResponse.json({ discount: Math.min(discount, subtotal) });
}
