import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/og-card";
import { getOgFonts, OG_IMAGE_SIZE } from "@/lib/og-fonts";
import {
  OG_CARD_ACCENT,
  OG_EYEBROW,
  OG_MARKETING_TITLE,
  OG_SITE_SUBTITLE,
} from "@/lib/og-template";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const alt = "Mirador — recorridos 3D para propiedad en Colombia";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

/** Default site OG for marketing / share links. */
export default async function OpenGraphImage() {
  const fonts = await getOgFonts();

  return new ImageResponse(
    (
      <OgCard
        title={OG_MARKETING_TITLE}
        accent={OG_CARD_ACCENT}
        eyebrow={OG_EYEBROW}
        subtitle={OG_SITE_SUBTITLE}
      />
    ),
    { ...size, fonts }
  );
}
