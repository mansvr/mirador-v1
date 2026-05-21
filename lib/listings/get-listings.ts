import "server-only";

import type { ListingCardProps } from "@/components/listing/ListingCard";
import { loadListingsCatalog } from "@/lib/listings/load-catalog";
import { resolveListingCard } from "@/lib/listings/resolve-listing-card";

/** Catalog price line for a tour page sidebar (if the scene is in the public grid). */
export async function getPriceLabelForScene(
  sceneId: string
): Promise<string | undefined> {
  const { listings } = await loadListingsCatalog();
  return listings.find((row) => row.published && row.sceneId === sceneId)?.priceLabel;
}

/** Published listings for mirador.homes grid, sorted by `sortOrder`. */
export async function getPublishedListingCards(): Promise<ListingCardProps[]> {
  const { listings } = await loadListingsCatalog();
  const published = listings
    .filter((row) => row.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return Promise.all(published.map((row) => resolveListingCard(row)));
}
