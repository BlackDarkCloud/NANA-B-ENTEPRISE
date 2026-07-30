"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatGHS } from "@/lib/money";

type HeroProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
};

export default function HeroCarousel({
  products,
  mobile = false,
}: {
  products: HeroProduct[];
  mobile?: boolean;
}) {
  const slides = useMemo(() => {
    const productSlides = products
      .filter((product) => product.images[0])
      .slice(0, 5)
      .map((product) => ({
        id: product.id,
        href: `/products/${product.slug}`,
        image: product.images[0],
        name: product.name,
        price: formatGHS(product.price),
        product: true,
      }));

    return productSlides.length > 0
      ? productSlides
      : [
          {
            id: "default-appliances",
            href: "#best-sellers",
            image: "/assets/home-appliances-banner.jpg",
            name: "Quality appliances for every home",
            price: "Wholesale and retail · Delivery across Ghana",
            product: false,
          },
        ];
  }, [products]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      4500,
    );
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  useEffect(() => {
    if (active >= slides.length) setActive(0);
  }, [active, slides.length]);

  return (
    <div
      className={`relative overflow-hidden bg-white ${mobile ? "aspect-[4/5] rounded-2xl shadow-sm" : "h-full"}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
    >
      {slides.map((slide, index) => (
        <Link
          key={slide.id}
          href={slide.href}
          aria-label={slide.product ? `View ${slide.name}` : "Shop Nana B home appliances"}
          className={`absolute inset-0 transition duration-700 ease-out ${
            index === active ? "z-10 opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.name}
            className={`h-full w-full ${slide.product ? "object-cover" : "object-contain"}`}
          />
          {slide.product && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-brand-dark/10" />
              <div className="absolute bottom-12 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur md:bottom-16 md:left-8 md:right-8 md:p-5">
                <p className="line-clamp-2 text-base font-black text-brand-dark md:text-xl">{slide.name}</p>
                <p className="mt-1 text-sm font-black text-brand-red md:text-base">{slide.price}</p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[.16em] text-brand">Tap to view product</p>
              </div>
            </>
          )}
        </Link>
      ))}

      {mobile && !slides[active]?.product && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-brand-dark/90 to-transparent p-6 pb-20 text-white">
          <p className="text-[10px] font-black uppercase tracking-[.22em] text-white/70">Nana B Enterprises</p>
          <h1 className="mt-3 max-w-[270px] text-3xl font-black leading-[1.05] tracking-tight">Quality appliances for every home.</h1>
        </div>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2 rounded-full bg-brand-dark/45 px-3 py-2 backdrop-blur">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show banner ${index + 1}`}
              onClick={() => setActive(index)}
              className={`h-2 rounded-full transition-all ${index === active ? "w-6 bg-white" : "w-2 bg-white/55"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
