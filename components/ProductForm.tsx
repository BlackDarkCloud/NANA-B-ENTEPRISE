"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };
type InitialProduct = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  categoryId: string;
  featured: boolean;
  active: boolean;
  images: string[];
};

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("Please choose an image file."));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The image could not be read."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("The image is not valid."));
      image.onload = () => {
        const max = 1200;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export default function ProductForm({ initial }: { initial?: InitialProduct }) {
  const router = useRouter();
  const editing = Boolean(initial?.id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const [form, setForm] = useState<InitialProduct>(initial || {
    name: "", slug: "", description: "", price: "", compareAtPrice: "", stock: "0",
    categoryId: "", featured: false, active: true, images: [],
  });

  useEffect(() => {
    fetch("/api/admin/categories").then((response) => response.json()).then(setCategories);
  }, []);

  function updateName(name: string) {
    const slug = editing ? form.slug : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setForm({ ...form, name, slug });
  }

  async function selectImages(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(0, 4);
    if (!files.length) return;
    setProcessingImage(true);
    setError("");
    try {
      const images = await Promise.all(files.map(resizeImage));
      setForm((current) => ({ ...current, images }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not process image.");
    }
    setProcessingImage(false);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.images.length) return setError("Please add at least one product image.");
    setSaving(true);
    setError("");
    const response = await fetch(editing ? `/api/admin/products/${initial?.id}` : "/api/admin/products", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Math.round(Number(form.price) * 100),
        compareAtPrice: form.compareAtPrice ? Math.round(Number(form.compareAtPrice) * 100) : null,
        stock: Number(form.stock),
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Could not save product.");
      setSaving(false);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-7 grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-bold">Product name</label><input required className="form-input" value={form.name} onChange={(event) => updateName(event.target.value)} /></div>
          <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-bold">URL name</label><input required className="form-input" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></div>
          <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-bold">Description</label><textarea required rows={5} className="form-input" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
          <div><label className="mb-1.5 block text-sm font-bold">Selling price (GHS)</label><input required min="0" step="0.01" type="number" className="form-input" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></div>
          <div><label className="mb-1.5 block text-sm font-bold">Previous price (optional)</label><input min="0" step="0.01" type="number" className="form-input" value={form.compareAtPrice} onChange={(event) => setForm({ ...form, compareAtPrice: event.target.value })} /></div>
          <div><label className="mb-1.5 block text-sm font-bold">Stock quantity</label><input required min="0" type="number" className="form-input" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} /></div>
          <div><label className="mb-1.5 block text-sm font-bold">Category</label><select required className="form-input" value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
        </div>
        <div className="flex flex-wrap gap-5 border-t border-slate-100 pt-5">
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> Featured product</label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Visible in store</label>
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-black text-brand-dark">Product images</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">Choose images directly from this device. They are resized automatically before saving.</p>
        <label className="mt-5 flex min-h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm font-bold text-brand hover:border-brand">
          <input type="file" accept="image/*" multiple className="hidden" onChange={selectImages} />
          {processingImage ? "Preparing images..." : "Choose product images"}
        </label>
        {form.images.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3">{form.images.map((image, index) => <div key={index} className="relative aspect-square overflow-hidden rounded-xl bg-slate-100"><img src={image} alt={`Product preview ${index + 1}`} className="h-full w-full object-cover" /><button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, itemIndex) => itemIndex !== index) })} className="absolute right-1 top-1 rounded-full bg-white px-2 py-1 text-xs font-black text-red-600 shadow">×</button></div>)}</div>}
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={saving || processingImage} className="mt-5 w-full rounded-xl bg-brand px-5 py-3.5 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving..." : editing ? "Save product changes" : "Create product"}</button>
      </aside>
    </form>
  );
}
