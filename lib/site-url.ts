import "server-only";

import { headers } from "next/headers";

/**
 * Canonical site origin for embed snippets and absolute links.
 * Must match between server render and client hydration — never use
 * `window.location.origin` inside SSR'd client components.
 */
export async function getSiteUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (envUrl) return envUrl;

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const forwardedProto = h.get("x-forwarded-proto");
  const proto =
    forwardedProto ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return `${proto}://${host}`;
}
