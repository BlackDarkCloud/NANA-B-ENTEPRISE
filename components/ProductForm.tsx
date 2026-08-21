"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };
type SpecEntry = { label: string; value: string };
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
  keyFeatures: string[];
  specifications: SpecEntry[];
  boxContents: string[];
};

// Key features and box contents are just one item per line of plain text —
// far easier to type than filling in a row of small boxes one at a time.
function linesToList(text: string): string[] {
  return text.split("\n").map((line) => line.trim()).filter(Boolean);
}

// Specifications are typed as "Label: Value", one per line, e.g. "Capacity: 1.7 litres".
// Lines without a colon are ignored rather than rejected, so a stray line doesn't block saving.
function linesToSpecs(text: string): SpecEntry[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) return null;
      const label = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      return label && value ? { label, value } : null;
    })
    .filter((entry): entry is SpecEntry => entry !== null);
}

function listToLines(list: string[]): string {
  return list.join("\n");
}

function specsToLines(specs: SpecEntry[]): string {
  return specs.map((spec) => `${spec.label}: ${spec.value}`).join("\n");
}

// Product images are stored as base64 strings directly in the database (no external
// image host is configured for this project). That makes it easy to blow past hosting
// response-size limits if images are too large — every product image gets pulled into
// every page that lists products. To keep pages fast and reliable, we cap the resized
// dimensions and re-compress (lowering quality, then shrinking further) until each
// image is comfortably small, rather than trusting a single fixed quality setting.
const MAX_DIMENSION = 1000;
const MAX_IMAGE_BYTES = 220 * 1024; // ~220KB per image after base64 encoding

function canvasToDataUrl(canvas: HTMLCanvasElement, quality: number) {
  return canvas.toDataURL("image/jpeg", quality);
}

function estimateBytes(dataUrl: string) {
  // base64 encodes 3 bytes as 4 characters
  return Math.round((dataUrl.length - dataUrl.indexOf(",") - 1) * 0.75);
}

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("Please choose an image file."));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The image could not be read."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("The image is not valid."));
      image.onload = () => {
        let width = image.width;
        let height = image.height;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return reject(new Error("Could not process the image."));

        let quality = 0.82;
        let result = "";
        for (let attempt = 0; attempt < 6; attempt++) {
          const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
          canvas.width = Math.max(1, Math.round(width * scale));
          canvas.height = Math.max(1, Math.round(height * scale));
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          result = canvasToDataUrl(canvas, quality);
          if (estimateBytes(result) <= MAX_IMAGE_BYTES) break;
          // Still too big: reduce quality first, then start shrinking dimensions too.
          if (quality > 0.5) quality -= 0.12;
          else {
            width = Math.round(width * 0.85);
            height = Math.round(height * 0.85);
          }
        }
        resolve(result);
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
    keyFeatures: [], specifications: [], boxContents: [],
  });
  const [keyFeaturesText, setKeyFeaturesText] = useState(listToLines(initial?.keyFeatures || []));
  const [specificationsText, setSpecificationsText] = useState(specsToLines(initial?.specifications || []));
  const [boxContentsText, setBoxContentsText] = useState(listToLines(initial?.boxContents || []));

  useEffect(() => {
    fetch("/api/admin/categories").then((response) => response.json()).then(setCategories);
  }, []);

  function updateName(name: string) {
    const slug = editing ? form.slug : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setForm({ ...form, name, slug });
  }

  async function selectImages(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const remainingSlots = 4 - form.images.length;
    if (remainingSlots <= 0) {
      setError("You can only add up to 4 images. Remove one first.");
      event.target.value = "";
      return;
    }
    setProcessingImage(true);
    setError("");
    try {
      const images = await Promise.all(files.slice(0, remainingSlots).map(resizeImage));
      setForm((current) => ({ ...current, images: [...current.images, ...images] }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not process image.");
    }
    setProcessingImage(false);
    event.target.value = "";
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
        keyFeatures: linesToList(keyFeaturesText),
        boxContents: linesToList(boxContentsText),
        specifications: linesToSpecs(specificationsText),
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
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-bold">Description</label>
            <textarea required rows={5} className="form-input" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </div>
          <div><label className="mb-1.5 block text-sm font-bold">Selling price (GHS)</label><input required min="0" step="0.01" type="number" className="form-input" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></div>
          <div><label className="mb-1.5 block text-sm font-bold">Previous price (optional)</label><input min="0" step="0.01" type="number" className="form-input" value={form.compareAtPrice} onChange={(event) => setForm({ ...form, compareAtPrice: event.target.value })} /></div>
          <div><label className="mb-1.5 block text-sm font-bold">Stock quantity</label><input required min="0" type="number" className="form-input" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} /></div>
          <div><label className="mb-1.5 block text-sm font-bold">Category</label><select required className="form-input" value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
        </div>
        <div className="flex flex-wrap gap-5 border-t border-slate-100 pt-5">
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> Featured product</label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Visible in store</label>
        </div>

        <div className="space-y-2 border-t border-slate-100 pt-5">
          <label className="block text-sm font-bold">Key features</label>
          <p className="text-xs text-slate-500">Type one feature per line — press Enter to start a new one. e.g.</p>
          <p className="text-xs italic text-slate-400">1200W motor{"\n"}5-speed control{"\n"}Auto shut-off</p>
          <textarea
            rows={5}
            className="form-input"
            placeholder={"1200W motor\n5-speed control\nAuto shut-off"}
            value={keyFeaturesText}
            onChange={(event) => setKeyFeaturesText(event.target.value)}
          />
        </div>

        <div className="space-y-2 border-t border-slate-100 pt-5">
          <label className="block text-sm font-bold">Specifications</label>
          <p className="text-xs text-slate-500">Type one per line as "Label: Value" — e.g.</p>
          <p className="text-xs italic text-slate-400">Capacity: 1.7 litres{"\n"}Power: 1200W{"\n"}Warranty: 1 year</p>
          <textarea
            rows={5}
            className="form-input"
            placeholder={"Capacity: 1.7 litres\nPower: 1200W\nWarranty: 1 year"}
            value={specificationsText}
            onChange={(event) => setSpecificationsText(event.target.value)}
          />
        </div>

        <div className="space-y-2 border-t border-slate-100 pt-5">
          <label className="block text-sm font-bold">What's in the box</label>
          <p className="text-xs text-slate-500">Type one item per line — e.g.</p>
          <p className="text-xs italic text-slate-400">1x Blender base{"\n"}1x Glass jug with lid{"\n"}1x Recipe booklet</p>
          <textarea
            rows={4}
            className="form-input"
            placeholder={"1x Blender base\n1x Glass jug with lid\n1x Recipe booklet"}
            value={boxContentsText}
            onChange={(event) => setBoxContentsText(event.target.value)}
          />
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-black text-brand-dark">Product images ({form.images.length}/4)</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">Choose up to 4 images from this device. They are resized and compressed automatically before saving. The first image is used as the main photo.</p>
        {form.images.length < 4 && (
          <label className="mt-5 flex min-h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm font-bold text-brand hover:border-brand">
            <input type="file" accept="image/*" multiple className="hidden" onChange={selectImages} />
            {processingImage ? "Preparing images..." : "Choose product images"}
          </label>
        )}
        {form.images.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3">{form.images.map((image, index) => <div key={index} className="relative aspect-square overflow-hidden rounded-xl bg-slate-100"><img src={image} alt={`Product preview ${index + 1}`} className="h-full w-full object-cover" /><button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, itemIndex) => itemIndex !== index) })} className="absolute right-1 top-1 rounded-full bg-white px-2 py-1 text-xs font-black text-red-600 shadow">×</button></div>)}</div>}
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={saving || processingImage} className="mt-5 w-full rounded-xl bg-brand px-5 py-3.5 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving..." : editing ? "Save product changes" : "Create product"}</button>
      </aside>
    </form>
  );
}
