"use client";

import { useState } from "react";
import ImageLightbox from "./ImageLightbox";

export default function ProductImageZoom({ images, alt }: { images: string[]; alt: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={`View larger photos of ${alt}`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        className="absolute bottom-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brand-dark opacity-100 shadow-md backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
          <path d="M11 8v6M8 11h6" />
        </svg>
      </button>
      {open && <ImageLightbox images={images} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}
