"use client";

/**
 * Spark `onLoad` can fire before iOS Safari actually draws splats.
 * Wait for activeSplats or surface a render error instead of a black canvas.
 */

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useViewerStore } from "@/lib/store";
import { viewerDebugRegistry } from "@/lib/viewer-debug-registry";

const VERIFY_FRAMES = 150; // ~2.5s at 60fps

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

    if (framesRef.current >= VERIFY_FRAMES) {
      setAwaitingGpuRender(false);
      setLoadError(
        "El recorrido cargó pero no se puede mostrar en este iPhone (archivo muy pesado o WebGL). Prueba un SOG/SPZ más pequeño o vuelve más tarde."
      );
    }
  });

  return null;
}
