import { ImageResponse } from "next/og";
import { MIRADOR_DEFAULT_PRIMARY } from "@/lib/brand";
import { fetchScene } from "@/lib/scene";
import { OgCard } from "@/lib/og-card";
import { getOgFonts, OG_IMAGE_SIZE } from "@/lib/og-fonts";
import {
  ogThumbnailDataUrl,
  shareTitle,
} from "@/lib/og";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ sceneId: string }> }
) {
  const { sceneId } = await context.params;
  const fonts = await getOgFonts();

  try {
    const scene = await fetchScene(sceneId);
    const accent = scene.branding?.primary_color ?? MIRADOR_DEFAULT_PRIMARY;
    const thumbSrc = ogThumbnailDataUrl(sceneId);

    return new ImageResponse(
      (
        <OgCard
          title={shareTitle(scene)}
          accent={accent}
          thumbSrc={thumbSrc}
          subtitle="Tour virtual 3D · mirador.lat"
        />
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
          accent={MIRADOR_DEFAULT_PRIMARY}
          thumbSrc={ogThumbnailDataUrl(sceneId)}
        />
      ),
      { ...OG_IMAGE_SIZE, fonts }
    );
  }
}
