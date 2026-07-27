"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { count } = useCart();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="bg-brand-dark text-white">
        <div className="site-shell flex h-8 items-center justify-between text-[11px] sm:text-xs">
          <p>Wholesale & retail • Delivery across Ghana</p>
          <a href="tel:+233244018530" className="font-semibold hover:text-white/80">
            Call 0244 018 530
          </a>
        </div>
      </div>
      <div className="site-shell flex h-[72px] items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Nana B Enterprises home">
          <Image src="/assets/nana-b-logo.jpg" alt="" width={48} height={48} className="h-11 w-11 rounded-xl object-cover object-top" />
          <span className="hidden leading-none sm:block">
            <strong className="block text-lg tracking-tight text-brand-dark">NANA B</strong>
            <small className="text-[9px] font-bold tracking-[.18em] text-brand-red">ENTERPRISES</small>
          </span>
        </Link>
        <form action="/search" className="relative hidden max-w-2xl flex-1 sm:block">
          <input
            name="q"
            placeholder="Search appliances, cookware and more"
            aria-label="Search products"
            className="w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-4 pr-14 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
          <button className="absolute right-1 top-1 rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark">
            Search
          </button>
        </form>
        <Link href="/search" className="ml-auto rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 sm:hidden">Search</Link>
        <div className="hidden items-center gap-4 lg:flex">
          {session?.user ? (
            <>
              <Link href="/account/orders" className="text-sm font-semibold text-slate-700 hover:text-brand">My orders</Link>
              <button onClick={() => signOut()} className="text-sm text-slate-500 hover:text-brand">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-brand">Sign in</Link>
              <Link href="/register" className="rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-light">Create account</Link>
            </>
          )}
        </div>
        <Link href={session?.user ? "/account/orders" : "/login"} className="rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 lg:hidden">
          {session?.user ? "Account" : "Sign in"}
        </Link>
        <Link href="/cart" className="relative rounded-full bg-brand-light px-3 py-2 text-sm font-bold text-brand" aria-label={`Cart with ${count} items`}>
          Bag
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] text-white">{count}</span>
          )}
        </Link>
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
