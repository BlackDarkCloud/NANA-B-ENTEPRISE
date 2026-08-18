import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/money";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AccountDashboard() {
  const session = await auth();
  const userId = (session?.user as any).id as string;
  const [user, orderCount, wishlistCount, latestOrder] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { name: true, email: true } }),
    prisma.order.count({ where: { userId } }),
    prisma.wishlistItem.count({ where: { userId } }),
    prisma.order.findFirst({ where: { userId }, orderBy: { createdAt: "desc" }, include: { items: true } }),
  ]);

  return (
    <div>
      <span className="eyebrow">Customer dashboard</span>
      <h1 className="mt-2 text-3xl font-black text-brand-dark">Welcome, {user.name.split(" ")[0]}</h1>
      <p className="mt-2 text-sm text-slate-500">{user.email}</p>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {[["Orders", orderCount, "/account/orders"], ["Saved items", wishlistCount, "/account/wishlist"], ["Shop", "Browse", "/"]].map(([label, value, href]) => (
          <Link key={label} href={String(href)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand/30">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-3 text-2xl font-black text-brand-dark">{value}</p><p className="mt-2 text-xs font-bold text-brand">Open →</p>
          </Link>
        ))}
      </div>

      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between"><h2 className="font-black text-brand-dark">Latest order</h2><Link href="/account/orders" className="text-xs font-bold text-brand">Track all orders</Link></div>
        {latestOrder ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
            <div><p className="font-bold">{latestOrder.reference}</p><p className="mt-1 text-xs text-slate-500">{latestOrder.items.length} item(s) • {latestOrder.status}</p></div>
            <p className="text-lg font-black text-brand-dark">{formatGHS(latestOrder.total)}</p>
          </div>
        ) : (
          <div className="mt-5 rounded-xl bg-slate-50 p-6 text-center"><p className="text-sm text-slate-500">You have not placed an order yet.</p><Link href="/" className="btn-primary mt-4">Start shopping</Link></div>
        )}
      </section>
    </div>
  );
}
