import { create } from "zustand";
import { buildAuthorExportJson } from "@/lib/author-export";
import type {
  Scene,
  SceneCameraDefault,
  SceneWaypoint,
} from "@/lib/types/scene";
import { OPENING_WAYPOINT_ID } from "@/lib/viewer-camera";
import { useViewerStore } from "@/lib/store";

interface AuthorState {
  baseScene: Scene | null;
  cameraDefault: SceneCameraDefault | null;
  waypoints: SceneWaypoint[];
  selectedWaypointId: string | null;
  newLabel: string;
  copied: boolean;

  initFromScene: (scene: Scene) => void;
  setNewLabel: (label: string) => void;
  selectWaypoint: (id: string | null) => void;
  setCameraDefault: (cam: SceneCameraDefault | null) => void;
  addWaypointFromCamera: (cam: SceneCameraDefault) => void;
  updateSelectedFromCamera: (cam: SceneCameraDefault) => void;
  deleteSelected: () => void;
  moveSelected: (dir: -1 | 1) => void;
  exportJson: () => string;
  copyExport: () => Promise<void>;
}

function nextWaypointId(waypoints: SceneWaypoint[]): string {
  const nums = waypoints
    .map((w) => /^w_(\d+)$/.exec(w.id)?.[1])
    .filter(Boolean)
    .map((n) => Number.parseInt(n!, 10));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `w_${String(next).padStart(2, "0")}`;
}

function slugLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 24);
}

function applyPreview(base: Scene, draft: Pick<AuthorState, "cameraDefault" | "waypoints">) {
  useViewerStore.getState().setScene({
    ...base,
    camera_default: draft.cameraDefault ?? undefined,
    waypoints: draft.waypoints,
  });
}

export const useAuthorStore = create<AuthorState>((set, get) => ({
  baseScene: null,
  cameraDefault: null,
  waypoints: [],
  selectedWaypointId: null,
  newLabel: "",
  copied: false,

  initFromScene: (scene) => {
    const waypoints = (scene.waypoints ?? []).map((w) => ({ ...w }));
    const cameraDefault = scene.camera_default
      ? { ...scene.camera_default }
      : null;
    set({
      baseScene: scene,
      waypoints,
      cameraDefault,
      selectedWaypointId: cameraDefault
        ? OPENING_WAYPOINT_ID
        : waypoints[0]?.id ?? null,
      newLabel: "",
      copied: false,
    });
    applyPreview(scene, { cameraDefault, waypoints });
  },

  setNewLabel: (newLabel) => set({ newLabel }),

  selectWaypoint: (id) => {
    set({ selectedWaypointId: id });
    if (id) useViewerStore.getState().setActiveWaypoint(id);
  },

  setCameraDefault: (cam) => {
    const { baseScene } = get();
    if (!baseScene) return;
    set({ cameraDefault: cam, selectedWaypointId: OPENING_WAYPOINT_ID });
    applyPreview(baseScene, { ...get(), cameraDefault: cam });
    useViewerStore.getState().setActiveWaypoint(OPENING_WAYPOINT_ID);
  },

  addWaypointFromCamera: (cam) => {
    const { baseScene, waypoints, newLabel } = get();
    if (!baseScene) return;
    const label = newLabel.trim() || `Punto ${waypoints.length + 1}`;
    const slug = slugLabel(label);
    const id = slug && !waypoints.some((w) => w.id === `w_${slug}`)
      ? `w_${slug}`
      : nextWaypointId(waypoints);
    const wp: SceneWaypoint = {
      id,
      label,
      pos: [...cam.pos],
      quat: [...cam.quat],
      transition_ms: 1200,
    };
    const next = [...waypoints, wp];
    set({
      waypoints: next,
      selectedWaypointId: id,
      newLabel: "",
    });
    applyPreview(baseScene, {
      cameraDefault: get().cameraDefault,
      waypoints: next,
    });
    useViewerStore.getState().setActiveWaypoint(id);
  },

  updateSelectedFromCamera: (cam) => {
    const { baseScene, waypoints, selectedWaypointId } = get();
    if (
      !baseScene ||
      !selectedWaypointId ||
      selectedWaypointId === OPENING_WAYPOINT_ID
    ) {
      return;
    }
    const next = waypoints.map((w) =>
      w.id === selectedWaypointId
        ? {
            ...w,
            pos: [...cam.pos] as [number, number, number],
            quat: [...cam.quat] as [number, number, number, number],
          }
        : w
    );
    set({ waypoints: next });
    applyPreview(baseScene, {
      cameraDefault: get().cameraDefault,
      waypoints: next,
    });
  },

  deleteSelected: () => {
    const { baseScene, waypoints, selectedWaypointId } = get();
    if (!baseScene || !selectedWaypointId) return;
    const next = waypoints.filter((w) => w.id !== selectedWaypointId);
    const nextId = next[0]?.id ?? null;
    set({ waypoints: next, selectedWaypointId: nextId });
    applyPreview(baseScene, {
      cameraDefault: get().cameraDefault,
      waypoints: next,
    });
    useViewerStore.getState().setActiveWaypoint(nextId);
  },

  moveSelected: (dir) => {
    const { baseScene, waypoints, selectedWaypointId } = get();
    if (!baseScene || !selectedWaypointId) return;
    const i = waypoints.findIndex((w) => w.id === selectedWaypointId);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= waypoints.length) return;
    const next = [...waypoints];
    const [item] = next.splice(i, 1);
    next.splice(j, 0, item);
    set({ waypoints: next });
    applyPreview(baseScene, {
      cameraDefault: get().cameraDefault,
      waypoints: next,
    });
  },

  exportJson: () => {
    const { cameraDefault, waypoints } = get();
    return buildAuthorExportJson(cameraDefault, waypoints);
  },

  copyExport: async () => {
    const json = get().exportJson();
    await navigator.clipboard.writeText(json);
    set({ copied: true });
    window.setTimeout(() => set({ copied: false }), 2000);
  },
}));
