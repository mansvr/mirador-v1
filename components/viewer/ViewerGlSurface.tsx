"use client";

import { SceneCanvas } from "@/components/viewer/SceneCanvas";
import { PlayCanvasEmbed } from "@/components/viewer/PlayCanvasEmbed";
import { isPlayCanvasScene } from "@/lib/viewer-engine";
import type { Scene } from "@/lib/types/scene";

interface ViewerGlSurfaceProps {
  scene: Scene;
  heightClass?: string;
}

/** Spark R3F canvas or PlayCanvas iframe — picked from scene.json + env. */
export function ViewerGlSurface({
  scene,
  heightClass = "size-full min-h-0",
}: ViewerGlSurfaceProps) {
  if (isPlayCanvasScene(scene)) {
    return <PlayCanvasEmbed scene={scene} heightClass={heightClass} />;
  }
  return <SceneCanvas scene={scene} heightClass={heightClass} />;
}
