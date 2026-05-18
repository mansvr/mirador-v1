"use client";

/**
 * HotspotPanel — a slide-in overlay panel for the active hotspot.
 * Rendered outside the Canvas (normal DOM). Uses Framer Motion for animation.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useViewerStore } from "@/lib/store";
import { trackCTAClicked } from "@/lib/analytics";
import type { Scene } from "@/lib/types/scene";

interface HotspotPanelProps {
  scene: Scene;
}

export function HotspotPanel({ scene }: HotspotPanelProps) {
  const activeHotspotId = useViewerStore((s) => s.activeHotspotId);
  const setActiveHotspot = useViewerStore((s) => s.setActiveHotspot);

  const hotspot = scene.hotspots?.find((h) => h.id === activeHotspotId) ?? null;

  return (
    <AnimatePresence>
      {hotspot && hotspot.payload && (
        <motion.div
          key={hotspot.id}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-sm shadow-2xl z-20 overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => setActiveHotspot(null)}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors text-black/60"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="p-6 pt-10">
            {hotspot.payload.title && (
              <h2 className="text-lg font-semibold text-gray-900 mb-3 pr-6">
                {hotspot.payload.title}
              </h2>
            )}

            {hotspot.payload.body_md && (
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                {hotspot.payload.body_md}
              </p>
            )}

            {hotspot.payload.image_urls && hotspot.payload.image_urls.length > 0 && (
              <div className="mb-4 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hotspot.payload.image_urls[0]}
                  alt={hotspot.payload.title ?? ""}
                  className="w-full object-cover rounded-lg"
                />
              </div>
            )}

            {hotspot.payload.cta_href && hotspot.payload.cta_label && (
              <a
                href={hotspot.payload.cta_href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackCTAClicked(
                    scene.id,
                    hotspot.id,
                    hotspot.payload!.cta_href!
                  )
                }
                className="block w-full text-center py-3 px-4 rounded-lg bg-[var(--mirador-primary,#FF6A00)] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                {hotspot.payload.cta_label}
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
