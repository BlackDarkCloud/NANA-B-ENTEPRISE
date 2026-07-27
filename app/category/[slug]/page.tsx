import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: { products: { where: { active: true } } },
  });

  if (!category) notFound();

  return (
    <div className="px-4 py-4">
      <h1 className="font-semibold text-lg mb-4">{category.name}</h1>
      <div className="grid grid-cols-2 gap-3">
        {category.products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {category.products.length === 0 && (
        <p className="text-sm text-gray-500">No products in this category yet.</p>
      )}
    </div>
  );
}
