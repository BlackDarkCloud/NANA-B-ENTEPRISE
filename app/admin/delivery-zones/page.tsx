"use client";

import { useEffect, useState } from "react";
import { formatGHS } from "@/lib/money";

type Zone = { id: string; name: string; price: number; estimatedDays: string; active: boolean };

export default function AdminDeliveryZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [form, setForm] = useState({ name: "", price: "", estimatedDays: "" });
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/delivery-zones").then((r) => r.json()).then(setZones);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/delivery-zones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to add zone");
      return;
    }
    setForm({ name: "", price: "", estimatedDays: "" });
    load();
  }

  async function toggleActive(zone: Zone) {
    await fetch(`/api/admin/delivery-zones/${zone.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !zone.active }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Delivery Zones</h1>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-6 max-w-xl">
        <input required placeholder="Zone name (e.g. Kumasi)" className="border rounded-lg p-2 flex-1 min-w-[140px]"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="number" step="0.01" placeholder="Price (GHS)" className="border rounded-lg p-2 w-32"
          value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input required placeholder="Est. days (e.g. 2-3 days)" className="border rounded-lg p-2 w-36"
          value={form.estimatedDays} onChange={(e) => setForm({ ...form, estimatedDays: e.target.value })} />
        <button className="bg-brand text-white rounded-lg px-4 py-2 text-sm font-semibold">Add Zone</button>
      </form>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="space-y-2 max-w-xl">
        {zones.map((z) => (
          <div key={z.id} className="border rounded-lg p-3 flex justify-between items-center text-sm">
            <div>
              <p className="font-medium">{z.name}</p>
              <p className="text-gray-500">{formatGHS(z.price)} · {z.estimatedDays}</p>
            </div>
            <button
              onClick={() => toggleActive(z)}
              className={`text-xs px-3 py-1 rounded-full ${z.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
            >
              {z.active ? "Active" : "Disabled"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
