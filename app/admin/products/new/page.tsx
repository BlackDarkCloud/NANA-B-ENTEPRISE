import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <span className="eyebrow">Catalogue management</span>
      <h1 className="mt-2 text-3xl font-black text-brand-dark">Add a new product</h1>
      <p className="mt-2 text-sm text-slate-500">Add details, price, stock and images directly from your device.</p>
      <ProductForm />
    </div>
  );
}
