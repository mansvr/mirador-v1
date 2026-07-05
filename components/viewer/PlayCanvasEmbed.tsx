"use client";

/**
 * PlayCanvas multi-room tour — iframe embed (tour UI lives inside PlayCanvas).
 * Uses iframeless publish URL (/e/p/) — no PlayCanvas footer bar.
 * Single loader: PlayCanvas mirador-loading-screen.js only (no Mirador overlay).
 */

import { useEffect, useMemo } from "react";
import { resolvePlayCanvasEmbedUrl } from "@/lib/viewer-engine";
import { useViewerStore } from "@/lib/store";
import type { Scene } from "@/lib/types/scene";

interface PlayCanvasEmbedProps {
  scene: Scene;
  heightClass?: string;
}

export function PlayCanvasEmbed({
  scene,
  heightClass = "size-full min-h-0",
}: PlayCanvasEmbedProps) {
  const setScene = useViewerStore((s) => s.setScene);
  const setLoaded = useViewerStore((s) => s.setLoaded);

  const embedUrl = useMemo(
    () => resolvePlayCanvasEmbedUrl(scene),
    [scene]
  );

  useEffect(() => {
    setScene(scene);
    // Spark overlay skipped — PC loading screen handles preload UX inside iframe.
    setLoaded(true);
  }, [scene, setScene, setLoaded]);

  return (
    <div
      className={`mirador-gl-root relative w-full overflow-hidden bg-[#121212] ${heightClass}`}
      style={
        {
          "--mirador-primary": scene.branding?.primary_color ?? "#5e5956",
        } as React.CSSProperties
      }
    >
      <iframe
        title={scene.title}
        src={embedUrl}
        className="absolute inset-0 size-full border-0 bg-[#121212]"
        allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
        allowFullScreen
        loading="eager"
      />
    </div>
  );
}
