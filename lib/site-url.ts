import "server-only";

import { headers } from "next/headers";

/**
 * Canonical site origin for embed snippets and absolute links.
 * Must match between server render and client hydration — never use
 * `window.location.origin` inside SSR'd client components.
 */
export async function getSiteUrl(): Promise<string> {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000")
    .split(",")[0]
    .trim();
  const forwardedProto = h.get("x-forwarded-proto");
  const proto =
    forwardedProto ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");

  // Multi-domain: mirador.lat (marketing) + mirador.homes (listings) share one deploy.
  if (!host.startsWith("localhost") && !host.startsWith("127.0.0.1")) {
    return `${proto}://${host}`;
  }

  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (envUrl) return envUrl;

  return `${proto}://${host}`;
}
