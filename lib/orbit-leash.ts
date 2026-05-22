import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Scene, SceneNavigation } from "@/lib/types/scene";
import { navPillsForScene, syncOrbitControlsToCamera } from "@/lib/viewer-camera";
import {
  clearTourLeashOffset,
  type TourHomePose,
  type TourLeashOffset,
  viewerNavRegistry,
} from "@/lib/viewer-navigation-registry";

export interface OrbitLeashConfig {
  maxYawRad: number;
  maxPitchRad: number;
  releaseResetMs: number;
  minZoomScale: number;
  maxZoomScale: number;
}

const _viewDir = new THREE.Vector3();
const _target = new THREE.Vector3();
const _offsetQuat = new THREE.Quaternion();
const _euler = new THREE.Euler(0, 0, 0, "YXZ");

const DEFAULT_CONFIG: OrbitLeashConfig = {
  maxYawRad: THREE.MathUtils.degToRad(22),
  maxPitchRad: THREE.MathUtils.degToRad(12),
  releaseResetMs: 450,
  minZoomScale: 0.72,
  maxZoomScale: 1.38,
};

function metricScaleTrusted(scene: Scene | null): boolean {
  const v = scene?.metric?.verified_by;
  return v === "apriltag" || v === "lidar";
}

/** Max pairwise distance between tour stops (scene units). */
export function tourFootprintRadius(scene: Scene | null): number {
  if (!scene) return 2;
  const pills = navPillsForScene(scene);
  if (pills.length < 2) {
    const p = pills[0]?.pos ?? [0, 1.6, 0];
    return Math.max(1, Math.hypot(p[0], p[1], p[2]));
  }
  let max = 0;
  for (let i = 0; i < pills.length; i++) {
    for (let j = i + 1; j < pills.length; j++) {
      const a = pills[i]!.pos;
      const b = pills[j]!.pos;
      const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      if (d > max) max = d;
    }
  }
  return Math.max(max, 1);
}

export function resolveOrbitLeashConfig(scene: Scene | null): OrbitLeashConfig {
  const o: SceneNavigation["orbit_leash"] | undefined =
    scene?.navigation?.orbit_leash;
  const footprint = tourFootprintRadius(scene);
  const trusted = metricScaleTrusted(scene);

  let minZoomScale = DEFAULT_CONFIG.minZoomScale;
  let maxZoomScale = DEFAULT_CONFIG.maxZoomScale;

  if (o?.min_distance_scene != null || o?.max_distance_scene != null) {
    const homeDist = viewerNavRegistry.home?.baseDistance ?? 2;
    if (o.min_distance_scene != null) {
      minZoomScale = Math.max(0.4, o.min_distance_scene / homeDist);
    }
    if (o.max_distance_scene != null) {
      maxZoomScale = Math.min(2.5, o.max_distance_scene / homeDist);
    }
  } else if (trusted && (o?.min_distance_m != null || o?.max_distance_m != null)) {
    const homeDist = viewerNavRegistry.home?.baseDistance ?? 2;
    if (o.min_distance_m != null) {
      minZoomScale = Math.max(0.4, o.min_distance_m / homeDist);
    }
    if (o.max_distance_m != null) {
      maxZoomScale = Math.min(2.5, o.max_distance_m / homeDist);
    }
  } else {
    const minDist = Math.max(0.08, 0.06 * footprint);
    const maxDist = Math.max(minDist + 0.5, 0.32 * footprint);
    const homeDist = viewerNavRegistry.home?.baseDistance ?? 2;
    minZoomScale = Math.max(0.5, minDist / homeDist);
    maxZoomScale = Math.min(2, maxDist / homeDist);
  }

  return {
    maxYawRad: THREE.MathUtils.degToRad(o?.max_yaw_deg ?? 22),
    maxPitchRad: THREE.MathUtils.degToRad(o?.max_pitch_deg ?? 12),
    releaseResetMs: o?.release_reset_ms ?? DEFAULT_CONFIG.releaseResetMs,
    minZoomScale,
    maxZoomScale,
  };
}

export function captureTourHomeFromCamera(
  camera: THREE.Camera,
  controls: OrbitControlsImpl | null,
  lookDistance = 2
): TourHomePose | null {
  if (!(camera instanceof THREE.PerspectiveCamera)) return null;

  _viewDir.set(0, 0, -1).applyQuaternion(camera.quaternion);
  _target.copy(camera.position).addScaledVector(_viewDir, lookDistance);
  if (controls?.target) {
    _target.copy(controls.target);
  }

  const baseDistance = Math.max(
    0.05,
    camera.position.distanceTo(_target)
  );

  return {
    pos: camera.position.clone(),
    quat: camera.quaternion.clone(),
    fov: camera.fov,
    target: _target.clone(),
    baseDistance,
  };
}

export function clampTourLeashOffset(
  offset: TourLeashOffset,
  config: OrbitLeashConfig
) {
  offset.yaw = THREE.MathUtils.clamp(
    offset.yaw,
    -config.maxYawRad,
    config.maxYawRad
  );
  offset.pitch = THREE.MathUtils.clamp(
    offset.pitch,
    -config.maxPitchRad,
    config.maxPitchRad
  );
  offset.zoomScale = THREE.MathUtils.clamp(
    offset.zoomScale,
    config.minZoomScale,
    config.maxZoomScale
  );
}

/** Apply home + offset to camera; sync orbit target when controls exist. */
export function applyTourLeashToCamera(
  camera: THREE.Camera,
  controls: OrbitControlsImpl | null,
  home: TourHomePose,
  offset: TourLeashOffset
) {
  if (!(camera instanceof THREE.PerspectiveCamera)) return;

  _euler.set(offset.pitch, offset.yaw, 0);
  _offsetQuat.setFromEuler(_euler);
  camera.quaternion.copy(home.quat).multiply(_offsetQuat);

  _viewDir.set(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
  const dist = home.baseDistance * offset.zoomScale;
  camera.position.copy(home.target).addScaledVector(_viewDir, -dist);

  camera.fov = home.fov;
  camera.updateProjectionMatrix();

  if (controls) {
    controls.target.copy(home.target);
    controls.update();
    controls.update();
  }
}

export function isTourLeashAtHome(
  offset: TourLeashOffset,
  epsilon = 1e-4
): boolean {
  return (
    Math.abs(offset.yaw) < epsilon &&
    Math.abs(offset.pitch) < epsilon &&
    Math.abs(offset.zoomScale - 1) < epsilon
  );
}

export function clearTourLeashState() {
  clearTourLeashOffset();
}
