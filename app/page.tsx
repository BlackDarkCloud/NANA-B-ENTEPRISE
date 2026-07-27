import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featured, latest] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany({ where: { active: true, featured: true }, take: 8 }),
    prisma.product.findMany({ where: { active: true }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-[#F4F0EB]">
        <div className="site-shell grid min-h-[570px] items-center lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative z-10 py-14 lg:py-20">
            <span className="eyebrow">Home of quality appliances</span>
            <h1 className="mt-5 max-w-xl text-4xl font-black leading-[1.06] tracking-[-.04em] text-brand-dark sm:text-5xl lg:text-6xl">
              Make everyday living feel <span className="text-brand-red">effortless.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              Shop dependable home, kitchen and lifestyle appliances at honest prices—wholesale or retail, with delivery across Ghana.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#products" className="btn-primary">Shop appliances</a>
              <a href="https://wa.me/233505580710" className="btn-secondary">Order on WhatsApp</a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-slate-600">
              <span>✓ Secure Paystack checkout</span><span>✓ Nationwide delivery</span><span>✓ Friendly support</span>
            </div>
          </div>
          <div className="relative h-[320px] self-end sm:h-[420px] lg:h-[570px]">
            <img src="/assets/appliance-showroom.png" alt="A curated range of Nana B home appliances" className="absolute inset-0 h-full w-full object-cover object-[70%_center] lg:object-[62%_center]" />
            <div className="absolute bottom-6 right-4 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur sm:right-8">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-red">Visit us in Makola</p>
              <p className="mt-1 text-sm font-bold text-brand-dark">Angelina House • 1st Floor • Shop 31</p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-shell py-12">
        <div className="mb-7 flex items-end justify-between">
          <div><span className="eyebrow">Find what you need</span><h2 className="section-title mt-2">Shop by category</h2></div>
          <span className="hidden text-sm text-slate-500 sm:block">Wholesale pricing available in store</span>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="category-card group">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-lg font-black text-brand">{String(index + 1).padStart(2, "0")}</span>
              <strong className="block text-base text-brand-dark">{category.name}</strong>
              <small className="mt-1 block text-slate-500">Browse collection →</small>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section id="products" className="site-shell pb-14">
          <div className="mb-7"><span className="eyebrow">Customer favourites</span><h2 className="section-title mt-2">Featured appliances</h2></div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

      <section id="offers" className="bg-brand-dark py-14 text-white">
        <div className="site-shell grid items-center gap-8 lg:grid-cols-[1fr_.8fr]">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[.18em]">Nana B weekly offers</span>
            <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">Great value for homes, hostels and growing businesses.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">Ask about wholesale rates, bundle pricing and delivery options. Our team will help you choose the right appliance for your budget.</p>
            <a href="https://wa.me/233244018530" className="mt-7 inline-flex rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white hover:bg-red-700">Chat with Nana B</a>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white p-2 shadow-2xl">
            <img src="/assets/nana-b-flyer.jpg" alt="Nana B Enterprises product flyer" className="aspect-[4/3] w-full rounded-2xl object-cover object-top" />
          </div>
        </div>
      </section>

      <section className="site-shell py-14">
        <div className="mb-7"><span className="eyebrow">Fresh picks</span><h2 className="section-title mt-2">New arrivals</h2></div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {latest.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="site-shell pb-16">
        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-3 sm:p-8">
          {[
            ["Shop with confidence", "Clear pricing, live stock and secure payment through Paystack."],
            ["Delivery that fits", "Accra and nationwide options shown before you complete payment."],
            ["Real human support", "Call or WhatsApp our Makola team before or after your purchase."],
          ].map(([title, text]) => (
            <div key={title} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6 sm:last:border-r-0">
              <h3 className="font-bold text-brand-dark">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
