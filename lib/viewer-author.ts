/**
 * Author mode — waypoint / camera capture on viewer routes.
 *
 * - **Off** unless `NEXT_PUBLIC_VIEWER_AUTHOR=1` at build time.
 * - **Hidden** until you press **A** (like perf debug **H**).
 * - Add `?noauthor` to disable on a build that has the flag set.
 */
export function isViewerAuthorEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_VIEWER_AUTHOR !== "1") return false;
  if (typeof window === "undefined") return true;

  const params = new URLSearchParams(window.location.search);
  if (params.has("noauthor")) return false;
  return true;
}

/** SSR / hydration: env baked at build; client refines with `?noauthor`. */
export function isViewerAuthorBuildEnabled(): boolean {
  return process.env.NEXT_PUBLIC_VIEWER_AUTHOR === "1";
}
