import "server-only";

import { headers } from "next/headers";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import {
  buildOpenGraphImages,
  ogCardAbsoluteUrl,
  ogCardApiUrl,
} from "@/lib/og";
import { loadListingsCatalog } from "@/lib/listings/load-catalog";

/** First published listing with a baked OG card — hub preview image. */
async function hubOgSceneId(): Promise<string> {
  const { listings } = await loadListingsCatalog();
  const published = listings
    .filter((row) => row.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  for (const row of published) {
    if (ogCardAbsoluteUrl(row.sceneId, "https://mirador.lat")) {
      return row.sceneId;
    }
  }

  return published[0]?.sceneId ?? "scene_best50000";
}

async function listingsHubCanonicalUrl(siteUrl: string): Promise<string> {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "")
    .split(",")[0]
    .trim()
    .toLowerCase();

  const base = siteUrl.replace(/\/$/, "");
  return host.includes("mirador.homes") ? base : `${base}/home`;
}

export async function listingsHubMetadata(): Promise<Metadata> {
  const siteUrl = await getSiteUrl();
  const sceneId = await hubOgSceneId();
  const title = "Mirador — Propiedades";
  const description = "Recorridos 3D para comprar y arrendar en Colombia.";
  const ogImage =
    ogCardAbsoluteUrl(sceneId, siteUrl) ?? ogCardApiUrl(sceneId, siteUrl);
  const canonical = await listingsHubCanonicalUrl(siteUrl);

  return {
    title: "Propiedades",
    description:
      "Explora apartamentos y casas con recorridos 3D en Colombia. · Browse listings with 3D tours",
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: "Mirador",
      locale: "es_CO",
      images: buildOpenGraphImages(sceneId, siteUrl, title),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
