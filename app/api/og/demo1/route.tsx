import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/og-card";
import { demo1PosterDataUrl } from "@/lib/demo1/og-poster";
import { getOgFonts, OG_IMAGE_SIZE } from "@/lib/og-fonts";
import { OG_CARD_ACCENT, OG_EYEBROW } from "@/lib/og-copy";

export const runtime = "nodejs";

/** Dynamic OG composite for bake (`npm run og:bake:demo1`). Metadata uses baked `/demo1/og-card.jpg`. */
export async function GET() {
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
    {
      ...OG_IMAGE_SIZE,
      fonts,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    },
  );
}
