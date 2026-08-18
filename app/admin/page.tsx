import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/money";
import { emailNotificationsConfigured, ownerEmailAddress } from "@/lib/email";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, orderCount, pendingCount, revenue, lowStock, recentOrders] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["PAID", "PROCESSING"] } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } } }),
    prisma.product.count({ where: { active: true, stock: { lte: 5 } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
  ]);

  const cards = [
    { label: "Revenue", value: formatGHS(revenue._sum.total || 0), note: "Confirmed payments" },
    { label: "Orders", value: orderCount.toString(), note: "All customer orders" },
    { label: "To fulfil", value: pendingCount.toString(), note: "Paid or processing" },
    { label: "Active products", value: productCount.toString(), note: `${lowStock} low-stock item${lowStock === 1 ? "" : "s"}` },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><span className="eyebrow">Store control centre</span><h1 className="mt-2 text-3xl font-black tracking-tight text-brand-dark">Good day, Administrator</h1><p className="mt-2 text-sm text-slate-500">Here is what is happening with Nana B Enterprises.</p></div>
        <Link href="/admin/products/new" className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark">Add a product</Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
            <p className="mt-3 text-2xl font-black text-brand-dark">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div><h2 className="font-black text-brand-dark">Recent orders</h2><p className="text-xs text-slate-500">Latest activity from customers</p></div>
            <Link href="/admin/orders" className="text-xs font-bold text-brand">View all orders</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">No orders have been placed yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <div key={order.id} className="grid grid-cols-[1fr_auto] gap-3 p-5 text-sm">
                  <div><p className="font-bold text-slate-800">{order.fullName}</p><p className="mt-1 text-xs text-slate-500">{order.reference} • {order.items.length} item(s)</p></div>
                  <div className="text-right"><p className="font-black text-brand-dark">{formatGHS(order.total)}</p><span className="mt-1 inline-block rounded-full bg-brand-light px-2 py-1 text-[10px] font-bold text-brand">{order.status}</span></div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className={`rounded-2xl border p-6 shadow-sm ${emailNotificationsConfigured() ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Email notifications</p>
          <h2 className="mt-3 text-xl font-black text-brand-dark">{emailNotificationsConfigured() ? "Alerts are active" : "Ready to connect"}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {emailNotificationsConfigured()
              ? `New order alerts are being sent to ${ownerEmailAddress()}. Customers receive order status updates automatically.`
              : "Add the owner email and Resend details to the deployment settings to activate owner and customer emails."}
          </p>
          <div className="mt-5 rounded-xl bg-white/70 p-4 text-xs leading-5 text-slate-600">
            <strong className="block text-brand-dark">Notification events</strong>
            New order • Payment confirmed • Processing • Shipped • Delivered • Cancelled
          </div>
        </aside>
      </div>
    </div>
  );
}
