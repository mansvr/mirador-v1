/**
 * Client-safe scene utilities — no Node.js APIs, no server-only imports.
 * Imported by client components (SceneCanvas, etc.).
 */

import type { Scene } from "@/lib/types/scene";
import { r2Url } from "@/lib/r2";

/**
 * Resolve the full public URL for the scene's splat asset.
 * Handles absolute URLs (for dev/demo) and relative filenames (R2).
 */
export function splatUrl(scene: Scene): string {
  const { render } = scene;
  if (render.url.startsWith("http")) {
    return render.url;
  }
  return r2Url(scene.id, render.url);
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
