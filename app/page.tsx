import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featured, latest, heroProductRows] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany({ where: { active: true, featured: true }, include: { category: true }, take: 8 }),
    prisma.product.findMany({ where: { active: true }, include: { category: true }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.product.findMany({
      where: { active: true, stock: { gt: 0 } },
      select: { id: true, slug: true, name: true, price: true, images: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
  ]);

  // Only the first image of each product is ever shown in the hero banner, but this
  // is a Client Component boundary — Next.js has to serialize whatever prop it's given
  // and send it down as part of the page payload. Passing the full `images` array here
  // (up to 4 full-size base64 images per product, rendered twice for mobile + desktop)
  // could bloat that payload past hosting response-size limits and crash the page with
  // a generic "server-side exception". Trimming to a single image per product keeps the
  // payload small and avoids that failure mode.
  const heroProducts = heroProductRows.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    images: product.images[0] ? [product.images[0]] : [],
  }));

  return (
    <div className="bg-white">
      <section className="px-5 pb-7 pt-3 md:hidden">
        <HeroCarousel products={heroProducts} mobile />
      </section>

      <section className="relative hidden overflow-hidden bg-[#F4F0EB] md:block">
        <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 animate-float-slow rounded-full bg-brand/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 animate-float-slower rounded-full bg-brand-red/10 blur-3xl" />
        <div className="site-shell relative grid min-h-[570px] items-center lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative z-10 py-16 animate-fade-in-up">
            <span className="eyebrow">Home of quality appliances</span>
            <h1 className="mt-5 max-w-xl text-5xl font-black leading-[1.06] tracking-[-.04em] text-brand-dark lg:text-6xl">Make everyday living feel <span className="text-brand-red">effortless.</span></h1>
            <p className="mt-5 max-w-lg text-lg leading-7 text-slate-600">Shop dependable home, kitchen and lifestyle appliances at honest prices—wholesale or retail, with delivery across Ghana.</p>
            <div className="mt-8 flex gap-3"><a href="#best-sellers" className="btn-primary">Shop appliances</a><a href="https://wa.me/233244018530" className="btn-secondary">Order on WhatsApp</a></div>
            <div className="mt-9 flex gap-6 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">✓</span>Secure checkout</span>
              <span className="flex items-center gap-1.5"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">✓</span>Nationwide delivery</span>
              <span className="flex items-center gap-1.5"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">✓</span>Friendly support</span>
            </div>
          </div>
          <div className="relative h-[570px] self-end animate-scale-in">
            <HeroCarousel products={heroProducts} />
            <div className="absolute bottom-6 right-8 rounded-2xl bg-white/95 p-4 shadow-xl transition-transform duration-300 hover:-translate-y-1"><p className="text-xs font-bold uppercase tracking-widest text-brand-red">Visit us in Makola</p><p className="mt-1 text-sm font-bold text-brand-dark">Angelina House • 1st Floor • Shop 31</p></div>
          </div>
        </div>
      </section>

      <section id="best-sellers" className="site-shell py-5 md:py-14">
        <div className="mx-auto mb-8 grid max-w-sm grid-cols-2 rounded-xl bg-slate-50 p-1 md:mx-0 md:max-w-md">
          <a href="#best-sellers" className="rounded-lg bg-brand-red px-4 py-3 text-center text-sm font-bold text-white shadow-sm transition-transform active:scale-95">Best Sellers</a>
          <a href="#new-arrivals" className="rounded-lg px-4 py-3 text-center text-sm font-bold text-slate-700 transition-colors hover:text-brand-red active:scale-95">New Arrivals</a>
        </div>
        <Reveal className="mb-7 hidden md:block"><span className="eyebrow">Customer favourites</span><h2 className="section-title mt-2">Best-selling appliances</h2></Reveal>
        {featured.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
              {featured.map((product, index) => (
                <Reveal key={product.id} delay={index * 60}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
            <Link href="/search" className="mt-9 block w-full rounded-xl border border-brand-dark py-3.5 text-center text-sm font-bold text-brand-dark transition-all duration-300 hover:bg-brand-dark hover:text-white md:mx-auto md:max-w-sm">Shop All Best Sellers &gt;</Link>
          </>
        ) : (
          <p className="py-10 text-center text-sm text-slate-500">Products are being prepared.</p>
        )}
      </section>

      <section className="site-shell py-10 md:py-14">
        <Reveal className="mb-7"><span className="eyebrow">Browse the store</span><h2 className="section-title mt-2">Shop by category</h2></Reveal>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 70}>
              <Link href={`/category/${category.slug}`} className="category-card">
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-sm font-black text-brand transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">{String(index + 1).padStart(2, "0")}</span>
                <strong className="block text-sm text-brand-dark transition-colors group-hover:text-brand sm:text-base">{category.name}</strong>
                <small className="mt-1 flex items-center gap-1 text-slate-500">Browse collection <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span></small>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="offers" className="relative overflow-hidden bg-brand-dark py-12 text-white md:py-14">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 animate-float-slow rounded-full bg-white/5 blur-3xl" />
        <Reveal className="site-shell relative grid items-center gap-8 lg:grid-cols-[1fr_.8fr]">
          <div><span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[.18em]">Nana B weekly offers</span><h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">Great value for homes, hostels and growing businesses.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-white/70">Ask about wholesale rates, bundle pricing and delivery options.</p><a href="https://wa.me/233244018530" className="mt-7 inline-flex rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95">Chat with Nana B</a></div>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white p-2 shadow-2xl transition-transform duration-500 hover:scale-[1.02]"><img src="/assets/nana-b-flyer.jpg" alt="Nana B Enterprises product flyer" className="aspect-[4/3] w-full rounded-2xl object-cover object-top" /></div>
        </Reveal>
      </section>

      <section id="new-arrivals" className="site-shell py-12 md:py-14">
        <Reveal className="mb-7"><span className="eyebrow">Fresh picks</span><h2 className="section-title mt-2">New arrivals</h2></Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {latest.map((product, index) => (
            <Reveal key={product.id} delay={index * 60}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
