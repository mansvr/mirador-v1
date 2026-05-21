import "server-only";

import type { ListingCardProps } from "@/components/listing/ListingCard";
import { ogThumbnailPublicPath } from "@/lib/og";
import { r2Url } from "@/lib/r2";
import { fetchScene } from "@/lib/scene";
import type { ListingCatalogEntry } from "@/lib/listings/types";

async function r2AssetExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      next: { revalidate: 300 },
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Card thumbnail priority (see docs/mirador-operations-guide.md §6):
 * 1. catalog.thumbnailUrl (absolute override)
 * 2. public/og/{sceneId}.jpg (source still — also used for OG bake)
 * 3. R2 /{sceneId}/{thumbnailR2 || thumbnail.webp} — only if HEAD returns 200
 */
async function resolveThumbnailUrl(
  entry: ListingCatalogEntry
): Promise<string | undefined> {
  if (entry.thumbnailUrl?.trim()) {
    return entry.thumbnailUrl.trim();
  }

  const baked = ogThumbnailPublicPath(entry.sceneId);
  if (baked) return baked;

  const r2Public = process.env.NEXT_PUBLIC_R2_URL ?? process.env.R2_PUBLIC_URL ?? "";
  if (!r2Public || r2Public.includes("placeholder")) {
    return undefined;
  }

  const file = entry.thumbnailR2?.trim() || "thumbnail.webp";
  const url = r2Url(entry.sceneId, file);
  if (await r2AssetExists(url)) {
    return url;
  }

  return undefined;
}

/**
 * Turn one catalog row into props for `ListingCard`.
 * Optionally enriches neighborhood/city from scene.json `listing` when catalog omits them.
 */
export async function resolveListingCard(
  entry: ListingCatalogEntry
): Promise<ListingCardProps> {
  let neighborhood = entry.neighborhood;
  let city = entry.city;
  let areaM2 = entry.areaM2;
  let beds = entry.beds;
  let hasTour = true;

  try {
    const scene = await fetchScene(entry.sceneId);
    if (scene.listing?.neighborhood && !neighborhood) {
      neighborhood = scene.listing.neighborhood;
    }
    if (scene.listing?.city && !city) {
      city = scene.listing.city;
    }
    if (scene.metric?.area_m2 != null && !entry.areaM2) {
      areaM2 = scene.metric.area_m2;
    }
    if (scene.metric?.rooms != null && !entry.beds) {
      beds = scene.metric.rooms;
    }
    hasTour = Boolean(scene.render?.url);
  } catch {
    hasTour = false;
  }

  return {
    title: entry.title,
    neighborhood,
    city,
    beds,
    areaM2,
    priceLabel: entry.priceLabel,
    href: `/v/${entry.sceneId}`,
    imageUrl: await resolveThumbnailUrl(entry),
    hasTour,
  };
}
