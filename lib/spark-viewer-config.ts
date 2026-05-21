import type { SparkRendererOptions, SplatMeshOptions } from "@sparkjsdev/spark";
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
