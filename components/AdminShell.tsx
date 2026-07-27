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

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#F3F5F9] lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden bg-brand-dark p-5 text-white lg:flex lg:flex-col">
        <Link href="/admin" className="rounded-2xl bg-white/10 p-4">
          <p className="text-lg font-black">NANA B</p>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/50">Management</p>
        </Link>
        <nav className="mt-8 space-y-2">
          {links.map((link) => {
            const active = link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-white text-brand-dark" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                <span className={`text-[10px] ${active ? "text-brand-red" : "text-white/40"}`}>{link.mark}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 p-4">
          <p className="truncate text-xs font-semibold">{session?.user?.email}</p>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="mt-3 text-xs font-bold text-white/60 hover:text-white">Sign out securely</button>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="sticky top-[104px] z-30 flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          {links.map((link) => <Link key={link.href} href={link.href} className="whitespace-nowrap rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">{link.label}</Link>)}
        </div>
        <main className="mx-auto max-w-[1400px] p-4 pb-24 sm:p-7 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
