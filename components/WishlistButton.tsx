"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WishlistButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setLoading(true);
    const response = await fetch("/api/account/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (response.status === 401) {
      router.push("/login");
      return;
    }
    if (response.ok) {
      const data = await response.json();
      setSaved(data.saved);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button type="button" onClick={toggle} disabled={loading} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} className={`absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-lg shadow-sm ${saved ? "text-brand-red" : "text-slate-600"}`}>
      {saved ? "♥" : "♡"}
    </button>
  );
}
