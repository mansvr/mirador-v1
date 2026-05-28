"use client";

import { useEffect } from "react";
import { trackDemo1SectionViewed } from "@/lib/analytics";

const SECTIONS = [
  { id: "galeria", name: "galeria" as const },
  { id: "contacto", name: "contacto" as const },
] as const;

/**
 * Fires once per section when it enters the viewport (client-share funnel).
 */
export function Demo1Analytics() {
  useEffect(() => {
    const seen = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (!id || seen.has(id)) continue;
          const match = SECTIONS.find((s) => s.id === id);
          if (!match) continue;
          seen.add(id);
          trackDemo1SectionViewed(match.name);
        }
      },
      { root: null, rootMargin: "0px 0px -20% 0px", threshold: 0.25 },
    );

    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
