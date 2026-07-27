import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature, verifyTransaction } from "@/lib/paystack";
import { NextResponse } from "next/server";

// Paystack webhooks are the source of truth for payment confirmation.
// Always verify the signature AND re-verify the transaction server-side.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const reference = event.data.reference;

    // Re-verify directly with Paystack rather than trusting the webhook payload alone
    const verified = await verifyTransaction(reference);
    if (verified.status !== "success") {
      return NextResponse.json({ received: true });
    }

    const order = await prisma.order.findUnique({
      where: { reference },
      include: { items: true },
    });

    if (order && order.status === "PENDING") {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: "PAID", paidAt: new Date() },
        }),
        ...order.items.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        ),
        ...(order.couponId
          ? [
              prisma.coupon.update({
                where: { id: order.couponId },
                data: { usedCount: { increment: 1 } },
              }),
            ]
          : []),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
