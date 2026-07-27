import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/money";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="mb-4">Sign in to view your orders.</p>
        <Link href="/login" className="text-brand underline">Sign In</Link>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-4 py-4">
      <h1 className="font-semibold text-lg mb-4">Your Orders</h1>
      {orders.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="border rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{o.reference}</span>
              <span className="capitalize text-brand">{o.status.toLowerCase()}</span>
            </div>
            <p className="text-xs text-gray-500">{o.items.length} item(s)</p>
            <p className="font-bold mt-1">{formatGHS(o.total)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
