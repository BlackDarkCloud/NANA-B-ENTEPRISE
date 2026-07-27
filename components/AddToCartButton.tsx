"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }: { product: { productId: string; name: string; price: number; image: string; stock: number } }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ ...product, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button onClick={handleAdd} disabled={product.stock === 0} className="flex-1 rounded-xl bg-brand py-3.5 font-bold text-white transition hover:bg-brand-dark disabled:opacity-50">
        {added ? "Added ✓" : "Add to bag"}
      </button>
      <button onClick={() => { addItem({ ...product, quantity: 1 }); router.push("/checkout"); }} disabled={product.stock === 0} className="flex-1 rounded-xl border border-brand py-3.5 font-bold text-brand transition hover:bg-brand-light disabled:opacity-50">
        Buy now
      </button>
    </div>
  );
}
