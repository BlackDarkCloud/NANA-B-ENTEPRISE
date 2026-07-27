"use client";

import { useCart } from "@/context/CartContext";
import { formatGHS } from "@/lib/money";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="site-shell py-20 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-light text-2xl text-brand">◇</span>
          <h1 className="mt-5 text-2xl font-black text-brand-dark">Your bag is waiting</h1>
          <p className="mt-2 text-sm text-slate-500">Browse our quality appliances and add something you love.</p>
          <Link href="/" className="btn-primary mt-7">Start shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="site-shell py-10">
      <span className="eyebrow">Your selections</span>
      <h1 className="section-title mt-2">Shopping bag</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {item.image && <Image src={item.image} alt={item.name} fill unoptimized={item.image.startsWith("data:")} className="object-cover" />}
              </div>
              <div className="flex flex-1 flex-col">
                <p className="line-clamp-2 font-bold text-brand-dark">{item.name}</p>
                <p className="mt-1 font-extrabold text-brand">{formatGHS(item.price)}</p>
                <div className="mt-auto flex items-center gap-2">
                  <button aria-label="Reduce quantity" onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="h-8 w-8 rounded-lg border border-slate-300">−</button>
                  <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                  <button aria-label="Increase quantity" onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="h-8 w-8 rounded-lg border border-slate-300">+</button>
                  <button onClick={() => removeItem(item.productId)} className="ml-auto text-xs font-semibold text-brand-red">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-2xl bg-brand-dark p-6 text-white shadow-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">Order summary</p>
          <div className="mt-5 flex justify-between border-b border-white/10 pb-5"><span className="text-white/70">Subtotal</span><strong className="text-xl">{formatGHS(subtotal)}</strong></div>
          <p className="mt-4 text-xs leading-5 text-white/60">Delivery fee is calculated from your location at checkout.</p>
          <Link href="/checkout" className="mt-6 block rounded-xl bg-brand-red py-3.5 text-center font-bold text-white hover:bg-red-700">Continue to checkout</Link>
          <Link href="/" className="mt-4 block text-center text-sm font-semibold text-white/70 hover:text-white">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
