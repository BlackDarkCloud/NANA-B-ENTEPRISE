import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const zones = await prisma.deliveryZone.findMany({ orderBy: { price: "asc" } });
  return NextResponse.json(zones);
}

export async function POST(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { name, price, estimatedDays } = await req.json();
  const zone = await prisma.deliveryZone.create({
    data: { name, price: Math.round(price * 100), estimatedDays },
  });
  return NextResponse.json(zone);
}
