import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { formatGHS } from "@/lib/money";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import ProductShareButton from "@/components/ProductShareButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: { id: true, name: true, description: true, active: true },
  });

  if (!product?.active) return {};

  const shareImage = `${siteUrl}/api/products/${product.id}/image`;

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/products/${params.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | Nana B Enterprises`,
      description: product.description.slice(0, 160),
      url: `/products/${params.slug}`,
      images: [{ url: shareImage, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Nana B Enterprises`,
      description: product.description.slice(0, 160),
      images: [shareImage],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product || !product.active) notFound();
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [`${siteUrl}/api/products/${product.id}/image`],
    sku: product.id,
    brand: { "@type": "Brand", name: "Nana B Enterprises" },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: "GHS",
      price: (product.price / 100).toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <div className="site-shell py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="mb-6 text-xs text-slate-500"><Link href="/" className="hover:text-brand">Home</Link><span className="px-2">/</span>{product.name}</div>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#EFF2F6]">
          {product.images[0] && <Image src={product.images[0]} alt={product.name} fill priority unoptimized={product.images[0].startsWith("data:")} className="object-cover" />}
        </div>
        <div className="self-center">
          <span className="eyebrow">Nana B quality pick</span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-brand-dark sm:text-4xl">{product.name}</h1>
          <div className="my-5 flex items-baseline gap-3">
            <span className="text-2xl font-black text-brand">{formatGHS(product.price)}</span>
            {product.compareAtPrice && <span className="text-sm text-slate-400 line-through">{formatGHS(product.compareAtPrice)}</span>}
          </div>
          <p className="mb-6 max-w-xl text-sm leading-7 text-slate-600">{product.description}</p>
          <div className="mb-6 flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${product.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
            <span className="font-semibold text-slate-700">{product.stock > 0 ? `In stock — ${product.stock} available` : "Out of stock"}</span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <AddToCartButton product={{ productId: product.id, name: product.name, price: product.price, image: product.images[0] || "", stock: product.stock }} />
            </div>
            <ProductShareButton name={product.name} url={`${siteUrl}/products/${product.slug}`} />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200"><strong className="block text-brand-dark">Secure checkout</strong>Protected by Paystack</div>
            <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200"><strong className="block text-brand-dark">Need help?</strong>Call 0244 018 530</div>
          </div>
        </div>
      </div>
    </div>
  );
}
