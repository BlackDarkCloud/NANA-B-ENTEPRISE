"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="flex items-center gap-3 px-4 py-3">
        <Link href="/" className="text-xl font-bold text-brand tracking-tight">
          Nana B
        </Link>
        <form action="/search" className="flex-1">
          <input
            name="q"
            placeholder="Everything you're looking for"
            className="w-full rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </form>
        <Link href="/cart" className="relative">
          <span className="text-2xl">🛒</span>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
