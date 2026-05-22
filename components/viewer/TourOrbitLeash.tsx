"use client";

/**
 * Tour navigation: damped fixed-pivot look-around + soft spring back to pill home.
 * Author mode uses full OrbitControls instead (see ViewerControls).
 */

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useNavigationMode } from "@/lib/navigation-mode";
import {
  applyTourLeashToCamera,
  clampTourLeashOffset,
  dampTourLeashOffset,
  isTourLeashAtHome,
  resolveOrbitLeashConfig,
} from "@/lib/orbit-leash";
import {
  clearTourLeashOffset,
  viewerNavRegistry,
} from "@/lib/viewer-navigation-registry";
import { useViewerStore } from "@/lib/store";

const ROTATE_SPEED = 0.004;
const HOME_EPSILON = 0.0008;

const _dest = { yaw: 0, pitch: 0, zoomScale: 1 };

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
  const resetting = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const leashConfig = useRef(resolveOrbitLeashConfig(scene));

  const tourReady =
    mode === "tour" &&
    (!hasOpening || isLoaded) &&
    viewerNavRegistry.home != null;

  /** Pointer handlers off during pill tweens; leash frame loop stays on for release spring. */
  const pointerActive = tourReady && !isCameraTweening;

  useEffect(() => {
    leashConfig.current = resolveOrbitLeashConfig(scene);
  }, [scene]);

  useEffect(() => {
    clearTourLeashOffset();
    dragging.current = false;
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
    if (!pointerActive) return;

    const el = gl.domElement;
    const config = leashConfig.current;

    function beginReleaseReset() {
      if (resetting.current) return;
      const smooth = viewerNavRegistry.offsetSmooth;
      const target = viewerNavRegistry.offset;
      if (
        isTourLeashAtHome(smooth, HOME_EPSILON) &&
        isTourLeashAtHome(target, HOME_EPSILON)
      ) {
        return;
      }
      viewerNavRegistry.offset.yaw = 0;
      viewerNavRegistry.offset.pitch = 0;
      resetting.current = true;
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

      const target = viewerNavRegistry.offset;
      target.yaw -= dx * ROTATE_SPEED;
      target.pitch -= dy * ROTATE_SPEED;
      clampTourLeashOffset(target, config);
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
    };
  }, [pointerActive, gl, scene]);

  useFrame((_, delta) => {
    if (!tourReady) return;
    const home = viewerNavRegistry.home;
    if (!home) return;
    if (isCameraTweening && !resetting.current) return;

    const config = leashConfig.current;
    const target = viewerNavRegistry.offset;
    const smooth = viewerNavRegistry.offsetSmooth;

    const needsDamp =
      dragging.current ||
      resetting.current ||
      !isTourLeashAtHome(smooth, HOME_EPSILON) ||
      !isTourLeashAtHome(target, HOME_EPSILON);

    if (!needsDamp) return;

    if (resetting.current) {
      _dest.yaw = 0;
      _dest.pitch = 0;
    } else {
      _dest.yaw = target.yaw;
      _dest.pitch = target.pitch;
    }

    const lambda = resetting.current
      ? config.releaseDamping
      : config.dragDamping;

    const settled = dampTourLeashOffset(
      smooth,
      _dest.yaw,
      _dest.pitch,
      lambda,
      delta,
      HOME_EPSILON
    );

    applyTourLeashToCamera(camera, orbit, home, smooth);

    if (resetting.current && settled) {
      clearTourLeashOffset();
      applyTourLeashToCamera(camera, orbit, home, viewerNavRegistry.offsetSmooth);
      resetting.current = false;
    }
  });

  return null;
}
