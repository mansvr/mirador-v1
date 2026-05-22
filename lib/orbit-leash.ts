import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Scene, SceneNavigation } from "@/lib/types/scene";
import { navPillsForScene } from "@/lib/viewer-camera";
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
const _radiusVec = new THREE.Vector3();
const _spherical = new THREE.Spherical();

const DEFAULT_CONFIG: OrbitLeashConfig = {
  maxYawRad: THREE.MathUtils.degToRad(28),
  maxPitchRad: THREE.MathUtils.degToRad(16),
  releaseResetMs: 450,
  minZoomScale: 1,
  maxZoomScale: 1,
};

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

  return {
    maxYawRad: THREE.MathUtils.degToRad(o?.max_yaw_deg ?? 28),
    maxPitchRad: THREE.MathUtils.degToRad(o?.max_pitch_deg ?? 16),
    releaseResetMs: o?.release_reset_ms ?? DEFAULT_CONFIG.releaseResetMs,
    // Tour mode: fixed radius around pivot (StorySplat-style). Zoom reserved for Author.
    minZoomScale: 1,
    maxZoomScale: 1,
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
  offset.zoomScale = 1;
}

/**
 * Orbit on a fixed pivot (home.target) at fixed radius — rotation only, no dolly.
 * Avoids the “rotate also zooms” artifact from re-aiming along a new view vector.
 */
export function applyTourLeashToCamera(
  camera: THREE.Camera,
  controls: OrbitControlsImpl | null,
  home: TourHomePose,
  offset: TourLeashOffset
) {
  if (!(camera instanceof THREE.PerspectiveCamera)) return;

  _radiusVec.copy(home.pos).sub(home.target);
  _spherical.setFromVector3(_radiusVec);
  const radius = Math.max(0.05, _spherical.radius);

  _spherical.theta -= offset.yaw;
  _spherical.phi -= offset.pitch;
  _spherical.phi = THREE.MathUtils.clamp(
    _spherical.phi,
    0.08,
    Math.PI - 0.08
  );
  _spherical.radius = radius;

  _radiusVec.setFromSpherical(_spherical);
  camera.position.copy(home.target).add(_radiusVec);
  camera.lookAt(home.target);

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
