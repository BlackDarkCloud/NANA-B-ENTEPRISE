"use client";

import { useEffect, useState } from "react";
import { formatGHS } from "@/lib/money";

type Zone = { id: string; name: string; price: number; estimatedDays: string; active: boolean };

export default function AdminDeliveryZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [form, setForm] = useState({ name: "", price: "", estimatedDays: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: "", price: "", estimatedDays: "" });
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/delivery-zones").then((response) => response.json()).then(setZones);
  }
  useEffect(() => { load(); }, []);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/delivery-zones", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    if (!response.ok) return setError((await response.json()).error || "Could not add delivery zone.");
    setForm({ name: "", price: "", estimatedDays: "" });
    load();
  }

  function beginEdit(zone: Zone) {
    setEditing(zone.id);
    setDraft({ name: zone.name, price: (zone.price / 100).toString(), estimatedDays: zone.estimatedDays });
  }

  async function save(zone: Zone) {
    const response = await fetch(`/api/admin/delivery-zones/${zone.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, price: Number(draft.price), active: zone.active }),
    });
    if (!response.ok) return setError((await response.json()).error || "Could not update delivery zone.");
    setEditing(null);
    load();
  }

  async function toggle(zone: Zone) {
    await fetch(`/api/admin/delivery-zones/${zone.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !zone.active }) });
    load();
  }

  return (
    <div>
      <span className="eyebrow">Delivery management</span><h1 className="mt-2 text-3xl font-black text-brand-dark">Delivery prices</h1><p className="mt-2 text-sm text-slate-500">Add areas or update their delivery price and estimated time at any moment.</p>

      <form onSubmit={create} className="mt-7 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_160px_180px_auto]">
        <input required placeholder="Area or zone name" className="form-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input required min="0" step="0.01" type="number" placeholder="Price (GHS)" className="form-input" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
        <input required placeholder="e.g. 2-3 days" className="form-input" value={form.estimatedDays} onChange={(event) => setForm({ ...form, estimatedDays: event.target.value })} />
        <button className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white">Add zone</button>
      </form>
      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-6 space-y-3">
        {zones.map((zone) => (
          <div key={zone.id} className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${!zone.active ? "opacity-60" : ""}`}>
            {editing === zone.id ? (
              <div className="grid gap-3 sm:grid-cols-[1fr_150px_180px_auto]">
                <input className="form-input" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
                <input min="0" step="0.01" type="number" className="form-input" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} />
                <input className="form-input" value={draft.estimatedDays} onChange={(event) => setDraft({ ...draft, estimatedDays: event.target.value })} />
                <div className="flex gap-2"><button onClick={() => save(zone)} className="rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white">Save</button><button onClick={() => setEditing(null)} className="rounded-xl border px-4 py-2 text-xs font-bold">Cancel</button></div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div><p className="font-black text-brand-dark">{zone.name}</p><p className="mt-1 text-sm text-slate-500">{zone.estimatedDays}</p></div>
                <div className="sm:text-right"><p className="text-xl font-black text-brand-dark">{formatGHS(zone.price)}</p><p className="text-xs text-slate-400">Customer delivery charge</p></div>
                <div className="flex gap-2"><button onClick={() => beginEdit(zone)} className="rounded-lg bg-brand-light px-4 py-2 text-xs font-bold text-brand">Edit price</button><button onClick={() => toggle(zone)} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600">{zone.active ? "Disable" : "Enable"}</button></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
