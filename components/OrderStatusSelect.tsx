"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleChange(newStatus: string) {
    const previous = value;
    setValue(newStatus);
    setSaving(true);
    setMessage("");
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) {
      setValue(previous);
      setMessage("Update failed");
    } else {
      const data = await response.json();
      setMessage(data.notification?.sent ? "Customer emailed" : "Status saved");
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <div className="text-right">
      <select value={value} onChange={(event) => handleChange(event.target.value)} disabled={saving} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-brand">
        {STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      {(saving || message) && <p className="mt-1 text-[10px] font-semibold text-slate-500">{saving ? "Saving..." : message}</p>}
    </div>
  );
}
