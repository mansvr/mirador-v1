"use client";

/**
 * Inside <Canvas>: stats.js begin/end + Spark / WebGL metric sampling.
 */

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type Stats from "stats.js";
import { viewerDebugRegistry } from "@/lib/viewer-debug-registry";

export function ViewerDebugSampler() {
  const { gl } = useThree();
  const statsRef = useRef<Stats | null>(null);
  const lastTRef = useRef(0);

  useEffect(() => {
    let stats: Stats | null = null;
    let destroyed = false;

    void import("stats.js").then((mod) => {
      if (destroyed) return;
      const StatsCtor = mod.default;
      stats = new StatsCtor();
      stats.showPanel(0);
      document.body.appendChild(stats.dom);
      statsRef.current = stats;
      viewerDebugRegistry.setStatsDom(stats.dom);
    });

    return () => {
      destroyed = true;
      if (stats?.dom.parentElement) {
        stats.dom.parentElement.removeChild(stats.dom);
      }
      statsRef.current = null;
      viewerDebugRegistry.setStatsDom(null);
    };
  }, []);

  useFrame(() => {
    if (viewerDebugRegistry.uiVisible) {
      statsRef.current?.begin();
    }
  }, -1000);

  useFrame(() => {
    const now = performance.now();
    const m = viewerDebugRegistry.metrics;
    const spark = viewerDebugRegistry.spark;
    const splat = viewerDebugRegistry.splat;

    if (m && lastTRef.current > 0) {
      const frameMs = now - lastTRef.current;
      m.frameMs = Math.round(frameMs * 10) / 10;
      m.fps = frameMs > 0 ? Math.round(1000 / frameMs) : 0;
      m.dpr = gl.getPixelRatio();

      const info = gl.info.render;
      m.drawCalls = info.calls;
      m.triangles = info.triangles;
      m.points = info.points;

      m.totalSplats = splat?.numSplats ?? splat?.packedSplats?.numSplats ?? 0;
      m.activeSplats = spark?.activeSplats ?? 0;
      m.maxSplats = spark?.maxSplats ?? 0;
      m.lodSplats = spark?.lodSplatCount ?? 0;
      m.splatBudget = viewerDebugRegistry.splatBudget;
      m.sorting = spark?.sorting ?? false;
      m.msSinceSort =
        spark?.lastSortTime && spark.lastSortTime > 0
          ? Math.round(now - spark.lastSortTime)
          : 0;
    }

    lastTRef.current = now;

    if (viewerDebugRegistry.uiVisible) {
      statsRef.current?.end();
    }
  });

  return null;
}
