"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const gallery = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  if (gallery.length === 0) {
    return <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#EFF2F6] sm:aspect-[4/3]" />;
  }

  function go(index: number) {
    setActive((index + gallery.length) % gallery.length);
  }

  function onTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
    touchDeltaX.current = 0;
  }

  function onTouchMove(event: React.TouchEvent) {
    if (touchStartX.current === null) return;
    touchDeltaX.current = event.touches[0].clientX - touchStartX.current;
  }

  function onTouchEnd() {
    const threshold = 40;
    if (touchDeltaX.current > threshold) go(active - 1);
    else if (touchDeltaX.current < -threshold) go(active + 1);
    touchStartX.current = null;
    touchDeltaX.current = 0;
  }

  return (
    <div>
      <div
        className="group relative aspect-square touch-pan-y select-none overflow-hidden rounded-3xl bg-[#EFF2F6] sm:aspect-[4/3]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {gallery.map((image, index) => (
            <div key={index} className="relative h-full w-full shrink-0">
              <Image
                src={image}
                alt={`${name} — photo ${index + 1} of ${gallery.length}`}
                fill
                priority={index === 0}
                unoptimized={image.startsWith("data:")}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(active - 1)}
              className="absolute left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-dark opacity-0 shadow-md backdrop-blur transition group-hover:opacity-100 sm:flex"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(active + 1)}
              className="absolute right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-dark opacity-0 shadow-md backdrop-blur transition group-hover:opacity-100 sm:flex"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/25 px-2.5 py-1.5 backdrop-blur">
              {gallery.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Show photo ${index + 1}`}
                  onClick={() => go(index)}
                  className={`h-1.5 rounded-full transition-all ${index === active ? "w-5 bg-white" : "w-1.5 bg-white/60"}`}
                />
              ))}
            </div>
            <span className="absolute right-3 top-3 z-10 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur sm:hidden">
              {active + 1}/{gallery.length}
            </span>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 hidden gap-3 sm:flex">
          {gallery.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => go(index)}
              aria-label={`Show photo ${index + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#EFF2F6] ring-2 transition ${index === active ? "ring-brand" : "ring-transparent hover:ring-slate-200"}`}
            >
              <Image src={image} alt="" fill unoptimized={image.startsWith("data:")} className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
