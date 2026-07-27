"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatGHS } from "@/lib/money";
import { useRouter } from "next/navigation";

type Zone = { id: string; name: string; price: number; estimatedDays: string };

export default function CheckoutPage() {
  const { items, subtotal, clearCart, hydrated } = useCart();
  const router = useRouter();
  const [zones, setZones] = useState<Zone[]>([]);
  const [zoneId, setZoneId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [discount, setDiscount] = useState(0);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "", city: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/delivery-zones").then((response) => response.json()).then((data) => {
      setZones(data);
      if (data[0]) setZoneId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (hydrated && items.length === 0) router.replace("/cart");
  }, [hydrated, items.length, router]);

  const deliveryFee = zones.find((zone) => zone.id === zoneId)?.price || 0;
  const total = subtotal + deliveryFee - discount;

  async function applyCoupon() {
    setCouponMsg("");
    if (!couponCode) return;
    const response = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal }),
    });
    const data = await response.json();
    if (!response.ok) {
      setDiscount(0);
      setCouponMsg(data.error || "Invalid coupon");
    } else {
      setDiscount(data.discount);
      setCouponMsg(`Coupon applied: -${formatGHS(data.discount)}`);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, zoneId, couponCode: discount > 0 ? couponCode : undefined, ...form }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout failed");
      clearCart();
      window.location.href = data.authorization_url;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout failed");
      setLoading(false);
    }
  }

  if (!hydrated || items.length === 0) return null;

  return (
    <form onSubmit={handleSubmit} className="site-shell max-w-3xl space-y-6 py-10">
      <div><span className="eyebrow">Secure payment</span><h1 className="section-title mt-2">Checkout</h1></div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
        <input required placeholder="Full name" className="form-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input required type="email" placeholder="Email address" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required placeholder="Phone number" className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input required placeholder="Delivery address" className="form-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input required placeholder="City / town" className="form-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <textarea placeholder="Order notes (optional)" className="form-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="text-sm font-bold text-brand-dark">Delivery zone</label>
        <select className="form-input mt-2" value={zoneId} onChange={(e) => setZoneId(e.target.value)}>
          {zones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name} — {formatGHS(zone.price)} ({zone.estimatedDays})</option>)}
        </select>
      </div>

      <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <input placeholder="Coupon code" className="form-input flex-1" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
        <button type="button" onClick={applyCoupon} className="rounded-xl border border-brand px-5 font-bold text-brand">Apply</button>
      </div>
      {couponMsg && <p className="text-sm font-semibold text-brand">{couponMsg}</p>}

      <div className="space-y-2 rounded-2xl bg-brand-dark p-6 text-sm text-white">
        <div className="flex justify-between"><span className="text-white/70">Subtotal</span><span>{formatGHS(subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-white/70">Delivery</span><span>{formatGHS(deliveryFee)}</span></div>
        {discount > 0 && <div className="flex justify-between text-emerald-300"><span>Discount</span><span>-{formatGHS(discount)}</span></div>}
        <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-bold"><span>Total</span><span>{formatGHS(total)}</span></div>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={loading} className="w-full rounded-xl bg-brand-red py-3.5 font-bold text-white hover:bg-red-700 disabled:opacity-50">
        {loading ? "Taking you to Paystack..." : `Pay securely • ${formatGHS(total)}`}
      </button>
      <p className="text-center text-xs text-slate-500">Your payment is processed securely by Paystack. Nana B does not store card details.</p>
    </form>
  );
}
