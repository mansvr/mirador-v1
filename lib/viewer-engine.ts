/**
 * Resolve Spark vs PlayCanvas viewer for a scene.
 * Client-safe — no server-only imports.
 */

import type { Scene, ScenePlayCanvasConfig } from "@/lib/types/scene";

export type ViewerEngine = "spark" | "playcanvas";

function envEngineOverride(): ViewerEngine | null {
  const v = process.env.NEXT_PUBLIC_VIEWER_ENGINE?.trim().toLowerCase();
  if (v === "playcanvas" || v === "spark") return v;
  return null;
}

/** Scene declares PlayCanvas embed config with a usable URL. */
export function hasPlayCanvasConfig(scene: Scene): boolean {
  return Boolean(resolvePlayCanvasConfig(scene)?.embed_url);
}

/**
 * True when the Mirador shell should iframe PlayCanvas instead of Spark R3F.
 * Order: scene.render.engine → env override (requires playcanvas config) → spark default.
 */
export function isPlayCanvasScene(scene: Scene): boolean {
  if (scene.render.engine === "playcanvas") {
    return hasPlayCanvasConfig(scene);
  }
  if (scene.render.engine === "spark") {
    return false;
  }
  const env = envEngineOverride();
  if (env === "playcanvas") {
    return hasPlayCanvasConfig(scene);
  }
  return false;
}

export function resolveViewerEngine(scene: Scene): ViewerEngine {
  return isPlayCanvasScene(scene) ? "playcanvas" : "spark";
}

function pickUrl(pc: ScenePlayCanvasConfig): string | null {
  return (
    pc.embed_url?.trim() ||
    pc.publish_url?.trim() ||
    pc.launch_url?.trim() ||
    null
  );
}

export function resolvePlayCanvasConfig(
  scene: Scene
): ScenePlayCanvasConfig | null {
  const pc = scene.render.playcanvas;
  if (!pc) return null;
  const embed_url = pickUrl(pc);
  if (!embed_url) return null;
  return { ...pc, embed_url };
}

/** Iframe src — strips debug unless explicitly requested. */
export function resolvePlayCanvasEmbedUrl(
  scene: Scene,
  opts?: { debug?: boolean }
): string {
  const pc = resolvePlayCanvasConfig(scene);
  if (!pc?.embed_url) {
    throw new Error(
      `Scene "${scene.id}" has no PlayCanvas embed_url (render.playcanvas).`
    );
  }

  const url = new URL(pc.embed_url);
  const wantDebug = opts?.debug ?? pc.debug === true;
  if (wantDebug) {
    url.searchParams.set("debug", "true");
  } else {
    url.searchParams.delete("debug");
  }
  return url.toString();
}
