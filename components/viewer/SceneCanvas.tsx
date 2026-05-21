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

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { SparkInit } from "./SparkInit";
import { SplatScene } from "./SplatScene";
import { ViewerControls } from "./ViewerControls";
import { WaypointCamera } from "./WaypointCamera";
import { HotspotPin } from "./HotspotPin";
import { HotspotPanel } from "./HotspotPanel";
import { LoadingOverlay } from "./LoadingOverlay";
import { ViewerDebugPanel } from "./ViewerDebugPanel";
import { ViewerDebugSampler } from "./ViewerDebugSampler";
import { useViewerStore } from "@/lib/store";
import { isViewerDebugEnabled } from "@/lib/viewer-debug";
import { splatUrl } from "@/lib/scene-utils";
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

const debugPerfEnabled =
  typeof window !== "undefined"
    ? isViewerDebugEnabled()
    : process.env.NODE_ENV === "development";

export function SceneCanvas({ scene, heightClass = "size-full min-h-0" }: SceneCanvasProps) {
  const setScene = useViewerStore((s) => s.setScene);
  const isLoaded = useViewerStore((s) => s.isLoaded);

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
        gl={{
          // WebGL2 is required for Spark
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        camera={{
          fov: 60,
          near: 0.01,
          far: 1000,
          position: [0, 1.6, 3],
        }}
        className="w-full h-full"
      >
        {/* Spark renderer must mount before SplatMesh */}
        <SparkInit splatBudget={budget} />

        {/* The actual splat */}
        <SplatScene scene={scene} splatSrc={src} />

        {/* Camera controls */}
        <ViewerControls />
        <WaypointCamera />

        {/* Hotspot pins (inside canvas, drei Html for depth) */}
        {scene.hotspots?.map((hotspot) => (
          <HotspotPin key={hotspot.id} hotspot={hotspot} sceneId={scene.id} />
        ))}

        {debugPerfEnabled ? <ViewerDebugSampler /> : null}
      </Canvas>

      {/* ── DOM overlays (outside canvas, same stacking context) ──────── */}
      {debugPerfEnabled ? <ViewerDebugPanel /> : null}
      <LoadingOverlay />
      <HotspotPanel scene={scene} />
    </div>
  );
}
