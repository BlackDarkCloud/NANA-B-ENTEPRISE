import { prisma } from "@/lib/prisma";
import { initializeTransaction } from "@/lib/paystack";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { items, zoneId, couponCode, fullName, email, phone, address, city, notes } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Re-fetch products from DB to verify real prices & stock (never trust client prices)
  const productIds = items.map((i: any) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  let subtotal = 0;
  const orderItemsData = items.map((i: any) => {
    const product = products.find((p) => p.id === i.productId);
    if (!product) throw new Error(`Product not found: ${i.productId}`);
    if (product.stock < i.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    subtotal += product.price * i.quantity;
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: i.quantity,
    };
  });

  const zone = zoneId ? await prisma.deliveryZone.findUnique({ where: { id: zoneId } }) : null;
  const deliveryFee = zone?.price || 0;

  let discount = 0;
  let coupon = null;
  if (couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (coupon && coupon.active) {
      discount =
        coupon.type === "PERCENTAGE"
          ? Math.round((subtotal * coupon.value) / 100)
          : coupon.value;
      discount = Math.min(discount, subtotal);
    }
  }

  const total = subtotal + deliveryFee - discount;
  const reference = `NANAB-${nanoid(10)}`;

  // Get or create a lightweight user record tied to this email (guest checkout support)
  const session = await auth();
  let userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    const guest = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: fullName,
        email,
        password: "GUEST_NO_LOGIN", // guest accounts can't log in until they register properly
      },
    });
    userId = guest.id;
  }

  const order = await prisma.order.create({
    data: {
      reference,
      userId,
      subtotal,
      deliveryFee,
      discount,
      total,
      deliveryZoneId: zone?.id,
      couponId: coupon?.id,
      fullName,
      phone,
      address,
      city,
      notes,
      items: { create: orderItemsData },
    },
  });

  try {
    const paystack = await initializeTransaction({
      email,
      amount: total, // pesewas
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/confirm?ref=${reference}`,
      metadata: { orderId: order.id },
    });

    return NextResponse.json({ authorization_url: paystack.authorization_url });
  } catch (err: any) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
