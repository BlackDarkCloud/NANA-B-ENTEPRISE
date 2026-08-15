import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const session = await auth();
  const items = await prisma.wishlistItem.findMany({
    where: { userId: (session?.user as any).id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <span className="eyebrow">Saved for later</span><h1 className="mt-2 text-3xl font-black text-brand-dark">My wishlist</h1>
      {items.length ? (
        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-3">{items.map(({ product }) => <ProductCard key={product.id} product={product} />)}</div>
      ) : (
        <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="font-black text-brand-dark">Your wishlist is empty</h2><p className="mt-2 text-sm text-slate-500">Tap the heart on any product to save it here.</p><Link href="/" className="btn-primary mt-6">Browse products</Link></div>
      )}
    </div>
  );
}
