"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", slug: "", description: "", price: "", compareAtPrice: "",
    images: "", stock: "0", categoryId: "", featured: false,
  });

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then(setCategories);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Math.round(parseFloat(form.price) * 100),
        compareAtPrice: form.compareAtPrice ? Math.round(parseFloat(form.compareAtPrice) * 100) : null,
        stock: parseInt(form.stock, 10),
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create product");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required placeholder="Product name" className="w-full border rounded-lg p-3"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required placeholder="URL slug (e.g. rattan-swing-chair)" className="w-full border rounded-lg p-3"
          value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <textarea required placeholder="Description" className="w-full border rounded-lg p-3"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="flex gap-3">
          <input required type="number" step="0.01" placeholder="Price (GHS)" className="w-full border rounded-lg p-3"
            value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input type="number" step="0.01" placeholder="Compare-at price (optional)" className="w-full border rounded-lg p-3"
            value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} />
        </div>
        <input required type="number" placeholder="Stock quantity" className="w-full border rounded-lg p-3"
          value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <input placeholder="Image URLs, comma separated" className="w-full border rounded-lg p-3"
          value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
        <select required className="w-full border rounded-lg p-3"
          value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Feature on homepage
        </label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="bg-brand text-white rounded-lg px-6 py-3 font-semibold">Create Product</button>
      </form>
    </div>
  );
}
