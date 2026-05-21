import "server-only";

import fs from "fs/promises";
import path from "path";
import type { ListingsCatalog } from "@/lib/listings/types";

let cached: ListingsCatalog | null = null;

/** Read `catalog.json` once per process (dev HMR resets module). */
export async function loadListingsCatalog(): Promise<ListingsCatalog> {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "lib/listings/catalog.json");
  const raw = await fs.readFile(filePath, "utf-8");
  cached = JSON.parse(raw) as ListingsCatalog;
  return cached;
}

export function clearListingsCatalogCache(): void {
  cached = null;
}
