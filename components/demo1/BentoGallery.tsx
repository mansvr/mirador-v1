"use client";

import Image from "next/image";
import { useState } from "react";
import { SacredIcon } from "@/components/demo1/SacredIcon";
import type { PropertyGalleryItem } from "@/lib/demo1/types";

interface BentoGalleryProps {
  items: PropertyGalleryItem[];
}

function aspectClass(aspect: PropertyGalleryItem["aspect"]): string {
  switch (aspect) {
    case "4/3":
      return "aspect-[4/3]";
    case "3/4":
      return "aspect-[3/4]";
    case "4/5":
      return "aspect-[4/5]";
    case "9/16":
      return "aspect-[9/16]";
    case "1/1":
      return "aspect-square";
    default:
      return "aspect-video";
  }
}

function GalleryCard({ item }: { item: PropertyGalleryItem }) {
  const [failed, setFailed] = useState(false);
  const alt =
    item.title ||
    item.imageUrl
      .replace(/^\/gallery\//, "")
      .replace(/\.webp$/, "")
      .replace(/-/g, " ");

  return (
    <figure
      className={`group relative overflow-hidden rounded-2xl border border-text-muted/20 bg-surface-alt ${aspectClass(item.aspect)}`}
    >
      {!failed ? (
        <Image
          src={item.imageUrl}
          alt={alt}
          fill
          className="object-cover transition-sacred group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-surface-alt to-chip p-4">
          <SacredIcon name="solar:camera-minimalistic-linear" size={24} />
          <span className="text-center text-sm text-text-muted">
            {item.title} — añade {item.imageUrl}
          </span>
        </div>
      )}
      {item.title ? (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 text-sm font-medium text-white">
          {item.title}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function BentoGallery({ items }: BentoGalleryProps) {
  return (
    <section id="galeria" className="bg-bg px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3">
          <SacredIcon name="solar:gallery-minimalistic-linear" size={24} />
          <p className="label-sacred text-text-muted">Espacios</p>
        </div>
        <h2 className="mt-2 font-display text-3xl text-text sm:text-4xl">
          Galería
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <GalleryCard key={item.imageUrl} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
