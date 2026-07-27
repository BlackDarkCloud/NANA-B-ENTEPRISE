"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDeleteProduct({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    if (!window.confirm(`Remove "${name}" from the store? Existing order records will be preserved.`)) return;
    setDeleting(true);
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (response.ok) router.refresh();
    else setDeleting(false);
  }

  return <button type="button" onClick={remove} disabled={deleting} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50">{deleting ? "Removing..." : "Delete"}</button>;
}
