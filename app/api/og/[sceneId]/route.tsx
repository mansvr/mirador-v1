import { ImageResponse } from "next/og";
import { fetchScene } from "@/lib/scene";
import { OgCard } from "@/lib/og-card";
import { getOgFonts, OG_IMAGE_SIZE } from "@/lib/og-fonts";
import { ogThumbnailDataUrl } from "@/lib/og";
import {
  OG_CARD_ACCENT,
  OG_EYEBROW,
  OG_SITE_SUBTITLE,
  ogCardPropsForScene,
} from "@/lib/og-template";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ sceneId: string }> }
) {
  const { sceneId } = await context.params;
  const fonts = await getOgFonts();

  try {
    const scene = await fetchScene(sceneId);
    const props = ogCardPropsForScene(sceneId, scene);

    return new ImageResponse(
      (
        <OgCard {...props} />
      ),
      {
        ...OG_IMAGE_SIZE,
        fonts,
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      }
    );
  } catch {
    return new ImageResponse(
      (
        <OgCard
          title="Mirador"
          accent={OG_CARD_ACCENT}
          eyebrow={OG_EYEBROW}
          subtitle={OG_SITE_SUBTITLE}
          thumbSrc={ogThumbnailDataUrl(sceneId)}
        />
      ),
      { ...OG_IMAGE_SIZE, fonts }
    );
  }
}
