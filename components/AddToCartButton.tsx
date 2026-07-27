"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({
  product,
}: {
  product: { productId: string; name: string; price: number; image: string; stock: number };
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ ...product, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAdd}
        disabled={product.stock === 0}
        className="flex-1 bg-brand text-white rounded-lg py-3 font-semibold disabled:opacity-50"
      >
        {added ? "Added ✓" : "Add to Cart"}
      </button>
      <button
        onClick={() => {
          addItem({ ...product, quantity: 1 });
          router.push("/checkout");
        }}
        disabled={product.stock === 0}
        className="flex-1 border border-brand text-brand rounded-lg py-3 font-semibold disabled:opacity-50"
      >
        Buy Now
      </button>
    </div>
  );
}
