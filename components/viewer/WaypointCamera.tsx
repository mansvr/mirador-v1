"use client";

/**
 * WaypointCamera — animates the camera to the active waypoint's pos/quat.
 * Uses a smooth spring-like interpolation via useFrame.
 */

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useViewerStore, getActiveWaypoint } from "@/lib/store";

export function WaypointCamera() {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetQuat = useRef(new THREE.Quaternion());
  const isAnimating = useRef(false);
  const animationProgress = useRef(0);
  const startPos = useRef(new THREE.Vector3());
  const startQuat = useRef(new THREE.Quaternion());
  const transitionMs = useRef(1200);

  // Subscribe to active waypoint changes
  useEffect(() => {
    return useViewerStore.subscribe((state) => {
      const wp = getActiveWaypoint(state);
      if (!wp) return;

      // Capture current camera position as the animation start
      startPos.current.copy(camera.position);
      startQuat.current.copy(camera.quaternion);

      // Set the target
      const [tx, ty, tz] = wp.pos;
      const [qx, qy, qz, qw] = wp.quat;
      targetPos.current.set(tx, ty, tz);
      targetQuat.current.set(qx, qy, qz, qw);
      transitionMs.current = wp.transition_ms ?? 1200;

      // Reset progress and start animation
      animationProgress.current = 0;
      isAnimating.current = true;
    });
  }, [camera]);

  useFrame((_, delta) => {
    if (!isAnimating.current) return;

    const duration = transitionMs.current / 1000; // convert ms → seconds
    animationProgress.current = Math.min(
      animationProgress.current + delta / duration,
      1
    );

    // Ease-in-out cubic
    const t = easeInOutCubic(animationProgress.current);

    camera.position.lerpVectors(startPos.current, targetPos.current, t);
    camera.quaternion.slerpQuaternions(startQuat.current, targetQuat.current, t);

    if (animationProgress.current >= 1) {
      isAnimating.current = false;
    }
  });

  return null;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
