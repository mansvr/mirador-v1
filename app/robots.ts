import type { MetadataRoute } from "next";

/**
 * Explicit allow for Meta/WhatsApp crawlers (Sharing Debugger checks robots.txt).
 * @see docs/whatsapp-og-troubleshooting.md
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/",
      },
      {
        userAgent: "Facebot",
        allow: "/",
      },
      {
        userAgent: "meta-externalagent",
        allow: "/",
      },
      {
        userAgent: "WhatsApp",
        allow: "/",
      },
    ],
  };
}
