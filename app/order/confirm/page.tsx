import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatGHS } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function OrderConfirmPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const ref = searchParams.ref;
  const order = ref
    ? await prisma.order.findUnique({ where: { reference: ref }, include: { items: true } })
    : null;

  if (!order) {
    return (
      <div className="px-4 py-10 text-center">
        <p>Order not found.</p>
        <Link href="/" className="text-brand underline">Back to shop</Link>
      </div>
    );
  }

  const paid = order.status === "PAID" || order.status === "PROCESSING" || order.status === "SHIPPED" || order.status === "DELIVERED";

  return (
    <div className="px-4 py-8 text-center">
      <div className="text-5xl mb-4">{paid ? "✅" : "⏳"}</div>
      <h1 className="text-lg font-semibold mb-2">
        {paid ? "Payment Successful!" : "Payment Pending / Failed"}
      </h1>
      <p className="text-sm text-gray-500 mb-4">Order reference: {order.reference}</p>
      <p className="font-bold text-brand text-xl mb-6">{formatGHS(order.total)}</p>
      <Link href="/" className="inline-block bg-brand text-white rounded-lg px-6 py-3 font-semibold">
        Continue Shopping
      </Link>
    </div>
  );
}
