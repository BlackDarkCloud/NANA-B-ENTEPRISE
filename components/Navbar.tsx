"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { count } = useCart();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="hidden bg-brand-dark text-white md:block">
        <div className="site-shell flex h-8 items-center justify-between text-xs">
          <p>Wholesale & retail • Delivery across Ghana</p>
          <a href="tel:+233244018530" className="font-semibold hover:text-white/80">Call 0244 018 530</a>
        </div>
      </div>

      <div className="md:hidden">
        <div className="relative flex h-[68px] items-center justify-between px-5">
          <button type="button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full text-brand-dark">
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
          </button>
          <Link href="/" className="absolute left-1/2 -translate-x-1/2" aria-label="Nana B Enterprises home">
            <span className="whitespace-nowrap text-sm font-black tracking-[.08em] text-brand-dark">NANA B ENTERPRISES</span>
          </Link>
          <Link href="/cart" className="relative rounded-full border border-slate-200 px-3 py-2 text-xs font-black text-brand-dark" aria-label={`Shopping bag with ${count} items`}>
            Bag
            {count > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] text-white">{count}</span>}
          </Link>
        </div>

        <form action="/search" className="relative px-5 pb-4">
          <input name="q" aria-label="Search products" placeholder="Everything you're looking for" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 pr-20 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" />
          <button className="absolute bottom-[21px] right-7 rounded-lg bg-brand px-3 py-2 text-xs font-bold text-white">Search</button>
        </form>

        {menuOpen && (
          <div className="absolute left-4 right-4 top-[120px] z-50 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
            <nav className="grid grid-cols-2 gap-2 text-sm font-bold text-slate-700">
              <Link onClick={() => setMenuOpen(false)} href="/" className="rounded-xl bg-slate-50 p-3">Shop</Link>
              <Link onClick={() => setMenuOpen(false)} href="/category/home-appliances" className="rounded-xl bg-slate-50 p-3">Appliances</Link>
              <Link onClick={() => setMenuOpen(false)} href="/category/kitchen-dining" className="rounded-xl bg-slate-50 p-3">Kitchen</Link>
              <Link onClick={() => setMenuOpen(false)} href="/category/lifestyle" className="rounded-xl bg-slate-50 p-3">Lifestyle</Link>
            </nav>
            <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
              {session?.user ? (
                <>
                  <Link onClick={() => setMenuOpen(false)} href={(session.user as any)?.role === "ADMIN" ? "/admin" : "/account"} className="flex-1 rounded-xl bg-brand p-3 text-center text-sm font-bold text-white">{(session.user as any)?.role === "ADMIN" ? "Admin panel" : "My account"}</Link>
                  <button onClick={() => signOut()} className="flex-1 rounded-xl border border-slate-300 p-3 text-sm font-bold">Sign out</button>
                </>
              ) : (
                <>
                  <Link onClick={() => setMenuOpen(false)} href="/login" className="flex-1 rounded-xl border border-brand p-3 text-center text-sm font-bold text-brand">Sign in</Link>
                  <Link onClick={() => setMenuOpen(false)} href="/register" className="flex-1 rounded-xl bg-brand p-3 text-center text-sm font-bold text-white">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="site-shell hidden h-[76px] items-center gap-4 md:flex">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Nana B Enterprises home">
          <Image src="/assets/nana-b-logo.jpg" alt="" width={48} height={48} className="h-11 w-11 rounded-xl object-cover object-top" />
          <span className="leading-none"><strong className="block text-lg tracking-tight text-brand-dark">NANA B</strong><small className="text-[9px] font-bold tracking-[.18em] text-brand-red">ENTERPRISES</small></span>
        </Link>
        <form action="/search" className="relative max-w-2xl flex-1">
          <input name="q" placeholder="Everything you're looking for" aria-label="Search products" className="w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-4 pr-20 text-sm outline-none focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10" />
          <button className="absolute right-1 top-1 rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white">Search</button>
        </form>
        <div className="ml-auto flex items-center gap-4">
          {session?.user ? (
            <><Link href={(session.user as any)?.role === "ADMIN" ? "/admin" : "/account"} className="text-sm font-semibold text-slate-700">{(session.user as any)?.role === "ADMIN" ? "Admin panel" : "My account"}</Link><button onClick={() => signOut()} className="text-sm text-slate-500">Sign out</button></>
          ) : (
            <><Link href="/login" className="text-sm font-semibold text-slate-700">Sign in</Link><Link href="/register" className="rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand">Create account</Link></>
          )}
          <Link href="/cart" className="relative rounded-full bg-brand-light px-4 py-2 text-sm font-bold text-brand">Bag {count > 0 && `(${count})`}</Link>
        </div>
      </div>

      <nav className="hidden border-t border-slate-100 md:block">
        <div className="site-shell flex h-11 items-center gap-8 text-sm font-semibold text-slate-600">
          <Link href="/" className="text-brand">Home</Link>
          <Link href="/category/home-appliances" className="hover:text-brand">Home appliances</Link>
          <Link href="/category/kitchen-dining" className="hover:text-brand">Kitchen & dining</Link>
          <Link href="/category/lifestyle" className="hover:text-brand">Lifestyle</Link>
          <a href="/#offers" className="hover:text-brand">Special offers</a>
          <a href="#contact" className="hover:text-brand">Contact</a>
        </div>
      </nav>
    </header>
  );
}
