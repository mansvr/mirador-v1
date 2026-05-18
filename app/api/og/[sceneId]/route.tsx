import { ImageResponse } from "next/og";
import { fetchScene } from "@/lib/scene";
import { OgCard } from "@/lib/og-card";
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

  try {
    const scene = await fetchScene(sceneId);
    const accent = scene.branding?.primary_color ?? "#FF6A00";
    const thumbSrc = ogThumbnailDataUrl(sceneId);

    return new ImageResponse(
      (
        <OgCard
          title={shareTitle(scene)}
          accent={accent}
          thumbSrc={thumbSrc}
          subtitle="Tour virtual 3D · Umbral"
        />
      ),
      {
        width: 1200,
        height: 630,
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
          accent="#FF6A00"
          thumbSrc={ogThumbnailDataUrl(sceneId)}
        />
      ),
      { width: 1200, height: 630 }
    );
  }
}
