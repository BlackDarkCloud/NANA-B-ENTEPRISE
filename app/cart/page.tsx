"use client";

import { useCart } from "@/context/CartContext";
import { formatGHS } from "@/lib/money";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-lg font-medium mb-2">Your cart is empty</p>
        <Link href="/" className="text-brand underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <h1 className="font-semibold text-lg mb-4">Your Cart</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3 border rounded-lg p-3">
            <div className="relative w-20 h-20 bg-gray-50 rounded overflow-hidden shrink-0">
              {item.image && (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium line-clamp-2">{item.name}</p>
              <p className="text-brand font-semibold">{formatGHS(item.price)}</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-7 h-7 border rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-7 h-7 border rounded"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="ml-auto text-xs text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4 flex justify-between font-semibold">
        <span>Subtotal</span>
        <span>{formatGHS(subtotal)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-4 block text-center bg-brand text-white rounded-lg py-3 font-semibold"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
