import fs from "fs";
import path from "path";
import type { Metadata } from "next";

const BAKED_OG = path.join(process.cwd(), "public/demo1/og-card.jpg");
const BAKED_OG_PATH = "/demo1/og-card.jpg";

export function demo1SiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://mirador.lat"
  ).replace(/\/$/, "");
}

export function demo1OgCardPublicPath(): string | null {
  return fs.existsSync(BAKED_OG) ? BAKED_OG_PATH : null;
}

export function demo1OgCardAbsoluteUrl(siteUrl?: string): string | null {
  const rel = demo1OgCardPublicPath();
  if (!rel) return null;
  const base = (siteUrl ?? demo1SiteUrl()).replace(/\/$/, "");
  return `${base}${rel}`;
}

/** Baked JPEG for WhatsApp (≤ ~300 KB). Fallback: dynamic PNG at `/api/og/demo1`. */
export function demo1OpenGraphImages(
  siteUrl?: string,
): NonNullable<Metadata["openGraph"]>["images"] {
  const base = (siteUrl ?? demo1SiteUrl()).replace(/\/$/, "");
  const baked = demo1OgCardAbsoluteUrl(base);
  const alt = "AI67 · Mirador — apartamento demo";

  if (baked) {
    return [
      {
        url: baked,
        secureUrl: baked,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt,
      },
    ];
  }

  const api = `${base}/api/og/demo1`;
  return [
    {
      url: api,
      secureUrl: api,
      width: 1200,
      height: 630,
      type: "image/png",
      alt,
    },
  ];
}

export function demo1TwitterImage(siteUrl?: string): string | string[] | undefined {
  const baked = demo1OgCardAbsoluteUrl(siteUrl);
  if (baked) return baked;
  const base = (siteUrl ?? demo1SiteUrl()).replace(/\/$/, "");
  return `${base}/api/og/demo1`;
}
