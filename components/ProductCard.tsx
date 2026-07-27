import Link from "next/link";
import Image from "next/image";
import { formatGHS } from "@/lib/money";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    compareAtPrice?: number | null;
    images: string[];
  };
};

export default function ProductCard({ product }: Props) {
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(100 - (product.price / product.compareAtPrice) * 100)
      : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="block rounded-xl overflow-hidden border hover:shadow-md transition"
    >
      <div className="relative aspect-square bg-gray-50">
        {discount && (
          <span className="absolute top-2 left-2 bg-brand text-white text-xs font-semibold px-2 py-1 rounded">
            {discount}% off
          </span>
        )}
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="p-3">
        <p className="text-sm text-ink line-clamp-2 mb-1">{product.name}</p>
        <div className="flex items-baseline gap-2">
          {product.compareAtPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatGHS(product.compareAtPrice)}
            </span>
          )}
          <span className="text-brand font-bold">{formatGHS(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
