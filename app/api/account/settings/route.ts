import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().max(30).optional(),
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
});

export async function PATCH(request: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Please sign in" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check your details" }, { status: 400 });

  const user = await prisma.user.update({ where: { id: userId }, data: parsed.data, select: { name: true, phone: true, emailNotifications: true, marketingEmails: true } });
  return NextResponse.json(user);
}
