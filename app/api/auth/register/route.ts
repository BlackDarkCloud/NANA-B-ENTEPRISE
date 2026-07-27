import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { name, email, password, phone } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.password !== "GUEST_NO_LOGIN") {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);

  if (existing) {
    // upgrade a guest-checkout account into a real account
    await prisma.user.update({
      where: { email },
      data: { name, password: hashed, phone },
    });
  } else {
    await prisma.user.create({ data: { name, email, password: hashed, phone } });
  }

  return NextResponse.json({ success: true });
}
