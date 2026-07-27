import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/money";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  PAID: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-violet-50 text-violet-700",
  SHIPPED: "bg-cyan-50 text-cyan-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, deliveryZone: true, user: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const counts = orders.reduce<Record<string, number>>((result, order) => {
    result[order.status] = (result[order.status] || 0) + 1;
    return result;
  }, {});

  return (
    <div>
      <div><span className="eyebrow">Fulfilment workspace</span><h1 className="mt-2 text-3xl font-black tracking-tight text-brand-dark">Customer orders</h1><p className="mt-2 text-sm text-slate-500">Changing a status automatically prepares an email update for the customer.</p></div>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {["ALL", "PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"].map((status) => (
          <div key={status} className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600">{status} <span className="ml-1 text-brand">{status === "ALL" ? orders.length : counts[status] || 0}</span></div>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><h2 className="font-bold text-brand-dark">No orders yet</h2><p className="mt-2 text-sm text-slate-500">New customer orders will appear here.</p></div>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><h2 className="font-black text-brand-dark">{order.reference}</h2><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle[order.status]}`}>{order.status}</span></div>
                  <p className="mt-1 text-xs text-slate-500">{new Intl.DateTimeFormat("en-GH", { dateStyle: "medium", timeStyle: "short" }).format(order.createdAt)}</p>
                </div>
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </div>
              <div className="grid gap-6 p-5 md:grid-cols-[1fr_1fr_auto]">
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer</p><p className="mt-2 font-bold text-slate-800">{order.fullName}</p><p className="text-sm text-slate-500">{order.user.email}</p><a href={`tel:${order.phone}`} className="text-sm font-semibold text-brand">{order.phone}</a></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery</p><p className="mt-2 text-sm text-slate-700">{order.address}, {order.city}</p><p className="mt-1 text-xs text-slate-500">{order.deliveryZone?.name || "No delivery zone"}</p></div>
                <div className="md:text-right"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Order total</p><p className="mt-2 text-xl font-black text-brand-dark">{formatGHS(order.total)}</p><p className="text-xs text-slate-500">{order.items.length} line item(s)</p></div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                {order.items.map((item) => <p key={item.id} className="text-xs text-slate-600"><strong>{item.quantity} x</strong> {item.name} <span className="float-right">{formatGHS(item.price * item.quantity)}</span></p>)}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
