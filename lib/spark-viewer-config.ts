import {
  SplatFileType,
  type SparkRendererOptions,
  type SplatMeshOptions,
} from "@sparkjsdev/spark";
import type { WebGLRenderer } from "three";
import { splatBudget } from "@/lib/scene-utils";
import type { Scene } from "@/lib/types/scene";

/**
 * SparkRenderer + SplatMesh options aligned with scene.json budgets.
 * @see https://sparkjs.dev/docs/ (Level-of-Detail, Performance tuning)
 */
export function resolveSplatBudget(scene: Scene): number {
  return splatBudget(scene);
}

/** Spark format for scene.json `render.format` (SOG = PlayCanvas zip bundle). */
export function sparkFileTypeForScene(scene: Scene): SplatFileType {
  switch (scene.render.format) {
    case "spz":
      return SplatFileType.SPZ;
    case "ply":
      return SplatFileType.PLY;
    case "sog":
    default:
      return SplatFileType.PCSOGSZIP;
  }
}

export function sparkRendererOptions(
  renderer: WebGLRenderer,
  budget: number
): SparkRendererOptions {
  return {
    renderer,
    enableLod: true,
    lodSplatCount: budget,
  };
}

export function splatMeshOptions(
  scene: Scene,
  splatSrc: string,
  handlers: Pick<SplatMeshOptions, "onProgress" | "onLoad">
): SplatMeshOptions {
  const budget = resolveSplatBudget(scene);

  return {
    url: splatSrc,
    maxSplats: budget,
    lod: true,
    enableLod: true,
    ...handlers,
  };
}
