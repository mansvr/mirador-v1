"use client";

import { useCallback, useEffect, useState } from "react";

export interface GalleryImage {
  src: string;
  caption?: string;
  alt?: string;
}

interface SceneGalleryProps {
  images: GalleryImage[];
  heading?: string;
}

/**
 * Property photo gallery for the `/v` page — responsive grid + click-to-open
 * lightbox (keyboard: ←/→ to navigate, Esc to close). URLs are pre-resolved by
 * the server (resolvePublicAssetUrl) so this stays a thin client component.
 */
export function SceneGallery({ images, heading = "Galería" }: SceneGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const show = useCallback(
    (delta: number) =>
      setOpenIndex((cur) => {
        if (cur === null) return cur;
        const next = (cur + delta + images.length) % images.length;
        return next;
      }),
    [images.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(1);
      else if (e.key === "ArrowLeft") show(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, show]);

  if (!images.length) return null;

  const active = openIndex === null ? null : images[openIndex];

  return (
    <section
      aria-label={heading}
      className="rounded-xl border border-mirador-border bg-mirador-surface p-5 shadow-sm sm:p-6"
    >
      <h2 className="mb-4 text-lg font-medium tracking-tight text-mirador-text sm:text-xl">
        {heading}
      </h2>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-mirador-border bg-mirador-border/20"
            aria-label={img.caption ? `Ampliar: ${img.caption}` : `Ampliar foto ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt ?? img.caption ?? `Foto ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption ?? "Foto ampliada"}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
            aria-label="Cerrar"
          >
            ✕
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  show(-1);
                }}
                className="absolute left-4 rounded-full bg-white/10 px-3 py-2 text-lg text-white hover:bg-white/20"
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  show(1);
                }}
                className="absolute right-4 bottom-1/2 rounded-full bg-white/10 px-3 py-2 text-lg text-white hover:bg-white/20"
                aria-label="Siguiente"
              >
                ›
              </button>
            </>
          )}
          <figure className="max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.src}
              alt={active.alt ?? active.caption ?? "Foto ampliada"}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            {active.caption && (
              <figcaption className="mt-2 text-center text-sm text-white/80">
                {active.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </section>
  );
}
