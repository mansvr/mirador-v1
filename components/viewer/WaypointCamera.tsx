"use client";

/**
 * WaypointCamera — animates the camera to the active waypoint's pos/quat.
 * Ease-in-out cubic interpolation; only reacts when `activeWaypointId` changes.
 * Disables OrbitControls while tweening so the two don't fight.
 */

import { useEffect, useRef, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useViewerStore, getActiveWaypoint } from "@/lib/store";
import type { SceneCameraDefault, SceneWaypoint } from "@/lib/types/scene";

function applyCameraPose(
  camera: THREE.Camera,
  pose: SceneCameraDefault | SceneWaypoint
) {
  const [px, py, pz] = pose.pos;
  const [qx, qy, qz, qw] = pose.quat;
  camera.position.set(px, py, pz);
  camera.quaternion.set(qx, qy, qz, qw);
  const fov = "fov" in pose ? pose.fov : undefined;
  if (fov != null && camera instanceof THREE.PerspectiveCamera) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}

export function WaypointCamera() {
  const { camera } = useThree();
  const setCameraTweening = useViewerStore((s) => s.setCameraTweening);

  const targetPos = useRef(new THREE.Vector3());
  const targetQuat = useRef(new THREE.Quaternion());
  const isAnimating = useRef(false);
  const animationProgress = useRef(0);
  const startPos = useRef(new THREE.Vector3());
  const startQuat = useRef(new THREE.Quaternion());
  const transitionMs = useRef(1200);
  const prevWaypointId = useRef<string | null>(null);

  const beginTweenToWaypoint = useCallback(
    (wp: SceneWaypoint) => {
      startPos.current.copy(camera.position);
      startQuat.current.copy(camera.quaternion);

      const [tx, ty, tz] = wp.pos;
      const [qx, qy, qz, qw] = wp.quat;
      targetPos.current.set(tx, ty, tz);
      targetQuat.current.set(qx, qy, qz, qw);
      transitionMs.current = wp.transition_ms ?? 1200;

      animationProgress.current = 0;
      isAnimating.current = true;
      setCameraTweening(true);
    },
    [camera, setCameraTweening]
  );

  useEffect(() => {
    const unsub = useViewerStore.subscribe((state) => {
      const id = state.activeWaypointId;
      if (id === prevWaypointId.current) return;
      prevWaypointId.current = id;
      const wp = getActiveWaypoint(state);
      if (wp) beginTweenToWaypoint(wp);
    });

    const state = useViewerStore.getState();
    const opening = state.scene?.camera_default;
    const wp0 = getActiveWaypoint(state);

    if (opening) {
      applyCameraPose(camera, opening);
      prevWaypointId.current = null;
    } else if (wp0) {
      prevWaypointId.current = wp0.id;
      beginTweenToWaypoint(wp0);
    } else {
      prevWaypointId.current = null;
    }

    return unsub;
  }, [beginTweenToWaypoint, camera]);

  useEffect(
    () => () => {
      useViewerStore.getState().setCameraTweening(false);
    },
    []
  );

  useFrame((_, delta) => {
    if (!isAnimating.current) return;

    const duration = transitionMs.current / 1000;
    animationProgress.current = Math.min(
      animationProgress.current + delta / duration,
      1
    );

    const t = easeInOutCubic(animationProgress.current);

    camera.position.lerpVectors(startPos.current, targetPos.current, t);
    camera.quaternion.slerpQuaternions(
      startQuat.current,
      targetQuat.current,
      t
    );

    if (animationProgress.current >= 1) {
      isAnimating.current = false;
      setCameraTweening(false);
    }
  });

  return null;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
