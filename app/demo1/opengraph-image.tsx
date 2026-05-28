import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/og-card";
import { demo1PosterDataUrl } from "@/lib/demo1/og-poster";
import { getOgFonts, OG_IMAGE_SIZE } from "@/lib/og-fonts";
import { OG_CARD_ACCENT, OG_EYEBROW } from "@/lib/og-copy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = "AI67 · Mirador — apartamento demo";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

/** 1200×630 share card — Mirador frame + AI67 still (bake with `npm run og:bake:demo1`). */
export default async function Demo1OpenGraphImage() {
  const [fonts, thumbSrc] = await Promise.all([
    getOgFonts(),
    demo1PosterDataUrl(),
  ]);

  return new ImageResponse(
    (
      <OgCard
        title="AI67"
        accent={OG_CARD_ACCENT}
        eyebrow={OG_EYEBROW}
        subtitle="Apartamento demo · Medellín · mirador.lat/demo1"
        thumbSrc={thumbSrc}
      />
    ),
    { ...OG_IMAGE_SIZE, fonts },
  );
}
