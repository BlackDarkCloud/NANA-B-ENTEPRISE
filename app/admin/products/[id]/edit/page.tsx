import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();

  return (
    <div>
      <span className="eyebrow">Catalogue management</span>
      <h1 className="mt-2 text-3xl font-black text-brand-dark">Edit product</h1>
      <p className="mt-2 text-sm text-slate-500">Update product details, prices, stock, visibility or images.</p>
      <ProductForm initial={{
        id: product.id, name: product.name, slug: product.slug, description: product.description,
        price: (product.price / 100).toString(), compareAtPrice: product.compareAtPrice ? (product.compareAtPrice / 100).toString() : "",
        stock: product.stock.toString(), categoryId: product.categoryId, featured: product.featured, active: product.active, images: product.images,
      }} />
    </div>
  );
}
