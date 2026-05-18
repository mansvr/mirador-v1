"use client";

/**
 * SplatScene — renders the SOGS splat using Spark's SplatMesh.
 * Must be inside <Canvas> and after <SparkInit>.
 */

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { SplatMesh } from "@sparkjsdev/spark";
import { useViewerStore } from "@/lib/store";
import { splatBudget } from "@/lib/scene-utils";
import type { Scene } from "@/lib/types/scene";

interface SplatSceneProps {
  scene: Scene;
  splatSrc: string;
}

export function SplatScene({ scene, splatSrc }: SplatSceneProps) {
  const { scene: threeScene } = useThree();
  const meshRef = useRef<SplatMesh | null>(null);
  const setLoaded = useViewerStore((s) => s.setLoaded);
  const setLoadProgress = useViewerStore((s) => s.setLoadProgress);

  useEffect(() => {
    if (meshRef.current) return;

    // splatBudget is stored for future LoD configuration once Spark exposes
    // a per-object splat budget API in a future minor release.
    void splatBudget(scene);
    const splat = new SplatMesh({ url: splatSrc });
    splat.position.set(0, 0, 0);

    threeScene.add(splat);
    meshRef.current = splat;

    // Spark SplatMesh fires a "loaded" event when the initial data is ready.
    // There is no built-in progress callback in v2; we simulate one.
    setLoadProgress(0.1);
    const checkLoaded = setInterval(() => {
      // SplatMesh.isReady is true when the first LoD level is renderable.
      if ((splat as unknown as { isReady?: boolean }).isReady) {
        clearInterval(checkLoaded);
        setLoadProgress(1);
        setLoaded(true);
      }
    }, 100);

    return () => {
      clearInterval(checkLoaded);
      if (meshRef.current) {
        threeScene.remove(meshRef.current);
        meshRef.current = null;
      }
    };
  }, [threeScene, splatSrc, scene, setLoaded, setLoadProgress]);

  return null;
}
