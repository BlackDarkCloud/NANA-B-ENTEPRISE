import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { formatGHS } from "@/lib/money";
import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import ProductShareButton from "@/components/ProductShareButton";
import ProductGallery from "@/components/ProductGallery";

type SpecEntry = { label: string; value: string };

function parseSpecifications(value: unknown): SpecEntry[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry): entry is SpecEntry =>
      Boolean(entry) && typeof entry === "object" && typeof (entry as any).label === "string" && typeof (entry as any).value === "string",
  );
}

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
  const specifications = parseSpecifications(product.specifications);
  const hasDetails = product.keyFeatures.length > 0 || specifications.length > 0 || product.boxContents.length > 0;
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
        <div>
          <ProductGallery images={product.images} name={product.name} />
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

      {hasDetails && (
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {product.keyFeatures.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-brand-dark">Key features</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {product.keyFeatures.map((feature, index) => (
                  <li key={index} className="flex gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {specifications.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-brand-dark">Specifications</h2>
              <dl className="mt-4 divide-y divide-slate-100 text-sm">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-slate-500">{spec.label}</dt>
                    <dd className="text-right font-semibold text-slate-800">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {product.boxContents.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-brand-dark">What's in the box</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {product.boxContents.map((item, index) => (
                  <li key={index} className="flex gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
