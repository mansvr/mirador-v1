"use client";

/**
 * HotspotPin — a clickable 3D-anchored pin rendered via drei <Html>.
 * drei handles depth occlusion and billboard behaviour automatically.
 */

import { Html } from "@react-three/drei";
import { useViewerStore } from "@/lib/store";
import { trackHotspotClicked } from "@/lib/analytics";
import type { SceneHotspot } from "@/lib/types/scene";

interface HotspotPinProps {
  hotspot: SceneHotspot;
  sceneId: string;
}

export function HotspotPin({ hotspot, sceneId }: HotspotPinProps) {
  const activeHotspotId = useViewerStore((s) => s.activeHotspotId);
  const setActiveHotspot = useViewerStore((s) => s.setActiveHotspot);
  const isActive = activeHotspotId === hotspot.id;

  const [x, y, z] = hotspot.pos;

  function handleClick() {
    const nextId = isActive ? null : hotspot.id;
    setActiveHotspot(nextId);
    if (nextId) {
      trackHotspotClicked(sceneId, hotspot.id, hotspot.type);
    }
  }

  return (
    <Html
      position={[x, y, z]}
      center
      occlude
      // Keep the pin small enough not to obstruct the scene
      style={{ pointerEvents: "none" }}
    >
      <button
        onClick={handleClick}
        aria-label={hotspot.payload?.title ?? "Hotspot"}
        className={[
          "flex items-center justify-center",
          "w-8 h-8 rounded-full border-2 border-white shadow-lg",
          "text-white text-sm font-bold transition-all duration-150",
          "pointer-events-auto cursor-pointer",
          isActive
            ? "bg-[var(--mirador-primary,#FF6A00)] scale-110"
            : "bg-black/60 hover:bg-[var(--mirador-primary,#FF6A00)] hover:scale-105",
        ].join(" ")}
        style={{ pointerEvents: "auto" }}
      >
        {hotspot.type === "cta" ? "→" : hotspot.type === "media" ? "▶" : "i"}
      </button>
    </Html>
  );
}
