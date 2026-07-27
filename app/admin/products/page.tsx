import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/money";
import AdminDeleteProduct from "@/components/AdminDeleteProduct";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><span className="eyebrow">Catalogue management</span><h1 className="mt-2 text-3xl font-black text-brand-dark">Products</h1><p className="mt-2 text-sm text-slate-500">Add images directly, update stock and prices, or remove products from the store.</p></div>
        <Link href="/admin/products/new" className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark">Add new product</Link>
      </div>

      <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[72px_1.5fr_1fr_110px_90px_170px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 md:grid">
          <span>Image</span><span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Actions</span>
        </div>
        <div className="divide-y divide-slate-100">
          {products.map((product) => (
            <div key={product.id} className={`grid gap-4 p-5 md:grid-cols-[72px_1.5fr_1fr_110px_90px_170px] md:items-center ${!product.active ? "bg-slate-50 opacity-60" : ""}`}>
              <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">{product.images[0] ? <img src={product.images[0]} alt="" className="h-full w-full object-cover" /> : null}</div>
              <div><p className="font-bold text-brand-dark">{product.name}</p><p className="mt-1 text-xs text-slate-500">{product.active ? "Visible in store" : "Removed from store"}</p></div>
              <p className="text-sm text-slate-600">{product.category.name}</p>
              <p className="font-black text-brand-dark">{formatGHS(product.price)}</p>
              <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${product.stock > 5 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{product.stock}</span>
              <div className="flex gap-2"><Link href={`/admin/products/${product.id}/edit`} className="rounded-lg bg-brand-light px-3 py-2 text-xs font-bold text-brand">Edit</Link>{product.active && <AdminDeleteProduct id={product.id} name={product.name} />}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
