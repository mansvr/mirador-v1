import type { SceneCameraDefault, SceneWaypoint } from "@/lib/types/scene";

function round(n: number, digits = 4): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

function roundTuple3(t: [number, number, number]): [number, number, number] {
  return [round(t[0]), round(t[1]), round(t[2])];
}

function roundTuple4(t: [number, number, number, number]): [number, number, number, number] {
  return [round(t[0]), round(t[1]), round(t[2]), round(t[3])];
}

export function roundCameraDefault(cam: SceneCameraDefault): SceneCameraDefault {
  return {
    pos: roundTuple3(cam.pos),
    quat: roundTuple4(cam.quat),
    ...(cam.fov != null ? { fov: round(cam.fov, 2) } : {}),
  };
}

export function roundWaypoint(wp: SceneWaypoint): SceneWaypoint {
  return {
    ...wp,
    pos: roundTuple3(wp.pos),
    quat: roundTuple4(wp.quat),
  };
}

/** JSON patch for paste into scene.json (camera_default + waypoints only). */
export function buildAuthorExportJson(
  cameraDefault: SceneCameraDefault | null,
  waypoints: SceneWaypoint[]
): string {
  const patch: Record<string, unknown> = {};
  if (cameraDefault) {
    patch.camera_default = roundCameraDefault(cameraDefault);
  }
  if (waypoints.length > 0) {
    patch.waypoints = waypoints.map(roundWaypoint);
  }
  return JSON.stringify(patch, null, 2);
}
