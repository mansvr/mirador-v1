import "server-only";

import fs from "fs";
import path from "path";
import type { Scene } from "@/lib/types/scene";
import { OG_SITE_SUBTITLE } from "@/lib/og-copy";
import { isR2Configured, r2Url } from "@/lib/r2";

/** Static OG photo (no overlay) from public/og/<sceneId>.jpg */
export function ogThumbnailPublicPath(sceneId: string): string | null {
  const file = path.join(process.cwd(), "public", "og", `${sceneId}.jpg`);
  return fs.existsSync(file) ? `/og/${sceneId}.jpg` : null;
}

/** R2 prod poster uploaded at H-GATE (JPEG preferred for crawlers). */
export function ogPosterR2Url(sceneId: string, ext: "jpg" | "webp" = "jpg"): string | null {
  if (!isR2Configured()) return null;
  return r2Url(sceneId, ext === "webp" ? "og-poster.webp" : "og-poster.jpg");
}

/** Listing grid thumbnail on R2 — same hero as card when og-poster is absent. */
export function ogListingThumbnailR2Url(sceneId: string): string | null {
  if (!isR2Configured()) return null;
  return r2Url(sceneId, "thumbnail.webp");
}

async function r2PosterExists(sceneId: string): Promise<string | null> {
  for (const ext of ["jpg", "webp"] as const) {
    const url = ogPosterR2Url(sceneId, ext);
    if (!url) continue;
    try {
      const res = await fetch(url, { method: "HEAD", next: { revalidate: 300 } });
      if (res.ok) return url;
    } catch {
      /* try next */
    }
  }
  return null;
}

/** Baked photo-only JPEG (≤300 KB) — run `npm run og:bake`. See docs/share-og-workflow.md */
export function ogCardPublicPath(sceneId: string): string | null {
  const file = path.join(process.cwd(), "public", "og", `${sceneId}-card.jpg`);
  return fs.existsSync(file) ? `/og/${sceneId}-card.jpg` : null;
}

/** Baked card via API — always HTTP 200 (avoids Vercel static 206 on Range requests). */
export function ogCardCrawlerUrl(sceneId: string, siteUrl: string): string | null {
  if (!ogCardPublicPath(sceneId)) return null;
  return `${siteUrl.replace(/\/$/, "")}/api/og-card/${sceneId}`;
}

export function ogCardAbsoluteUrl(sceneId: string, siteUrl: string): string | null {
  return ogCardCrawlerUrl(sceneId, siteUrl);
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

/** Async: public/og first, then R2 og-poster for OG card composite. */
export async function ogThumbnailSourceForCard(sceneId: string): Promise<string | null> {
  const local = ogThumbnailDataUrl(sceneId);
  if (local) return local;

  const r2 = await r2PosterExists(sceneId);
  if (!r2) return null;

  try {
    const res = await fetch(r2, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get("content-type") ?? "image/jpeg";
    return `data:${ct};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Short copy for WhatsApp / social (avoid dev markdown in scene.json). */
export function shareTitle(scene: Scene): string {
  return scene.title.replace(/\s*\(local[^)]*\)\s*/i, "").trim() || scene.title;
}

export function shareDescription(scene: Scene): string {
  const t = shareTitle(scene);
  return `${OG_SITE_SUBTITLE} · ${t}`;
}

type OgImageMeta = {
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  type: "image/jpeg" | "image/webp" | "image/png";
  alt: string;
};

function ogImageEntry(
  url: string,
  alt: string,
  type: OgImageMeta["type"] = "image/jpeg"
): OgImageMeta {
  return {
    url,
    secureUrl: url,
    width: 1200,
    height: 630,
    type,
    alt,
  };
}


export function buildOpenGraphImages(
  sceneId: string,
  siteUrl: string,
  alt: string
): OgImageMeta[] {
  const baked = ogCardAbsoluteUrl(sceneId, siteUrl);
  if (baked) {
    return [ogImageEntry(baked, alt, "image/jpeg")];
  }

  const r2Jpg = ogPosterR2Url(sceneId, "jpg");
  if (r2Jpg) {
    return [ogImageEntry(r2Jpg, alt, "image/jpeg")];
  }

  const r2Thumb = ogListingThumbnailR2Url(sceneId);
  if (r2Thumb) {
    return [ogImageEntry(r2Thumb, alt, "image/webp")];
  }

  const thumb = ogThumbnailAbsoluteUrl(sceneId, siteUrl);
  if (thumb) {
    return [ogImageEntry(thumb, alt, "image/jpeg")];
  }

  const card = ogCardApiUrl(sceneId, siteUrl);
  return [ogImageEntry(card, alt, "image/png")];
}

/** First OG image URL for twitter:image (matches buildOpenGraphImages priority). */
export function resolvePrimaryOgImageUrl(sceneId: string, siteUrl: string): string {
  const images = buildOpenGraphImages(sceneId, siteUrl, sceneId);
  return images[0]?.url ?? ogCardApiUrl(sceneId, siteUrl);
}
