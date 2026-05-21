"use client";

import { useViewerStore } from "@/lib/store";
import { trackWaypointReached } from "@/lib/analytics";
import { sceneAssetUrl } from "@/lib/scene-utils";
import type { SceneWaypoint } from "@/lib/types/scene";

interface WaypointNavProps {
  waypoints: SceneWaypoint[];
  sceneId: string;
}

export function WaypointNav({ waypoints, sceneId }: WaypointNavProps) {
  const activeWaypointId = useViewerStore((s) => s.activeWaypointId);
  const setActiveWaypoint = useViewerStore((s) => s.setActiveWaypoint);

  if (!waypoints.length) return null;

  function handleSelect(wp: SceneWaypoint) {
    setActiveWaypoint(wp.id);
    trackWaypointReached(sceneId, wp.id, wp.label);
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center px-2 sm:bottom-4 sm:px-3">
      <div
        className="pointer-events-auto flex max-w-full gap-1 overflow-x-auto overscroll-x-contain rounded-full bg-black/50 p-1.5 backdrop-blur-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-1.5 sm:p-2"
        role="tablist"
        aria-label="Puntos del recorrido"
      >
      {waypoints.map((wp) => {
        const isActive = wp.id === activeWaypointId;
        return (
          <button
            key={wp.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(wp)}
            className={[
              "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all duration-200 sm:gap-2 sm:px-3 sm:text-sm",
              isActive
                ? "bg-[var(--mirador-primary,#5e5956)] text-white"
                : "text-white/70 hover:text-white hover:bg-white/10",
            ].join(" ")}
          >
            {wp.thumbnail_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sceneAssetUrl(sceneId, wp.thumbnail_url)}
                alt=""
                className="w-5 h-5 rounded-full object-cover"
              />
            )}
            <span className="max-w-[8rem] truncate sm:max-w-none">{wp.label}</span>
          </button>
        );
      })}
      </div>
    </div>
  );
}
