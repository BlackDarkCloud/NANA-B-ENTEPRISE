"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";

export default function BottomNav() {
  const { count } = useCart();
  const { data: session } = useSession();
  const tabs = [
    { href: "/", label: "Shop", icon: "H" },
    { href: "/search", label: "Search", icon: "S" },
    { href: session?.user ? "/account/orders" : "/login", label: session?.user ? "Account" : "Sign in", icon: "A" },
    { href: "/cart", label: "Bag", icon: "B" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-slate-200 bg-white py-2 shadow-[0_-8px_30px_rgba(15,23,42,.08)] md:hidden">
      {tabs.map((tab) => (
        <Link key={tab.label} href={tab.href} className="relative flex min-w-16 flex-col items-center text-[11px] font-semibold text-slate-600">
          <span className="mb-1 flex h-6 w-6 items-center justify-center rounded-lg bg-brand-light text-[10px] font-black text-brand">{tab.icon}</span>
          {tab.label}
          {tab.href === "/cart" && count > 0 && <span className="absolute -top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[9px] text-white">{count}</span>}
        </Link>
      ))}
    </nav>
  );
}
