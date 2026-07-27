import Link from "next/link";
import Image from "next/image";
import { formatGHS } from "@/lib/money";
import QuickAddButton from "./QuickAddButton";
import WishlistButton from "./WishlistButton";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    compareAtPrice?: number | null;
    images: string[];
    stock: number;
    category?: { name: string } | null;
  };
};

export default function ProductCard({ product }: Props) {
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(100 - (product.price / product.compareAtPrice) * 100)
    : null;

  return (
    <article className="group min-w-0 bg-white">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F4F5F7]">
          {discount && <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-brand-red px-2 py-1.5 text-[10px] font-bold text-white sm:left-3 sm:top-3">{discount}% off</span>}
          <WishlistButton productId={product.id} />
          {product.images[0] && <Image src={product.images[0]} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105" />}
        </div>
        <div className="py-3">
          {product.category?.name && <p className="truncate text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:text-[10px]">{product.category.name}</p>}
          <h3 className="mt-1 line-clamp-2 min-h-10 text-xs font-semibold leading-5 text-slate-800 sm:text-sm">{product.name}</h3>
          {product.compareAtPrice && <p className="mt-2 text-[11px] text-slate-400 line-through">{formatGHS(product.compareAtPrice)}</p>}
          <p className="text-base font-black text-brand-red sm:text-lg">{formatGHS(product.price)}</p>
        </div>
      </Link>
      <QuickAddButton product={{ productId: product.id, name: product.name, price: product.price, image: product.images[0] || "", stock: product.stock }} />
    </article>
  );
}
