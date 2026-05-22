"use client";

/**
 * SceneCanvas — the root client component for the 3DGS viewer.
 *
 * Renders:
 *   1. An R3F <Canvas> containing SparkInit + SplatScene + ViewerControls + WaypointCamera
 *   2. DOM overlays: LoadingOverlay, HotspotPanel (outside the canvas, same stacking context)
 *
 * The parent server component passes the scene object as a prop.
 */

import { useEffect, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { SparkInit } from "./SparkInit";
import { SplatScene } from "./SplatScene";
import { SplatLoadVerify } from "./SplatLoadVerify";
import { ViewerControls } from "./ViewerControls";
import { TourOrbitLeash } from "./TourOrbitLeash";
import { WaypointCamera } from "./WaypointCamera";
import { HotspotPin } from "./HotspotPin";
import { HotspotPanel } from "./HotspotPanel";
import { LoadingOverlay } from "./LoadingOverlay";
import { ViewerDebugPanel } from "./ViewerDebugPanel";
import { ViewerDebugSampler } from "./ViewerDebugSampler";
import { AuthorCameraBridge } from "./AuthorCameraBridge";
import { ViewerAuthorPanel } from "./ViewerAuthorPanel";
import { useViewerStore } from "@/lib/store";
import { isViewerDebugEnabled } from "@/lib/viewer-debug";
import {
  isViewerAuthorBuildEnabled,
  isViewerAuthorEnabled,
} from "@/lib/viewer-author";
import { splatUrl } from "@/lib/scene-utils";
import { getCanvasDpr } from "@/lib/canvas-dpr";
import { getCanvasGlProps } from "@/lib/canvas-gl";
import { resolveSplatBudget } from "@/lib/spark-viewer-config";
import { trackSceneLoaded } from "@/lib/analytics";
import type { Scene } from "@/lib/types/scene";

interface SceneCanvasProps {
  scene: Scene;
  /**
   * Layout classes for the root wrapper. Parent should give a definite height
   * (e.g. h-dvh, h-[50dvh], or flex-1 min-h-0) so R3F can measure the GL surface.
   */
  heightClass?: string;
}

/** Baked at build time when `NEXT_PUBLIC_VIEWER_DEBUG=1` on Vercel Production. */
const viewerDebugBuildEnabled =
  process.env.NEXT_PUBLIC_VIEWER_DEBUG === "1" ||
  process.env.NODE_ENV === "development";

function useViewerDebugActive() {
  return useSyncExternalStore(
    () => () => {},
    () => isViewerDebugEnabled(),
    () => viewerDebugBuildEnabled
  );
}

const viewerAuthorBuildEnabled = isViewerAuthorBuildEnabled();

function useViewerAuthorActive() {
  return useSyncExternalStore(
    () => () => {},
    () => isViewerAuthorEnabled(),
    () => viewerAuthorBuildEnabled
  );
}

export function SceneCanvas({ scene, heightClass = "size-full min-h-0" }: SceneCanvasProps) {
  const debugPerfEnabled = useViewerDebugActive();
  const authorEnabled = useViewerAuthorActive();
  const setScene = useViewerStore((s) => s.setScene);
  const isLoaded = useViewerStore((s) => s.isLoaded);
  const dpr =
    typeof window !== "undefined" ? getCanvasDpr() : 1;

  // Bootstrap the store with scene data
  useEffect(() => {
    setScene(scene);
  }, [scene, setScene]);

  // Track load event once
  useEffect(() => {
    if (isLoaded) {
      trackSceneLoaded(scene.id, scene.title);
    }
  }, [isLoaded, scene.id, scene.title]);

  const src = splatUrl(scene);
  const budget = resolveSplatBudget(scene);
  const opening = scene.camera_default;

  return (
    <div
      className={`mirador-gl-root relative w-full overflow-hidden ${heightClass}`}
      // Inject branding CSS custom properties for hotspot/UI theming
      style={
        {
          "--mirador-primary": scene.branding?.primary_color ?? "#5e5956",
        } as React.CSSProperties
      }
    >
      {/* ── R3F Canvas ────────────────────────────────────────────────── */}
      <Canvas
        dpr={dpr}
        gl={getCanvasGlProps()}
        camera={
          opening
            ? {
                fov: opening.fov ?? 60,
                near: 0.01,
                far: 1000,
                position: opening.pos,
                quaternion: opening.quat,
              }
            : {
                fov: 60,
                near: 0.01,
                far: 1000,
                position: [0, 1.6, 3],
              }
        }
        className="w-full h-full"
      >
        {/* Spark renderer must mount before SplatMesh */}
        <SparkInit splatBudget={budget} />

        {/* The actual splat */}
        <SplatScene scene={scene} splatSrc={src} />
        <SplatLoadVerify />

        {/* Camera controls */}
        <ViewerControls />
        <TourOrbitLeash />
        <WaypointCamera />

        {/* Hotspot pins (inside canvas, drei Html for depth) */}
        {scene.hotspots?.map((hotspot) => (
          <HotspotPin key={hotspot.id} hotspot={hotspot} sceneId={scene.id} />
        ))}

        {authorEnabled ? <AuthorCameraBridge /> : null}
        {debugPerfEnabled ? <ViewerDebugSampler /> : null}
      </Canvas>

      {/* ── DOM overlays (outside canvas, same stacking context) ──────── */}
      {authorEnabled ? <ViewerAuthorPanel scene={scene} /> : null}
      {debugPerfEnabled ? <ViewerDebugPanel /> : null}
      <LoadingOverlay />
      <HotspotPanel scene={scene} />
    </div>
  );
}
