"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

const tabs = [
  { href: "/", label: "Shop", icon: "🏬" },
  { href: "/search", label: "Search", icon: "🔍" },
  { href: "/account/orders", label: "Orders", icon: "📦" },
  { href: "/cart", label: "Cart", icon: "🛒" },
];

export default function BottomNav() {
  const { count } = useCart();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-40">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className="flex flex-col items-center text-xs text-ink/70 relative px-2"
        >
          <span className="text-xl">{t.icon}</span>
          {t.label}
          {t.href === "/cart" && count > 0 && (
            <span className="absolute -top-1 right-0 bg-brand text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {count}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
