import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/money";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, deliveryZone: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="border rounded-lg p-3 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold">{o.reference}</span>
              <OrderStatusSelect orderId={o.id} status={o.status} />
            </div>
            <p>{o.fullName} — {o.phone}</p>
            <p className="text-gray-500">{o.address}, {o.city}</p>
            <p className="text-gray-500">{o.deliveryZone?.name || "No zone"}</p>
            <ul className="mt-2 text-xs text-gray-600">
              {o.items.map((it) => (
                <li key={it.id}>{it.quantity} x {it.name}</li>
              ))}
            </ul>
            <p className="font-bold mt-2">{formatGHS(o.total)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
