import { create } from "zustand";
import type { Scene, SceneWaypoint } from "@/lib/types/scene";

interface ViewerState {
  scene: Scene | null;
  setScene: (scene: Scene) => void;

  // Active waypoint
  activeWaypointId: string | null;
  setActiveWaypoint: (id: string | null) => void;

  // Active hotspot (which panel is open)
  activeHotspotId: string | null;
  setActiveHotspot: (id: string | null) => void;

  // Walk mode (first-person, collision-enabled)
  isWalkMode: boolean;
  toggleWalkMode: () => void;

  // Splat loaded state
  isLoaded: boolean;
  loadProgress: number; // 0–1
  setLoaded: (loaded: boolean) => void;
  setLoadProgress: (progress: number) => void;
}

export const useViewerStore = create<ViewerState>((set) => ({
  scene: null,
  setScene: (scene) => set({ scene }),

  activeWaypointId: null,
  setActiveWaypoint: (id) => set({ activeWaypointId: id, activeHotspotId: null }),

  activeHotspotId: null,
  setActiveHotspot: (id) => set({ activeHotspotId: id }),

  isWalkMode: false,
  toggleWalkMode: () => set((s) => ({ isWalkMode: !s.isWalkMode })),

  isLoaded: false,
  loadProgress: 0,
  setLoaded: (isLoaded) => set({ isLoaded }),
  setLoadProgress: (loadProgress) => set({ loadProgress }),
}));

/** Helper: get the active SceneWaypoint object from the store. */
export function getActiveWaypoint(state: ViewerState): SceneWaypoint | null {
  if (!state.scene || !state.activeWaypointId) return null;
  return (
    state.scene.waypoints?.find((w) => w.id === state.activeWaypointId) ?? null
  );
}
