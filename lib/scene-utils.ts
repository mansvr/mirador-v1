/**
 * Client-safe scene utilities — no Node.js APIs, no server-only imports.
 * Imported by client components (SceneCanvas, etc.).
 */

import type { Scene, SceneRender } from "@/lib/types/scene";
import { r2Url } from "@/lib/r2";

const MOBILE_UA = /Mobi|Android|iPhone|iPad/i;

export function isMobileClient(): boolean {
  return (
    typeof navigator !== "undefined" && MOBILE_UA.test(navigator.userAgent)
  );
}

/**
 * Resolve a scene-relative asset URL (thumbnail, floorplan, etc.).
 * Same rules as splatUrl: absolute http(s), leading `/`, else R2.
 */
export function sceneAssetUrl(sceneId: string, filename: string): string {
  if (filename.startsWith("http") || filename.startsWith("/")) {
    return filename;
  }
  return r2Url(sceneId, filename);
}

/**
 * Effective render block for this device (mobile URL + optional orientation overrides).
 */
export function resolveSceneRender(scene: Scene): SceneRender {
  const r = scene.render;
  const useMobile = isMobileClient() && !!r.url_mobile;
  if (!useMobile) {
    return r;
  }
  return {
    ...r,
    url: r.url_mobile!,
    yaw_correction_deg:
      r.yaw_correction_deg_mobile ?? r.yaw_correction_deg,
    pitch_correction_deg:
      r.pitch_correction_deg_mobile ?? r.pitch_correction_deg,
    roll_correction_deg:
      r.roll_correction_deg_mobile ?? r.roll_correction_deg,
  };
}

/**
 * Resolve the full public URL for the scene's splat asset.
 *
 * - `https://...` — external CDN (e.g. Spark demo asset)
 * - `/file.sog` — same-origin static file from `public/` (no R2)
 * - `scene.sog` — relative filename on R2 at `/<scene-id>/scene.sog`
 * - On mobile, uses `render.url_mobile` when set (e.g. `scene-mobile.sog`)
 */
export function splatUrl(scene: Scene): string {
  return sceneAssetUrl(scene.id, resolveSceneRender(scene).url);
}

/**
 * Returns the splat budget appropriate for the current device type.
 * Defaults to desktop if navigator is unavailable (SSR).
 */
export function splatBudget(scene: Scene): number {
  const isMobile =
    typeof navigator !== "undefined" &&
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  return isMobile
    ? (scene.render.splat_budget_mobile ?? 750_000)
    : (scene.render.splat_budget_desktop ?? 2_000_000);
}
