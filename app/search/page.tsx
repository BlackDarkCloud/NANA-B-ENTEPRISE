import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim() || "";

  const products = q
    ? await prisma.product.findMany({
        where: {
          active: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
      })
    : [];

  return (
    <div className="px-4 py-4">
      <h1 className="font-semibold text-lg mb-4">
        {q ? `Results for "${q}"` : "Search for products"}
      </h1>
      <div className="grid grid-cols-2 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {q && products.length === 0 && (
        <p className="text-sm text-gray-500">No products found.</p>
      )}
    </div>
  );
}
