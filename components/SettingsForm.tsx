"use client";

import { useState } from "react";

type Settings = { name: string; phone: string; emailNotifications: boolean; marketingEmails: boolean };

export default function SettingsForm({ initial }: { initial: Settings }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setMessage("Saving...");
    const response = await fetch("/api/account/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setMessage(response.ok ? "Settings saved successfully." : "Could not save settings.");
  }

  return (
    <form onSubmit={save} className="mt-7 max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div><label className="mb-1.5 block text-sm font-bold">Full name</label><input className="form-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
      <div><label className="mb-1.5 block text-sm font-bold">Phone number</label><input className="form-input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></div>
      <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"><input type="checkbox" className="mt-1" checked={form.emailNotifications} onChange={(event) => setForm({ ...form, emailNotifications: event.target.checked })} /><span><strong className="block text-sm">Order updates</strong><small className="text-slate-500">Receive payment, processing, shipping and delivery emails.</small></span></label>
      <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"><input type="checkbox" className="mt-1" checked={form.marketingEmails} onChange={(event) => setForm({ ...form, marketingEmails: event.target.checked })} /><span><strong className="block text-sm">Offers and new arrivals</strong><small className="text-slate-500">Receive occasional Nana B promotions.</small></span></label>
      {message && <p className="text-sm font-semibold text-brand">{message}</p>}
      <button className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white">Save settings</button>
    </form>
  );
}
