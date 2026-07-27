"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatGHS } from "@/lib/money";
import { useRouter } from "next/navigation";

type Zone = { id: string; name: string; price: number; estimatedDays: string };

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
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
    fetch("/api/delivery-zones")
      .then((r) => r.json())
      .then((data) => {
        setZones(data);
        if (data[0]) setZoneId(data[0].id);
      });
  }, []);

  const deliveryFee = zones.find((z) => z.id === zoneId)?.price || 0;
  const total = subtotal + deliveryFee - discount;

  async function applyCoupon() {
    setCouponMsg("");
    if (!couponCode) return;
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal }),
    });
    const data = await res.json();
    if (!res.ok) {
      setDiscount(0);
      setCouponMsg(data.error || "Invalid coupon");
    } else {
      setDiscount(data.discount);
      setCouponMsg(`Coupon applied: -${formatGHS(data.discount)}`);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          zoneId,
          couponCode: discount > 0 ? couponCode : undefined,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      clearCart();
      window.location.href = data.authorization_url; // redirect to Paystack
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
      <h1 className="font-semibold text-lg">Checkout</h1>

      <div className="space-y-3">
        <input required placeholder="Full Name" className="w-full border rounded-lg p-3"
          value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input required type="email" placeholder="Email" className="w-full border rounded-lg p-3"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required placeholder="Phone Number" className="w-full border rounded-lg p-3"
          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input required placeholder="Delivery Address" className="w-full border rounded-lg p-3"
          value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input required placeholder="City / Town" className="w-full border rounded-lg p-3"
          value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <textarea placeholder="Order notes (optional)" className="w-full border rounded-lg p-3"
          value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </div>

      <div>
        <label className="text-sm font-medium">Delivery Zone</label>
        <select
          className="w-full border rounded-lg p-3 mt-1"
          value={zoneId}
          onChange={(e) => setZoneId(e.target.value)}
        >
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name} — {formatGHS(z.price)} ({z.estimatedDays})
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <input
          placeholder="Coupon code"
          className="flex-1 border rounded-lg p-3"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button type="button" onClick={applyCoupon} className="border border-brand text-brand rounded-lg px-4">
          Apply
        </button>
      </div>
      {couponMsg && <p className="text-xs text-brand">{couponMsg}</p>}

      <div className="border-t pt-4 space-y-1 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatGHS(subtotal)}</span></div>
        <div className="flex justify-between"><span>Delivery</span><span>{formatGHS(deliveryFee)}</span></div>
        {discount > 0 && <div className="flex justify-between text-brand"><span>Discount</span><span>-{formatGHS(discount)}</span></div>}
        <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total</span><span>{formatGHS(total)}</span></div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand text-white rounded-lg py-3 font-semibold disabled:opacity-50"
      >
        {loading ? "Redirecting to Paystack..." : "Pay Now"}
      </button>
    </form>
  );
}
