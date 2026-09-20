"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ImageLightbox({
  images,
  alt,
  initialIndex = 0,
  onClose,
}: {
  images: string[];
  alt: string;
  initialIndex?: number;
  onClose: () => void;
}) {
  const gallery = images.filter(Boolean);
  const [index, setIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function go(direction: 1 | -1) {
    setZoomed(false);
    setIndex((current) => (current + direction + gallery.length) % gallery.length);
  }

  function onTouchStart(event: React.TouchEvent) {
    if (zoomed) return;
    touchStartX.current = event.touches[0].clientX;
    touchDeltaX.current = 0;
  }
  function onTouchMove(event: React.TouchEvent) {
    if (zoomed || touchStartX.current === null) return;
    touchDeltaX.current = event.touches[0].clientX - touchStartX.current;
  }
  function onTouchEnd() {
    const threshold = 50;
    if (touchDeltaX.current > threshold) go(-1);
    else if (touchDeltaX.current < -threshold) go(1);
    touchStartX.current = null;
  }

  if (gallery.length === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — full-screen photo viewer`}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 animate-scale-in"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="flex items-center justify-between p-4 text-white sm:p-5">
        <span className="text-xs font-bold tracking-wide text-white/70">{gallery.length > 1 ? `${index + 1} / ${gallery.length}` : ""}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomed((current) => !current)}
            className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold backdrop-blur transition hover:bg-white/20"
          >
            {zoomed ? "Zoom out" : "Zoom in"}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo viewer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg backdrop-blur transition hover:bg-white/20 hover:rotate-90"
          >
            ×
          </button>
        </div>
      </div>

      <div
        className="relative flex-1 touch-pan-y select-none overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onDoubleClick={() => setZoomed((current) => !current)}
      >
        <div
          className={`relative h-full w-full transition-transform duration-300 ease-out ${zoomed ? "cursor-zoom-out scale-[1.9]" : "cursor-zoom-in"}`}
        >
          <Image
            src={gallery[index]}
            alt={`${alt} — photo ${index + 1} of ${gallery.length}`}
            fill
            unoptimized={gallery[index].startsWith("data:")}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {gallery.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl text-white backdrop-blur transition hover:bg-white/20 sm:flex"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl text-white backdrop-blur transition hover:bg-white/20 sm:flex"
          >
            ›
          </button>
          <div className="flex justify-center gap-1.5 pb-6 pt-2">
            {gallery.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                aria-label={`Show photo ${dotIndex + 1}`}
                onClick={() => { setZoomed(false); setIndex(dotIndex); }}
                className={`h-1.5 rounded-full transition-all ${dotIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
