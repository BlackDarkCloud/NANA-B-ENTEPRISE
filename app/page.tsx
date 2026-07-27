import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featured, latest] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany({
      where: { active: true, featured: true },
      take: 6,
    }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="px-4 py-4 space-y-8">
      <section className="bg-brand/10 rounded-2xl p-6 text-center">
        <h1 className="text-2xl font-bold text-brand">Nana B Enterprise</h1>
        <p className="text-sm text-ink/70 mt-1">
          Quality home, kitchen & lifestyle products — delivered across Ghana.
        </p>
      </section>

      <section>
        <h2 className="font-semibold mb-3">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="border rounded-xl p-4 text-center text-sm font-medium hover:bg-gray-50"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">Hot Deals</h2>
          <div className="grid grid-cols-2 gap-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-semibold mb-3">New Arrivals</h2>
        <div className="grid grid-cols-2 gap-3">
          {latest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
