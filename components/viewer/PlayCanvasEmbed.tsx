"use client";

/**
 * PlayCanvas multi-room tour — iframe embed (tour UI lives inside PlayCanvas).
 * Mirador shell provides listing chrome; GL + ‹ ▶ › bar are in the PC project.
 */

import { useEffect, useMemo } from "react";
import { LoadingOverlay } from "@/components/viewer/LoadingOverlay";
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
  const setLoadProgress = useViewerStore((s) => s.setLoadProgress);
  const setLoadHint = useViewerStore((s) => s.setLoadHint);
  const setLoadError = useViewerStore((s) => s.setLoadError);

  const embedUrl = useMemo(
    () => resolvePlayCanvasEmbedUrl(scene),
    [scene]
  );

  useEffect(() => {
    setScene(scene);
    setLoaded(false);
    setLoadProgress(0.05);
    setLoadHint("Cargando tour PlayCanvas…");
    setLoadError(null);
  }, [
    scene,
    setScene,
    setLoaded,
    setLoadProgress,
    setLoadHint,
    setLoadError,
  ]);

  const handleLoad = () => {
    setLoadProgress(0.92);
    setLoadHint("Iniciando escena…");
    window.setTimeout(() => {
      setLoadProgress(1);
      setLoadHint(null);
      setLoaded(true);
    }, 400);
  };

  const handleError = () => {
    setLoadError(
      "No se pudo cargar el visor PlayCanvas. Comprueba la URL de publicación en scene.json."
    );
    setLoadHint(null);
  };

  return (
    <div
      className={`mirador-gl-root relative w-full overflow-hidden ${heightClass}`}
      style={
        {
          "--mirador-primary": scene.branding?.primary_color ?? "#5e5956",
        } as React.CSSProperties
      }
    >
      <iframe
        title={scene.title}
        src={embedUrl}
        className="absolute inset-0 size-full border-0 bg-black"
        allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
        allowFullScreen
        loading="eager"
        onLoad={handleLoad}
        onError={handleError}
      />
      <LoadingOverlay />
    </div>
  );
}
