import { create } from "zustand";
import type { Scene, SceneWaypoint } from "@/lib/types/scene";

interface ViewerState {
  scene: Scene | null;
  /** Replaces scene; picks a valid `activeWaypointId` when the current id is missing from the new scene. */
  setScene: (scene: Scene) => void;

  /** True while WaypointCamera is tweening — OrbitControls should yield. */
  isCameraTweening: boolean;
  setCameraTweening: (v: boolean) => void;

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
  loadError: string | null;
  setLoaded: (loaded: boolean) => void;
  setLoadProgress: (progress: number) => void;
  setLoadError: (message: string | null) => void;
}

export const useViewerStore = create<ViewerState>((set) => ({
  scene: null,
  setScene: (scene) =>
    set((s) => {
      const wps = scene.waypoints ?? [];
      const stillValid =
        s.activeWaypointId != null &&
        wps.some((w) => w.id === s.activeWaypointId);
      const sameScene = s.scene?.id === scene.id;
      return {
        scene,
        activeWaypointId: stillValid ? s.activeWaypointId : (wps[0]?.id ?? null),
        activeHotspotId: sameScene ? s.activeHotspotId : null,
      };
    }),

  isCameraTweening: false,
  setCameraTweening: (isCameraTweening) => set({ isCameraTweening }),

  activeWaypointId: null,
  setActiveWaypoint: (id) => set({ activeWaypointId: id, activeHotspotId: null }),

  activeHotspotId: null,
  setActiveHotspot: (id) => set({ activeHotspotId: id }),

  isWalkMode: false,
  toggleWalkMode: () => set((s) => ({ isWalkMode: !s.isWalkMode })),

  isLoaded: false,
  loadProgress: 0,
  loadError: null,
  setLoaded: (isLoaded) => set({ isLoaded, ...(isLoaded ? { loadError: null } : {}) }),
  setLoadProgress: (loadProgress) => set({ loadProgress }),
  setLoadError: (loadError) => set({ loadError, isLoaded: false }),
}));

/** Helper: get the active SceneWaypoint object from the store. */
export function getActiveWaypoint(state: ViewerState): SceneWaypoint | null {
  if (!state.scene || !state.activeWaypointId) return null;
  return (
    state.scene.waypoints?.find((w) => w.id === state.activeWaypointId) ?? null
  );
}
