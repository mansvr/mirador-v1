/**
 * Client-safe scene utilities — no Node.js APIs, no server-only imports.
 * Imported by client components (SceneCanvas, etc.).
 */

import type { Scene } from "@/lib/types/scene";
import { r2Url } from "@/lib/r2";

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
 * Resolve the full public URL for the scene's splat asset.
 *
 * - `https://...` — external CDN (e.g. Spark demo asset)
 * - `/file.sog` — same-origin static file from `public/` (no R2)
 * - `scene.sog` — relative filename on R2 at `/<scene-id>/scene.sog`
 */
export function splatUrl(scene: Scene): string {
  return sceneAssetUrl(scene.id, scene.render.url);
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
