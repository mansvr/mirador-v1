import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Scene, SceneCameraDefault, SceneWaypoint } from "@/lib/types/scene";

/** Virtual nav id for `camera_default` (not stored in scene.json). */
export const OPENING_WAYPOINT_ID = "__opening__";

const _viewDir = new THREE.Vector3();
const _target = new THREE.Vector3();

/**
 * OrbitControls orbit around `target`, not the saved camera quaternion.
 * After programmatic moves, sync target so re-enabling controls does not snap.
 */
export function syncOrbitControlsToCamera(
  controls: OrbitControlsImpl,
  camera: THREE.Camera,
  lookDistance = 2
) {
  _viewDir.set(0, 0, -1).applyQuaternion(camera.quaternion);
  _target.copy(camera.position).addScaledVector(_viewDir, lookDistance);
  controls.target.copy(_target);
  // Two updates: first reconciles spherical state from position; second settles damping.
  controls.update();
  controls.update();
}

export function openingWaypointFromScene(
  scene: Scene
): (SceneWaypoint & SceneCameraDefault) | null {
  const opening = scene.camera_default;
  if (!opening) return null;
  return {
    id: OPENING_WAYPOINT_ID,
    label: "Inicio",
    pos: opening.pos,
    quat: opening.quat,
    fov: opening.fov,
    transition_ms: 1200,
  };
}

export function resolveCameraNavTarget(
  scene: Scene | null,
  waypointId: string | null
): (SceneWaypoint & Partial<SceneCameraDefault>) | null {
  if (!scene || !waypointId) return null;
  if (waypointId === OPENING_WAYPOINT_ID) {
    return openingWaypointFromScene(scene);
  }
  return scene.waypoints?.find((w) => w.id === waypointId) ?? null;
}

export function navPillsForScene(scene: Scene): SceneWaypoint[] {
  const opening = openingWaypointFromScene(scene);
  const wps = scene.waypoints ?? [];
  if (opening) {
    return [opening, ...wps];
  }
  return wps;
}

export function isOpeningWaypointId(id: string | null): boolean {
  return id === OPENING_WAYPOINT_ID;
}

export function navStepIndex(
  pills: SceneWaypoint[],
  activeWaypointId: string | null
): number {
  if (!activeWaypointId) return -1;
  return pills.findIndex((p) => p.id === activeWaypointId);
}

/** Previous or next pill in tour order; wraps Inicio ↔ last waypoint. */
export function navStepSibling(
  pills: SceneWaypoint[],
  activeWaypointId: string | null,
  dir: -1 | 1,
  wrap = true
): SceneWaypoint | null {
  if (pills.length < 2) return null;
  const i = navStepIndex(pills, activeWaypointId);
  if (i < 0) return null;

  let j = i + dir;
  if (wrap) {
    j = ((j % pills.length) + pills.length) % pills.length;
  } else if (j < 0 || j >= pills.length) {
    return null;
  }
  return pills[j] ?? null;
}
