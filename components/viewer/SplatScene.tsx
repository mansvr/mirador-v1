"use client";

/**
 * SplatScene — renders the SOGS splat using Spark's SplatMesh.
 * Must be inside <Canvas> and after <SparkInit>.
 */

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";
import { useViewerStore } from "@/lib/store";
import { isViewerDebugEnabled } from "@/lib/viewer-debug";
import { viewerDebugRegistry } from "@/lib/viewer-debug-registry";
import {
  resolveSplatBudget,
  splatMeshOptions,
} from "@/lib/spark-viewer-config";
import type { Scene, SceneRender } from "@/lib/types/scene";

interface SplatSceneProps {
  scene: Scene;
  splatSrc: string;
}

const _axisX = new THREE.Vector3(1, 0, 0);
const _axisY = new THREE.Vector3(0, 1, 0);
const _axisZ = new THREE.Vector3(0, 0, 1);
const _qx = new THREE.Quaternion();
const _qy = new THREE.Quaternion();
const _qz = new THREE.Quaternion();

/**
 * World-fixed correction on the splat root only (asset bytes unchanged).
 * Compose as qy * qx * qz so a column vector is rotated by qz, then qx, then qy.
 */
function applyRootOrientation(root: THREE.Group, render: SceneRender) {
  const yaw = THREE.MathUtils.degToRad(render.yaw_correction_deg ?? 0);
  const pitch = THREE.MathUtils.degToRad(render.pitch_correction_deg ?? 0);
  const roll = THREE.MathUtils.degToRad(render.roll_correction_deg ?? 0);
  _qx.setFromAxisAngle(_axisX, pitch);
  _qy.setFromAxisAngle(_axisY, yaw);
  _qz.setFromAxisAngle(_axisZ, roll);
  root.quaternion.copy(_qy).multiply(_qx).multiply(_qz);
}

export function SplatScene({ scene, splatSrc }: SplatSceneProps) {
  const { scene: threeScene } = useThree();
  const rootRef = useRef<THREE.Group | null>(null);
  const setLoaded = useViewerStore((s) => s.setLoaded);
  const setLoadProgress = useViewerStore((s) => s.setLoadProgress);

  useEffect(() => {
    if (rootRef.current) return;

    const budget = resolveSplatBudget(scene);
    viewerDebugRegistry.setSplatBudget(budget);
    setLoadProgress(0.05);

    const root = new THREE.Group();
    applyRootOrientation(root, scene.render);

    const splat = new SplatMesh(
      splatMeshOptions(scene, splatSrc, {
        onProgress: (ev: ProgressEvent) => {
          if (ev.lengthComputable && ev.total > 0) {
            setLoadProgress(0.05 + 0.85 * (ev.loaded / ev.total));
          }
        },
        onLoad: () => {
          // Re-apply after Spark async init so a late loader pass cannot stomp mesh.local transform.
          applyRootOrientation(root, scene.render);
          setLoadProgress(1);
          setLoaded(true);
        },
      })
    );

    splat.position.set(0, 0, 0);
    root.add(splat);
    threeScene.add(root);
    rootRef.current = root;
    if (isViewerDebugEnabled()) {
      viewerDebugRegistry.setSplat(splat);
    }

    // Fallback if onLoad never fires (defensive)
    const fallback = setTimeout(() => {
      setLoadProgress(1);
      setLoaded(true);
    }, 120_000);

    return () => {
      clearTimeout(fallback);
      const r = rootRef.current;
      if (r) {
        threeScene.remove(r);
        const child = r.children[0] as SplatMesh | undefined;
        child?.dispose?.();
        rootRef.current = null;
      }
      setLoaded(false);
      setLoadProgress(0);
      viewerDebugRegistry.setSplat(null);
      viewerDebugRegistry.setSplatBudget(0);
    };
  }, [threeScene, splatSrc, scene, setLoaded, setLoadProgress]);

  return null;
}
