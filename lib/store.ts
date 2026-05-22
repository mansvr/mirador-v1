import { create } from "zustand";
import { OPENING_WAYPOINT_ID, resolveCameraNavTarget } from "@/lib/viewer-camera";
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
  /** Short status for the loading overlay (e.g. which .sog is downloading). */
  loadHint: string | null;
  loadError: string | null;
  /** Spark onLoad fired; waiting for activeSplats > 0 (iOS can stay black otherwise). */
  awaitingGpuRender: boolean;
  setLoaded: (loaded: boolean) => void;
  setLoadProgress: (progress: number) => void;
  setLoadHint: (hint: string | null) => void;
  setLoadError: (message: string | null) => void;
  setAwaitingGpuRender: (value: boolean) => void;
}

export const useViewerStore = create<ViewerState>((set) => ({
  scene: null,
  setScene: (scene) =>
    set((s) => {
      const wps = scene.waypoints ?? [];
      const stillValid =
        s.activeWaypointId != null &&
        (s.activeWaypointId === OPENING_WAYPOINT_ID
          ? Boolean(scene.camera_default)
          : wps.some((w) => w.id === s.activeWaypointId));
      const sameScene = s.scene?.id === scene.id;

      // With camera_default, stay on opening view until user picks a pill.
      let activeWaypointId: string | null;
      if (stillValid) {
        activeWaypointId = s.activeWaypointId;
      } else if (scene.camera_default) {
        activeWaypointId = OPENING_WAYPOINT_ID;
      } else {
        activeWaypointId = wps[0]?.id ?? null;
      }

      return {
        scene,
        activeWaypointId,
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
  loadHint: null,
  loadError: null,
  awaitingGpuRender: false,
  setLoaded: (isLoaded) =>
    set({
      isLoaded,
      ...(isLoaded
        ? { loadError: null, awaitingGpuRender: false, loadHint: null }
        : {}),
    }),
  setLoadProgress: (loadProgress) => set({ loadProgress }),
  setLoadHint: (loadHint) => set({ loadHint }),
  setLoadError: (loadError) =>
    set({ loadError, isLoaded: false, awaitingGpuRender: false, loadHint: null }),
  setAwaitingGpuRender: (awaitingGpuRender) => set({ awaitingGpuRender }),
}));

/** Helper: get the active nav target (opening pill or waypoint). */
export function getActiveWaypoint(state: ViewerState): SceneWaypoint | null {
  const target = resolveCameraNavTarget(state.scene, state.activeWaypointId);
  return target as SceneWaypoint | null;
}
