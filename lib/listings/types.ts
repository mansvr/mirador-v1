/** One row in `catalog.json` — marketplace index, not the full tour manifest. */
export type ListingCatalogEntry = {
  id: string;
  sceneId: string;
  title: string;
  neighborhood: string;
  city: string;
  beds: number;
  areaM2: number;
  priceLabel: string;
  published: boolean;
  sortOrder: number;
  /** R2 filename for card image, e.g. thumbnail.webp */
  thumbnailR2?: string;
  /** Optional absolute URL (staging only). */
  thumbnailUrl?: string;
};

export type ListingsCatalog = {
  version: 1;
  listings: ListingCatalogEntry[];
};
