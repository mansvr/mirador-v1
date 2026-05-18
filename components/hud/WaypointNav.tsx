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
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 px-3 py-2 bg-black/50 backdrop-blur-sm rounded-full">
      {waypoints.map((wp) => {
        const isActive = wp.id === activeWaypointId;
        return (
          <button
            key={wp.id}
            onClick={() => handleSelect(wp)}
            className={[
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-[var(--mirador-primary,#FF6A00)] text-white"
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
            <span>{wp.label}</span>
          </button>
        );
      })}
    </div>
  );
}
