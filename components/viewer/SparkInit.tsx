"use client";

/**
 * SparkInit — mounts a SparkRenderer onto the R3F WebGLRenderer.
 * Must be rendered inside a <Canvas> (i.e. inside the R3F scene graph).
 *
 * SparkRenderer wraps THREE.WebGLRenderer and adds the LoD streaming pipeline.
 * We retrieve the renderer via useThree() and add the SparkRenderer to the scene.
 */

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { SparkRenderer } from "@sparkjsdev/spark";
import { isViewerDebugEnabled } from "@/lib/viewer-debug";
import { viewerDebugRegistry } from "@/lib/viewer-debug-registry";
import { sparkRendererOptions } from "@/lib/spark-viewer-config";

interface SparkInitProps {
  splatBudget: number;
}

export function SparkInit({ splatBudget }: SparkInitProps) {
  const { gl, scene } = useThree();
  const sparkRef = useRef<SparkRenderer | null>(null);

  useEffect(() => {
    if (sparkRef.current) return;

    const spark = new SparkRenderer(sparkRendererOptions(gl, splatBudget));
    scene.add(spark);
    sparkRef.current = spark;
    if (isViewerDebugEnabled()) {
      viewerDebugRegistry.setSpark(spark);
    }

    return () => {
      if (sparkRef.current) {
        scene.remove(sparkRef.current);
        sparkRef.current = null;
      }
      viewerDebugRegistry.setSpark(null);
    };
  }, [gl, scene, splatBudget]);

  return null;
}
