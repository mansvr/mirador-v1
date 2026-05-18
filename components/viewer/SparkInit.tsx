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

export function SparkInit() {
  const { gl, scene } = useThree();
  const sparkRef = useRef<SparkRenderer | null>(null);

  useEffect(() => {
    if (sparkRef.current) return; // already mounted

    const spark = new SparkRenderer({ renderer: gl });
    scene.add(spark);
    sparkRef.current = spark;

    return () => {
      if (sparkRef.current) {
        scene.remove(sparkRef.current);
        sparkRef.current = null;
      }
    };
  }, [gl, scene]);

  return null;
}
