import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/og-card";
import { getOgFonts, OG_IMAGE_SIZE } from "@/lib/og-fonts";
import { MIRADOR_BRAND } from "@/lib/brand";

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
        title="El mirador que tu listing necesitaba"
        accent={MIRADOR_BRAND.surface}
        eyebrow="Mirador"
        subtitle="Recorridos 3D · Colombia · mirador.lat"
      />
    ),
    { ...size, fonts }
  );
}
