"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/settings", label: "Settings" },
];

export default function AccountNav() {
  const pathname = usePathname();
  return (
    <aside className="h-fit rounded-2xl bg-brand-dark p-3 text-white">
      <p className="px-3 pb-3 pt-2 text-xs font-black uppercase tracking-[.18em] text-white/45">My Nana B</p>
      <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
        {links.map((link) => {
          const active = link.href === "/account" ? pathname === link.href : pathname.startsWith(link.href);
          return <Link key={link.href} href={link.href} className={`rounded-xl px-4 py-3 text-sm font-bold ${active ? "bg-white text-brand-dark" : "text-white/70 hover:bg-white/10"}`}>{link.label}</Link>;
        })}
      </nav>
      <button onClick={() => signOut({ callbackUrl: "/" })} className="mt-3 w-full border-t border-white/10 px-4 pt-4 text-left text-xs font-bold text-white/55">Sign out</button>
    </aside>
  );
}
