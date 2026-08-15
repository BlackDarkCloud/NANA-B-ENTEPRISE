"use client";

import { useEffect, useState } from "react";
import { formatGHS } from "@/lib/money";

type Coupon = {
  id: string; code: string; type: "PERCENTAGE" | "FIXED"; value: number;
  minOrderAmount: number; maxUses: number | null; usedCount: number;
  active: boolean; expiresAt: string | null;
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "", type: "PERCENTAGE", value: "", minOrderAmount: "", maxUses: "", expiresAt: "",
  });

  function load() {
    fetch("/api/admin/coupons").then((r) => r.json()).then(setCoupons);
  }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        type: form.type,
        value: form.type === "PERCENTAGE" ? parseInt(form.value, 10) : Math.round(parseFloat(form.value) * 100),
        minOrderAmount: form.minOrderAmount ? Math.round(parseFloat(form.minOrderAmount) * 100) : 0,
        maxUses: form.maxUses ? parseInt(form.maxUses, 10) : null,
        expiresAt: form.expiresAt || null,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not create coupon.");
      return;
    }
    setForm({ code: "", type: "PERCENTAGE", value: "", minOrderAmount: "", maxUses: "", expiresAt: "" });
    load();
  }

  async function toggleActive(c: Coupon) {
    await fetch(`/api/admin/coupons/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    load();
  }

  return (
    <div>
      <span className="eyebrow">Promotions</span>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-brand-dark">Coupons</h1>
      <p className="mt-2 text-sm text-slate-500">Create discount codes and turn them on or off at any time.</p>

      <form onSubmit={handleSubmit} className="mt-7 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-bold">Coupon code</label>
            <input required placeholder="e.g. WELCOME10" className="form-input uppercase" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold">Discount type</label>
            <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="PERCENTAGE">Percentage %</option>
              <option value="FIXED">Fixed amount (GHS)</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold">Discount value</label>
            <input required type="number" min="0" placeholder={form.type === "PERCENTAGE" ? "e.g. 10" : "e.g. 20"} className="form-input" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold">Minimum order (optional)</label>
            <input type="number" min="0" placeholder="GHS" className="form-input" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold">Max uses (optional)</label>
            <input type="number" min="0" placeholder="Unlimited" className="form-input" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-bold">Expiry date (optional)</label>
            <input type="date" className="form-input" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          </div>
        </div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={saving} className="w-full rounded-xl bg-brand px-5 py-3.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-50 sm:w-fit">{saving ? "Creating..." : "Create coupon"}</button>
      </form>

      <div className="mt-7 space-y-3">
        {coupons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="font-bold text-brand-dark">No coupons yet</h2>
            <p className="mt-2 text-sm text-slate-500">Coupons you create will appear here.</p>
          </div>
        ) : coupons.map((c) => (
          <div key={c.id} className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft ${!c.active ? "opacity-60" : ""}`}>
            <div>
              <p className="font-black tracking-wide text-brand-dark">{c.code}</p>
              <p className="mt-1 text-sm text-slate-500">
                {c.type === "PERCENTAGE" ? `${c.value}% off` : `${formatGHS(c.value)} off`}
                {c.minOrderAmount > 0 && ` · min ${formatGHS(c.minOrderAmount)}`}
                {c.maxUses && ` · ${c.usedCount}/${c.maxUses} used`}
              </p>
              {c.expiresAt && <p className="mt-1 text-xs text-slate-400">Expires {new Date(c.expiresAt).toLocaleDateString()}</p>}
            </div>
            <button
              onClick={() => toggleActive(c)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${c.active ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
            >
              {c.active ? "Active" : "Disabled"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
