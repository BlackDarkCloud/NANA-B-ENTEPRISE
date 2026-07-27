import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { formatGHS } from "@/lib/money";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product || !product.active) notFound();

  return (
    <div className="px-4 py-4">
      <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
        {product.images[0] && (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
        )}
      </div>
      <h1 className="text-lg font-semibold">{product.name}</h1>
      <div className="flex items-baseline gap-2 my-2">
        {product.compareAtPrice && (
          <span className="text-sm text-gray-400 line-through">
            {formatGHS(product.compareAtPrice)}
          </span>
        )}
        <span className="text-brand font-bold text-xl">{formatGHS(product.price)}</span>
      </div>
      <p className="text-sm text-ink/70 mb-4">{product.description}</p>
      <p className="text-xs text-gray-500 mb-4">
        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
      </p>

      <AddToCartButton
        product={{
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || "",
          stock: product.stock,
        }}
      />
    </div>
  );
}
