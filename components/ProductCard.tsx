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
    <Link href={`/products/${product.slug}`} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F1F3F7]">
        {discount && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-red px-2.5 py-1 text-[10px] font-bold text-white">{discount}% off</span>
        )}
        {product.images[0] && (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
        )}
      </div>
      <div className="p-4">
        <p className="mb-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-800">{product.name}</p>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-extrabold text-brand">{formatGHS(product.price)}</span>
          {product.compareAtPrice && <span className="text-xs text-slate-400 line-through">{formatGHS(product.compareAtPrice)}</span>}
        </div>
        <span className="mt-3 block text-xs font-semibold text-slate-500 group-hover:text-brand">View product →</span>
      </div>
    </Link>
  );
}
