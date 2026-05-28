"use client";

import { useEffect } from "react";

/** Inject preload hints for hero scrub MP4 + first gallery stills (motion preview only). */
export function useDemo1Prefetch(
  enabled: boolean,
  srcMp4: string,
  imageUrls: string[],
) {
  useEffect(() => {
    if (!enabled) return;

    const created: HTMLLinkElement[] = [];

    const preload = (href: string, as: "video" | "image") => {
      if (!href || document.querySelector(`link[rel="preload"][href="${href}"]`)) {
        return;
      }
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = as;
      link.href = href;
      if (as === "video") {
        link.type = "video/mp4";
      }
      document.head.appendChild(link);
      created.push(link);
    };

    preload(srcMp4, "video");
    for (const url of imageUrls.slice(0, 4)) {
      preload(url, "image");
    }

    return () => {
      for (const link of created) {
        link.remove();
      }
    };
  }, [enabled, srcMp4, imageUrls]);
}
