import type { ListingCardProps } from "@/components/listing/ListingCard";
import catalog from "@/lib/listings/catalog.json";

/** Sync card props for design preview (no R2/scene fetch). */
export const DEMO_LISTINGS: ListingCardProps[] = catalog.listings
  .filter((row) => row.published)
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .map((row) => ({
    title: row.title,
    neighborhood: row.neighborhood,
    city: row.city,
    beds: row.beds,
    areaM2: row.areaM2,
    priceLabel: row.priceLabel,
    href: `/v/${row.sceneId}`,
    hasTour: true,
  }));
