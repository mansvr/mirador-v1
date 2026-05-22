"use client";

/**
 * Spark `onLoad` can fire before iOS Safari actually draws splats.
 * Wait for activeSplats or surface a render error instead of a black canvas.
 */

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useViewerStore } from "@/lib/store";
import { isMobileClient } from "@/lib/scene-utils";
import { viewerDebugRegistry } from "@/lib/viewer-debug-registry";

/** iOS needs a shorter window; desktop SPZ can take longer before activeSplats > 0. */
function verifyFrameBudget(): number {
  return isMobileClient() ? 180 : 420;
}

export function SplatLoadVerify() {
  const { gl } = useThree();
  const awaiting = useViewerStore((s) => s.awaitingGpuRender);
  const setLoaded = useViewerStore((s) => s.setLoaded);
  const setLoadError = useViewerStore((s) => s.setLoadError);
  const setAwaitingGpuRender = useViewerStore((s) => s.setAwaitingGpuRender);
  const framesRef = useRef(0);

  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = (event: Event) => {
      event.preventDefault();
      setAwaitingGpuRender(false);
      setLoadError(
        "WebGL se reinició en este dispositivo. Prueba cerrar otras pestañas o un recorrido más ligero."
      );
    };
    canvas.addEventListener("webglcontextlost", onLost);
    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, [gl, setAwaitingGpuRender, setLoadError]);

  useEffect(() => {
    if (!awaiting) framesRef.current = 0;
  }, [awaiting]);

  useFrame(() => {
    if (!awaiting) return;

    framesRef.current += 1;
    const spark = viewerDebugRegistry.spark;
    const splat = viewerDebugRegistry.splat;
    const err =
      splat?.generatorError ?? splat?.covGeneratorError ?? null;

    if (err) {
      setAwaitingGpuRender(false);
      setLoadError(
        "No se pudo decodificar el recorrido 3D en este dispositivo."
      );
      return;
    }

    if (spark && spark.activeSplats > 0) {
      setAwaitingGpuRender(false);
      setLoaded(true);
      return;
    }

    if (framesRef.current >= verifyFrameBudget()) {
      setAwaitingGpuRender(false);
      const deviceHint = isMobileClient()
        ? "en este dispositivo móvil"
        : "en este navegador";
      setLoadError(
        `El recorrido cargó pero no se puede mostrar ${deviceHint} (archivo pesado o WebGL). Recarga la página, cierra otras pestañas, o usa un splat más pequeño.`
      );
    }
  });

  return null;
}
