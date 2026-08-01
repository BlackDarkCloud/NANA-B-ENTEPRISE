import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    select: { name: true },
  });
  if (!category) return {};

  return {
    title: `${category.name} in Ghana`,
    description: `Shop ${category.name.toLowerCase()} from Nana B Enterprises in Makola, Accra, with wholesale, retail and delivery across Ghana.`,
    alternates: { canonical: `/category/${params.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: { products: { where: { active: true } } },
  });

  if (!category) notFound();

  return (
    <div className="site-shell py-10 sm:py-14">
      <span className="eyebrow">Shop Nana B Enterprises</span>
      <h1 className="section-title mt-2">{category.name} in Ghana</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">Browse quality {category.name.toLowerCase()} for homes and businesses, available wholesale and retail with delivery across Ghana.</p>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
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
