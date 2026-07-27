import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const zones = await prisma.deliveryZone.findMany({
    where: { active: true },
    orderBy: { price: "asc" },
  });
  return NextResponse.json(zones);
}
