import "server-only";

import fs from "fs";
import path from "path";
import type { Scene } from "@/lib/types/scene";

/** Static OG photo served from public/og/<sceneId>.jpg (WhatsApp-friendly). */
export function ogThumbnailPublicPath(sceneId: string): string | null {
  const file = path.join(process.cwd(), "public", "og", `${sceneId}.jpg`);
  return fs.existsSync(file) ? `/og/${sceneId}.jpg` : null;
}

export function ogThumbnailAbsoluteUrl(
  sceneId: string,
  siteUrl: string
): string | null {
  const rel = ogThumbnailPublicPath(sceneId);
  if (!rel) return null;
  return `${siteUrl.replace(/\/$/, "")}${rel}`;
}

/** Stable composite card (no Next.js cache-bust query) for crawlers. */
export function ogCardApiUrl(sceneId: string, siteUrl: string): string {
  return `${siteUrl.replace(/\/$/, "")}/api/og/${sceneId}`;
}

export function ogThumbnailDataUrl(sceneId: string): string | null {
  const file = path.join(process.cwd(), "public", "og", `${sceneId}.jpg`);
  if (!fs.existsSync(file)) return null;
  const buf = fs.readFileSync(file);
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

/** Short copy for WhatsApp / social (avoid dev markdown in scene.json). */
export function shareTitle(scene: Scene): string {
  return scene.title.replace(/\s*\(local[^)]*\)\s*/i, "").trim() || scene.title;
}

export function shareDescription(scene: Scene): string {
  const t = shareTitle(scene);
  return `Tour virtual 3D · ${t}`;
}

export function buildOpenGraphImages(
  sceneId: string,
  siteUrl: string,
  alt: string
): NonNullable<import("next").Metadata["openGraph"]>["images"] {
  const thumb = ogThumbnailAbsoluteUrl(sceneId, siteUrl);
  const card = ogCardApiUrl(sceneId, siteUrl);

  // Static JPG first — CDN file, best chance when Meta is blocked on dynamic /api/og.
  if (thumb) {
    return [
      {
        url: thumb,
        secureUrl: thumb,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt,
      },
      {
        url: card,
        secureUrl: card,
        width: 1200,
        height: 630,
        type: "image/png",
        alt,
      },
    ];
  }

  return [
    {
      url: card,
      secureUrl: card,
      width: 1200,
      height: 630,
      type: "image/png",
      alt,
    },
  ];
}
