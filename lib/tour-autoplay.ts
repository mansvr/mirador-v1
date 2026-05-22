import type { Scene } from "@/lib/types/scene";
import { navPillsForScene, navStepIndex, navStepSibling } from "@/lib/viewer-camera";

export const TOUR_AUTOPLAY_INITIAL_DELAY_MS = 2600;
export const TOUR_AUTOPLAY_DWELL_MS = 2600;
/** Autoplay nav tweens only — manual pill/chevron speed unchanged. */
export const TOUR_AUTOPLAY_TWEEN_MULTIPLIER = 3;

export function resolveNavTransitionMs(
  baseMs: number | undefined,
  isAutoplay: boolean
): number {
  const base = baseMs ?? 1200;
  return isAutoplay ? base * TOUR_AUTOPLAY_TWEEN_MULTIPLIER : base;
}

export const NAV_TWEEN_COMPLETE_EVENT = "mirador-nav-tween-complete";

export function emitNavTweenComplete(waypointId: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(NAV_TWEEN_COMPLETE_EVENT, { detail: { waypointId } })
  );
}

export function nextAutoplayWaypointId(
  scene: Scene,
  currentId: string | null
): string | null {
  const pills = navPillsForScene(scene);
  if (pills.length < 2) return null;
  const i = navStepIndex(pills, currentId);
  const from = i < 0 ? 0 : i;
  const next = navStepSibling(pills, pills[from]!.id, 1, true);
  return next?.id ?? null;
}

export function canRunTourAutoplay(scene: Scene | null): boolean {
  if (!scene) return false;
  return navPillsForScene(scene).length >= 2;
}
