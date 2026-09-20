"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type Product = {
  productId: string;
  name: string;
  price: number;
  image: string;
  stock: number;
};

export default function QuickAddButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function addToBag() {
    addItem({ ...product, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={addToBag}
      disabled={product.stock === 0}
      className={`w-full rounded-xl px-2 py-3 text-xs font-bold text-white transition-all duration-300 disabled:bg-slate-300 sm:text-sm ${added ? "bg-emerald-600 scale-[.98]" : "bg-brand-red hover:bg-red-700 hover:shadow-md active:scale-95"}`}
    >
      <span className="inline-flex items-center justify-center gap-1.5">
        {added && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-scale-in">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
        {product.stock === 0 ? "Out of stock" : added ? "Added to bag" : "Add to Cart"}
      </span>
    </button>
  );
}
