"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const links = [
  { href: "/admin", label: "Overview", mark: "01" },
  { href: "/admin/orders", label: "Orders", mark: "02" },
  { href: "/admin/products", label: "Products", mark: "03" },
  { href: "/admin/delivery-zones", label: "Delivery", mark: "04" },
  { href: "/admin/coupons", label: "Coupons", mark: "05" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname === "/admin/login") {
    return <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#F3F5F9]">{children}</div>;
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#F3F5F9] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden min-h-screen bg-brand-dark p-5 text-white lg:flex lg:flex-col">
        <Link href="/admin" className="rounded-2xl border border-white/10 bg-white/10 p-4">
          <p className="text-lg font-black">NANA B</p>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/50">Administrator account</p>
        </Link>
        <nav className="mt-8 space-y-2">
          {links.map((link) => {
            const active = link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-white text-brand-dark shadow-lg" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                <span className={`text-[10px] ${active ? "text-brand-red" : "text-white/40"}`}>{link.mark}</span>{link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-black/10 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Signed in administrator</p>
          <p className="mt-2 truncate text-xs font-semibold">{session?.user?.email}</p>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="mt-4 w-full rounded-xl bg-white/10 px-3 py-2.5 text-xs font-bold hover:bg-white/20">Sign out securely</button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-7 lg:px-10">
          <div><p className="text-sm font-black text-brand-dark">Nana B Management</p><p className="text-[10px] text-slate-400">Private administration area</p></div>
          <div className="flex items-center gap-3"><Link href="/" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">View store</Link><span className="hidden rounded-full bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-700 sm:inline">Secure admin session</span></div>
        </header>
        <nav className="sticky top-16 z-30 flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          {links.map((link) => <Link key={link.href} href={link.href} className="whitespace-nowrap rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">{link.label}</Link>)}
        </nav>
        <main className="mx-auto max-w-[1400px] p-4 pb-24 sm:p-7 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
