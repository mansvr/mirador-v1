"use client";

/**
 * Tour navigation: clamped look-around + release tween back to active pill home.
 * Author mode uses full OrbitControls instead (see ViewerControls).
 */

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useNavigationMode } from "@/lib/navigation-mode";
import {
  applyTourLeashToCamera,
  clampTourLeashOffset,
  isTourLeashAtHome,
  resolveOrbitLeashConfig,
} from "@/lib/orbit-leash";
import {
  clearTourLeashOffset,
  viewerNavRegistry,
} from "@/lib/viewer-navigation-registry";
import { useViewerStore } from "@/lib/store";

const ROTATE_SPEED = 0.004;
const WHEEL_ZOOM_STEP = 0.08;
const WHEEL_RESET_MS = 400;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function TourOrbitLeash() {
  const mode = useNavigationMode();
  const { camera, controls, gl } = useThree();
  const orbit =
    controls && "target" in controls
      ? (controls as OrbitControlsImpl)
      : null;

  const scene = useViewerStore((s) => s.scene);
  const isLoaded = useViewerStore((s) => s.isLoaded);
  const isCameraTweening = useViewerStore((s) => s.isCameraTweening);
  const activeWaypointId = useViewerStore((s) => s.activeWaypointId);
  const setCameraTweening = useViewerStore((s) => s.setCameraTweening);
  const hasOpening = Boolean(scene?.camera_default);

  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const resetting = useRef(false);
  const resetProgress = useRef(0);
  const resetStart = useRef({ yaw: 0, pitch: 0, zoom: 1 });
  const resetDurationMs = useRef(450);
  const wheelResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tourActive =
    mode === "tour" &&
    !isCameraTweening &&
    (!hasOpening || isLoaded) &&
    viewerNavRegistry.home != null;

  useEffect(() => {
    clearTourLeashOffset();
    resetting.current = false;
  }, [activeWaypointId, scene?.id]);

  useEffect(() => {
    if (mode === "author") {
      dragging.current = false;
      resetting.current = false;
      clearTourLeashOffset();
    }
  }, [mode]);

  useEffect(() => {
    if (!tourActive) return;

    const el = gl.domElement;
    const config = resolveOrbitLeashConfig(scene);

    function beginReleaseReset() {
      const offset = viewerNavRegistry.offset;
      if (isTourLeashAtHome(offset) || resetting.current) return;
      resetStart.current = {
        yaw: offset.yaw,
        pitch: offset.pitch,
        zoom: offset.zoomScale,
      };
      resetDurationMs.current = config.releaseResetMs;
      resetProgress.current = 0;
      resetting.current = true;
      setCameraTweening(true);
    }

    function scheduleWheelReset() {
      if (wheelResetTimer.current) clearTimeout(wheelResetTimer.current);
      wheelResetTimer.current = setTimeout(() => {
        wheelResetTimer.current = null;
        if (!dragging.current) beginReleaseReset();
      }, WHEEL_RESET_MS);
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging.current = true;
      resetting.current = false;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current || resetting.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };

      const offset = viewerNavRegistry.offset;
      offset.yaw -= dx * ROTATE_SPEED;
      offset.pitch -= dy * ROTATE_SPEED;
      clampTourLeashOffset(offset, config);

      const home = viewerNavRegistry.home;
      if (home) applyTourLeashToCamera(camera, orbit, home, offset);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      beginReleaseReset();
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (resetting.current || isCameraTweening) return;

      const offset = viewerNavRegistry.offset;
      const sign = e.deltaY > 0 ? 1 : -1;
      offset.zoomScale += sign * WHEEL_ZOOM_STEP;
      clampTourLeashOffset(offset, resolveOrbitLeashConfig(scene));

      const home = viewerNavRegistry.home;
      if (home) applyTourLeashToCamera(camera, orbit, home, offset);
      scheduleWheelReset();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("wheel", onWheel);
      if (wheelResetTimer.current) clearTimeout(wheelResetTimer.current);
    };
  }, [
    tourActive,
    gl,
    camera,
    orbit,
    scene,
    isCameraTweening,
    setCameraTweening,
  ]);

  useFrame((_, delta) => {
    if (!resetting.current) return;
    const home = viewerNavRegistry.home;
    if (!home) {
      resetting.current = false;
      setCameraTweening(false);
      return;
    }

    const duration = resetDurationMs.current / 1000;
    resetProgress.current = Math.min(resetProgress.current + delta / duration, 1);
    const t = easeInOutCubic(resetProgress.current);
    const offset = viewerNavRegistry.offset;

    offset.yaw = THREE.MathUtils.lerp(resetStart.current.yaw, 0, t);
    offset.pitch = THREE.MathUtils.lerp(resetStart.current.pitch, 0, t);
    offset.zoomScale = THREE.MathUtils.lerp(resetStart.current.zoom, 1, t);

    applyTourLeashToCamera(camera, orbit, home, offset);

    if (resetProgress.current >= 1) {
      clearTourLeashOffset();
      applyTourLeashToCamera(camera, orbit, home, viewerNavRegistry.offset);
      resetting.current = false;
      setCameraTweening(false);
    }
  });

  return null;
}
