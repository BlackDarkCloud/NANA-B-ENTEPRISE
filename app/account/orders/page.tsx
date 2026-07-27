import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/money";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusDetails: Record<string, { label: string; message: string; style: string }> = {
  PENDING: { label: "Awaiting payment", message: "Complete payment to confirm this order.", style: "bg-amber-50 text-amber-700" },
  PAID: { label: "Payment confirmed", message: "Your order has been received by our team.", style: "bg-blue-50 text-blue-700" },
  PROCESSING: { label: "Being prepared", message: "Nana B is preparing your items.", style: "bg-violet-50 text-violet-700" },
  SHIPPED: { label: "On the way", message: "Your order has been dispatched.", style: "bg-cyan-50 text-cyan-700" },
  DELIVERED: { label: "Delivered", message: "Your order has reached its destination.", style: "bg-emerald-50 text-emerald-700" },
  CANCELLED: { label: "Cancelled", message: "Contact Nana B if you need help.", style: "bg-red-50 text-red-700" },
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <div className="site-shell py-20 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-9 shadow-sm">
          <h1 className="text-2xl font-black text-brand-dark">Sign in to view your orders</h1>
          <p className="mt-2 text-sm text-slate-500">Your order history and latest delivery updates will appear here.</p>
          <Link href="/login" className="btn-primary mt-7">Sign in</Link>
          <p className="mt-5 text-sm text-slate-500">No account? <Link href="/register" className="font-bold text-brand">Register now</Link></p>
        </div>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="site-shell py-10 sm:py-14">
      <span className="eyebrow">Your Nana B account</span>
      <h1 className="section-title mt-2">Orders and delivery updates</h1>
      <p className="mt-2 text-sm text-slate-500">Important changes are also sent to {session.user.email} when email alerts are active.</p>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-xl font-black text-brand-dark">You have not placed an order yet</h2>
          <p className="mt-2 text-sm text-slate-500">Discover quality appliances for your home or business.</p>
          <Link href="/" className="btn-primary mt-6">Start shopping</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((order) => {
            const details = statusDetails[order.status];
            return (
              <article key={order.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
                  <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Order reference</p><h2 className="mt-1 font-black text-brand-dark">{order.reference}</h2><p className="mt-1 text-xs text-slate-500">{new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(order.createdAt)}</p></div>
                  <div className="text-right"><span className={`inline-block rounded-full px-3 py-1.5 text-xs font-bold ${details.style}`}>{details.label}</span><p className="mt-2 text-xl font-black text-brand-dark">{formatGHS(order.total)}</p></div>
                </div>
                <div className="border-y border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-600 sm:px-6">{details.message}</div>
                <div className="p-5 sm:p-6">
                  {order.items.map((item) => <div key={item.id} className="flex justify-between py-1 text-sm"><span><strong>{item.quantity} x</strong> {item.name}</span><span className="font-semibold">{formatGHS(item.price * item.quantity)}</span></div>)}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
