/**
 * When true, mounts stats.js + a lil-gui performance panel on the viewer.
 *
 * - **Development:** on by default (panel starts hidden; press **H**).
 * - **Production:** off unless `NEXT_PUBLIC_VIEWER_DEBUG=1` or `?debug` on the URL.
 */
export function isViewerDebugEnabled(): boolean {
  const envOn =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_VIEWER_DEBUG === "1";

  if (!envOn) return false;
  if (typeof window === "undefined") return true;

  const params = new URLSearchParams(window.location.search);
  if (params.has("nodebug")) return false;
  return true;
}
