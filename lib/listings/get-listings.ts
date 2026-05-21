import "server-only";

import type { ListingCardProps } from "@/components/listing/ListingCard";
import { loadListingsCatalog } from "@/lib/listings/load-catalog";
import { resolveListingCard } from "@/lib/listings/resolve-listing-card";

/** Published listings for mirador.home grid, sorted by `sortOrder`. */
export async function getPublishedListingCards(): Promise<ListingCardProps[]> {
  const { listings } = await loadListingsCatalog();
  const published = listings
    .filter((row) => row.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return Promise.all(published.map((row) => resolveListingCard(row)));
}
