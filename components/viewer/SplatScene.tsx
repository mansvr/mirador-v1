"use client";

/**
 * SplatScene — renders the splat (SOG / SPZ / PLY) using Spark's SplatMesh.
 * Must be inside <Canvas> and after <SparkInit>.
 */

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";
import { useViewerStore } from "@/lib/store";
import { viewerDebugRegistry } from "@/lib/viewer-debug-registry";
import { fetchSplatBytes } from "@/lib/fetch-splat-bytes";
import {
  resolveSplatBudget,
  sparkFileTypeForAsset,
  splatMeshOptions,
} from "@/lib/spark-viewer-config";
import { inferFormatFromAssetUrl } from "@/lib/render-format";
import { isMobileClient, resolveSceneRender } from "@/lib/scene-utils";
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

function splatFileLabel(splatSrc: string): string {
  return splatSrc.split("/").pop() ?? "scene.sog";
}

function splatAssetNoun(splatSrc: string): string {
  const ext = inferFormatFromAssetUrl(splatSrc);
  if (ext === "spz") return "archivo .spz";
  if (ext === "ply") return "archivo .ply";
  return "archivo .sog";
}

export function SplatScene({ scene, splatSrc }: SplatSceneProps) {
  const { scene: threeScene } = useThree();
  const rootRef = useRef<THREE.Group | null>(null);
  const setLoaded = useViewerStore((s) => s.setLoaded);
  const setLoadProgress = useViewerStore((s) => s.setLoadProgress);
  const setLoadHint = useViewerStore((s) => s.setLoadHint);
  const setLoadError = useViewerStore((s) => s.setLoadError);

  useEffect(() => {
    if (rootRef.current) return;

    const budget = resolveSplatBudget(scene);
    const fileLabel = splatFileLabel(splatSrc);
    const mobile = isMobileClient();
    viewerDebugRegistry.setSplatBudget(budget);
    setLoadProgress(0.05);
    setLoadHint(
      mobile
        ? `Descargando ${fileLabel}… (puede tardar varios minutos en el teléfono)`
        : "Preparando recorrido 3D…"
    );
    setLoadError(null);

    let cancelled = false;
    let fallback: ReturnType<typeof setTimeout> | undefined;

    const scheduleFallback = (
      mb: number | null,
      sameOrigin: boolean
    ) => {
      const fallbackMs =
        mobile && sameOrigin ? 300_000 : mobile ? 180_000 : 120_000;
      fallback = setTimeout(() => {
        const state = useViewerStore.getState();
        if (state.isLoaded) return;
        state.setAwaitingGpuRender(false);
        const sizePart = mb != null ? `~${mb} MB` : "archivo grande";
        setLoadError(
          `La descarga tardó demasiado (${fileLabel}, ${sizePart}). ` +
            (sameOrigin
              ? "Comprueba que el PC sigue con npm run dev y el teléfono en la misma Wi‑Fi."
              : "En móvil usa Wi‑Fi o sube un splat más pequeño (SOG/SPZ) a R2.")
        );
      }, fallbackMs);
    };

    void (async () => {
      const sameOrigin =
        typeof window !== "undefined" &&
        (splatSrc.startsWith("/") ||
          splatSrc.startsWith(window.location.origin));

      let bytesHint: number | null = null;

      // HEAD is unreliable on Next dev + iOS Safari over LAN; skip on mobile.
      if (sameOrigin && !mobile) {
        try {
          const head = await fetch(splatSrc, {
            method: "HEAD",
            signal: AbortSignal.timeout(8_000),
          });
          if (cancelled) return;
          if (!head.ok) {
            setLoadError(
              `No se pudo cargar el recorrido 3D (${head.status}). Falta el ${splatAssetNoun(splatSrc)} en el servidor.`
            );
            return;
          }
          const len = head.headers.get("content-length");
          if (len) bytesHint = Number.parseInt(len, 10);
        } catch {
          // Continue to GET load.
        }
      }

      if (cancelled || rootRef.current) return;

      const mb =
        bytesHint != null && Number.isFinite(bytesHint)
          ? Math.round(bytesHint / 1_000_000)
          : null;

      scheduleFallback(mb, sameOrigin);

      const root = new THREE.Group();
      applyRootOrientation(root, resolveSceneRender(scene));

      const handlers = {
        onProgress: (ev: ProgressEvent) => {
          if (ev.lengthComputable && ev.total > 0) {
            setLoadProgress(0.1 + 0.8 * (ev.loaded / ev.total));
          }
        },
        onLoad: () => {
          if (fallback) clearTimeout(fallback);
          setLoadHint("Procesando en GPU…");
          applyRootOrientation(root, resolveSceneRender(scene));
          setLoadProgress(0.98);
          useViewerStore.getState().setAwaitingGpuRender(true);
        },
      };

      try {
        let splat: SplatMesh;

        if (mobile) {
          setLoadHint(
            `Descargando ${fileLabel}${mb != null ? ` (~${mb} MB)` : ""}…`
          );
          const buf = await fetchSplatBytes(splatSrc, (loaded, total) => {
            if (total > 0) {
              setLoadProgress(0.1 + 0.75 * (loaded / total));
            }
          });
          if (cancelled) return;

          setLoadHint("Decodificando splats…");
          setLoadProgress(0.88);
          const opts = splatMeshOptions(scene, splatSrc, handlers);
          splat = new SplatMesh({
            ...opts,
            url: undefined,
            fileBytes: buf,
            fileType: sparkFileTypeForAsset(scene, splatSrc),
            fileName: fileLabel,
          });
        } else {
          splat = new SplatMesh(splatMeshOptions(scene, splatSrc, handlers));
        }

        splat.position.set(0, 0, 0);
        root.add(splat);
        threeScene.add(root);
        rootRef.current = root;
        viewerDebugRegistry.setSplat(splat);
      } catch (err) {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : "Error desconocido";
          setLoadError(
            `No se pudo cargar ${fileLabel} en este dispositivo (${msg}).`
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      if (fallback) clearTimeout(fallback);
      const r = rootRef.current;
      if (r) {
        threeScene.remove(r);
        const child = r.children[0] as SplatMesh | undefined;
        child?.dispose?.();
        rootRef.current = null;
      }
      setLoaded(false);
      setLoadProgress(0);
      setLoadHint(null);
      setLoadError(null);
      useViewerStore.getState().setAwaitingGpuRender(false);
      viewerDebugRegistry.setSplat(null);
      viewerDebugRegistry.setSplatBudget(0);
    };
  }, [threeScene, splatSrc, scene, setLoaded, setLoadProgress, setLoadHint, setLoadError]);

  return null;
}
