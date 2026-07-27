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
    <button type="button" onClick={addToBag} disabled={product.stock === 0} className="w-full rounded-xl bg-brand-red px-2 py-3 text-xs font-bold text-white transition hover:bg-red-700 disabled:bg-slate-300 sm:text-sm">
      {product.stock === 0 ? "Out of stock" : added ? "Added to bag" : "Add to Cart"}
    </button>
  );
}
