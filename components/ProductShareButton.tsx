"use client";

import { useState } from "react";

export default function ProductShareButton({ name, url }: { name: string; url: string }) {
  const [message, setMessage] = useState("Share product");

  async function shareProduct() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${name} | Nana B Enterprises`,
          text: `See ${name} at Nana B Enterprises`,
          url,
        });
        setMessage("Shared");
      } else {
        await navigator.clipboard.writeText(url);
        setMessage("Link copied");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage("Try again");
    }

    window.setTimeout(() => setMessage("Share product"), 1800);
  }

  return (
    <button
      type="button"
      onClick={shareProduct}
      className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-brand-dark transition hover:border-brand hover:text-brand"
      aria-label={`Share ${name}`}
    >
      {message}
    </button>
  );
}
