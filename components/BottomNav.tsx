"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";

export default function BottomNav() {
  const { count } = useCart();
  const { data: session } = useSession();
  const tabs = [
    { href: "/", label: "Shop", icon: "⌂" },
    { href: "/search", label: "Search", icon: "⌕" },
    { href: session?.user ? "/account/orders" : "/login", label: session?.user ? "Account" : "Sign in", icon: "♡" },
    { href: "/cart", label: "Cart", icon: "▱" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[70px] justify-around border-t border-slate-200 bg-white px-2 pt-2 shadow-[0_-8px_30px_rgba(15,23,42,.08)] md:hidden">
      {tabs.map((tab) => (
        <Link key={tab.label} href={tab.href} className="relative flex min-w-16 flex-col items-center text-[11px] font-medium text-slate-600">
          <span className="text-2xl leading-6 text-brand-dark">{tab.icon}</span>
          <span className="mt-1">{tab.label}</span>
          {tab.href === "/cart" && count > 0 && <span className="absolute -right-0.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[9px] text-white">{count}</span>}
        </Link>
      ))}
    </nav>
  );
}
