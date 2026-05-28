import propertyData from "@/content/demo1/property.json";
import type { PropertyMicrosite } from "@/lib/demo1/types";

const DEMO_ASSET_PREFIX = "/demo1";

/** Public R2 object — override with NEXT_PUBLIC_DEMO1_SCRUB_MP4_URL in Vercel. */
const DEFAULT_SCRUB_MP4_URL =
  "https://pub-8d93aaffda7e41a99f7984129f0a3674.r2.dev/hero-scrub.mp4";

function resolveHlsUrl(data: PropertyMicrosite): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_DEMO1_HLS_URL?.trim();
  if (fromEnv) return fromEnv;
  return data.hlsUrl;
}

/** Scroll-scrub MP4 — R2/CDN in prod, local `/demo1/assets` fallback for dev. */
export function getHeroScrubMp4Url(): string {
  return (
    process.env.NEXT_PUBLIC_DEMO1_SCRUB_MP4_URL?.trim() ||
    process.env.NEXT_PUBLIC_SCRUB_MP4_URL?.trim() ||
    DEFAULT_SCRUB_MP4_URL
  );
}

export function getProperty(): PropertyMicrosite {
  const data = propertyData as PropertyMicrosite;
  return {
    ...data,
    hlsUrl: resolveHlsUrl(data),
    posterUrl:
      process.env.NEXT_PUBLIC_DEMO1_POSTER_URL?.trim() || data.posterUrl,
  };
}

export function whatsappHref(number: string, text: string): string {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${number}?text=${encoded}`;
}
