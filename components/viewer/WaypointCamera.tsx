"use client";

/**
 * WaypointCamera — animates the camera to nav targets (opening + waypoints).
 * Syncs OrbitControls target after each move so controls do not snap on re-enable.
 */

import { useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useViewerStore } from "@/lib/store";
import {
  OPENING_WAYPOINT_ID,
  resolveCameraNavTarget,
  syncOrbitControlsToCamera,
} from "@/lib/viewer-camera";
import type { SceneCameraDefault, SceneWaypoint } from "@/lib/types/scene";

type NavTarget = SceneWaypoint & Partial<SceneCameraDefault>;

function applyCameraPose(
  camera: THREE.Camera,
  controls: OrbitControlsImpl | null,
  pose: NavTarget
) {
  const [px, py, pz] = pose.pos;
  const [qx, qy, qz, qw] = pose.quat;
  camera.position.set(px, py, pz);
  camera.quaternion.set(qx, qy, qz, qw);
  const fov = pose.fov;
  if (fov != null && camera instanceof THREE.PerspectiveCamera) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
  if (controls) {
    syncOrbitControlsToCamera(controls, camera);
  }
}

export function WaypointCamera() {
  const { camera, controls } = useThree();
  const orbit =
    controls && "target" in controls
      ? (controls as OrbitControlsImpl)
      : null;
  const setCameraTweening = useViewerStore((s) => s.setCameraTweening);

  const targetPos = useRef(new THREE.Vector3());
  const targetQuat = useRef(new THREE.Quaternion());
  const isAnimating = useRef(false);
  const animationProgress = useRef(0);
  const startPos = useRef(new THREE.Vector3());
  const startQuat = useRef(new THREE.Quaternion());
  const transitionMs = useRef(1200);
  const prevWaypointId = useRef<string | null>(null);
  const sceneIdRef = useRef<string | null>(null);
  const openingLockedOnLoadRef = useRef(false);

  const finishTween = useCallback(
    (pose: NavTarget) => {
      isAnimating.current = false;
      setCameraTweening(false);
      applyCameraPose(camera, orbit, pose);
    },
    [camera, orbit, setCameraTweening]
  );

  const beginTweenToTarget = useCallback(
    (target: NavTarget) => {
      startPos.current.copy(camera.position);
      startQuat.current.copy(camera.quaternion);

      const [tx, ty, tz] = target.pos;
      const [qx, qy, qz, qw] = target.quat;
      targetPos.current.set(tx, ty, tz);
      targetQuat.current.set(qx, qy, qz, qw);
      transitionMs.current = target.transition_ms ?? 1200;

      animationProgress.current = 0;
      isAnimating.current = true;
      setCameraTweening(true);
    },
    [camera, setCameraTweening]
  );

  const applyNavTarget = useCallback(
    (id: string | null, opts?: { tween?: boolean }) => {
      const state = useViewerStore.getState();
      const target = resolveCameraNavTarget(state.scene, id);
      if (!target) return;

      prevWaypointId.current = id;
      if (opts?.tween === false) {
        isAnimating.current = false;
        setCameraTweening(false);
        applyCameraPose(camera, orbit, target);
        return;
      }
      beginTweenToTarget(target);
    },
    [beginTweenToTarget, camera, orbit, setCameraTweening]
  );

  useEffect(() => {
    const unsub = useViewerStore.subscribe((state, prev) => {
      const id = state.activeWaypointId;
      if (id === prevWaypointId.current) return;

      // Initial scene bootstrap is handled by layout effects (instant opening).
      if (state.scene?.id !== prev.scene?.id) {
        prevWaypointId.current = id;
        return;
      }

      applyNavTarget(id, { tween: true });
    });

    return unsub;
  }, [applyNavTarget]);

  const sceneId = useViewerStore((s) => s.scene?.id ?? null);
  const isLoaded = useViewerStore((s) => s.isLoaded);

  useLayoutEffect(() => {
    if (!sceneId || sceneIdRef.current === sceneId) return;
    sceneIdRef.current = sceneId;
    openingLockedOnLoadRef.current = false;

    const state = useViewerStore.getState();
    if (state.scene?.camera_default) {
      applyNavTarget(OPENING_WAYPOINT_ID, { tween: false });
      return;
    }

    const firstId = state.scene?.waypoints?.[0]?.id ?? null;
    if (firstId) {
      applyNavTarget(firstId, { tween: true });
    } else {
      prevWaypointId.current = null;
    }
  }, [sceneId, applyNavTarget]);

  // Once per scene: lock opening when splat is visible (orbit was off during load).
  useLayoutEffect(() => {
    if (!isLoaded || openingLockedOnLoadRef.current) return;
    const state = useViewerStore.getState();
    if (
      state.activeWaypointId !== OPENING_WAYPOINT_ID ||
      !state.scene?.camera_default
    ) {
      return;
    }
    openingLockedOnLoadRef.current = true;
    applyNavTarget(OPENING_WAYPOINT_ID, { tween: false });
  }, [isLoaded, applyNavTarget]);

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
    if (orbit) {
      syncOrbitControlsToCamera(orbit, camera);
    }

    if (animationProgress.current >= 1) {
      const id = prevWaypointId.current;
      const pose = resolveCameraNavTarget(
        useViewerStore.getState().scene,
        id
      );
      if (pose) finishTween(pose);
      else finishTween({
        id: "snap",
        label: "",
        pos: [camera.position.x, camera.position.y, camera.position.z],
        quat: [
          camera.quaternion.x,
          camera.quaternion.y,
          camera.quaternion.z,
          camera.quaternion.w,
        ],
      });
    }
  });

  return null;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
