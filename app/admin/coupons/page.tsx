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
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create coupon");
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
      <h1 className="text-xl font-semibold mb-4">Coupons</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2 mb-6 max-w-xl">
        <input required placeholder="Code (e.g. WELCOME10)" className="border rounded-lg p-2 col-span-2"
          value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <select className="border rounded-lg p-2" value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="PERCENTAGE">Percentage %</option>
          <option value="FIXED">Fixed amount (GHS)</option>
        </select>
        <input required type="number" placeholder={form.type === "PERCENTAGE" ? "e.g. 10 (%)" : "e.g. 20 (GHS)"}
          className="border rounded-lg p-2" value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })} />
        <input type="number" placeholder="Min order (GHS, optional)" className="border rounded-lg p-2"
          value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
        <input type="number" placeholder="Max uses (optional)" className="border rounded-lg p-2"
          value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
        <input type="date" className="border rounded-lg p-2 col-span-2" value={form.expiresAt}
          onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
        <button className="bg-brand text-white rounded-lg px-4 py-2 text-sm font-semibold col-span-2">
          Create Coupon
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="space-y-2 max-w-xl">
        {coupons.map((c) => (
          <div key={c.id} className="border rounded-lg p-3 flex justify-between items-center text-sm">
            <div>
              <p className="font-medium">{c.code}</p>
              <p className="text-gray-500">
                {c.type === "PERCENTAGE" ? `${c.value}% off` : `${formatGHS(c.value)} off`}
                {c.minOrderAmount > 0 && ` · min ${formatGHS(c.minOrderAmount)}`}
                {c.maxUses && ` · ${c.usedCount}/${c.maxUses} used`}
              </p>
              {c.expiresAt && <p className="text-xs text-gray-400">Expires {new Date(c.expiresAt).toLocaleDateString()}</p>}
            </div>
            <button
              onClick={() => toggleActive(c)}
              className={`text-xs px-3 py-1 rounded-full ${c.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
            >
              {c.active ? "Active" : "Disabled"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
