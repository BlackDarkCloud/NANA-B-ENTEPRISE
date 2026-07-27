"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

const tabs = [
  { href: "/", label: "Shop", icon: "⌂" },
  { href: "/search", label: "Search", icon: "⌕" },
  { href: "/account/orders", label: "Orders", icon: "▣" },
  { href: "/cart", label: "Bag", icon: "◇" },
];

export default function BottomNav() {
  const { count } = useCart();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-slate-200 bg-white py-2 shadow-[0_-8px_30px_rgba(15,23,42,.08)] md:hidden">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} className="relative flex min-w-16 flex-col items-center text-[11px] font-medium text-slate-600">
          <span className="text-xl leading-5 text-brand">{tab.icon}</span>
          {tab.label}
          {tab.href === "/cart" && count > 0 && (
            <span className="absolute -top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[9px] text-white">{count}</span>
          )}
        </Link>
      ))}
    </nav>
  );
}
