/**
 * Cloudflare R2 public URL builder — v0 (public bucket, unguessable UUIDs).
 *
 * At v1, when scenes become private or password-protected, swap this module
 * for signed URL generation via @aws-sdk/s3-request-presigner + @aws-sdk/client-s3
 * pointing at R2's S3-compatible endpoint.
 *
 * R2 bucket structure:
 *   /<scene-id>/scene.json
 *   /<scene-id>/scene.sog
 *   /<scene-id>/thumbnail.webp
 *   /<scene-id>/floorplan.svg
 *   /<scene-id>/thumb_<waypoint-id>.webp
 */

const R2_PUBLIC_URL =
  process.env.NEXT_PUBLIC_R2_URL ??
  process.env.R2_PUBLIC_URL ??
  "";

/** True when a real public bucket URL is configured (not empty / placeholder). */
export function isR2Configured(): boolean {
  const base = R2_PUBLIC_URL.trim();
  return base.length > 0 && !base.includes("placeholder");
}

/**
 * Browser + server URL for a scene asset filename.
 * Absolute paths and https URLs pass through; otherwise R2 or local dev API.
 */
export function resolvePublicAssetUrl(sceneId: string, filename: string): string {
  if (filename.startsWith("http") || filename.startsWith("/")) {
    return filename;
  }
  if (isR2Configured()) {
    return r2Url(sceneId, filename);
  }
  // Encode each path segment so nested paths (e.g. gallery/01.jpg) survive to the
  // catch-all dev asset route without collapsing the slash.
  const encoded = filename
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `/api/scene-asset/${sceneId}/${encoded}`;
}

/**
 * Construct a public R2 URL for a file inside a scene's folder.
 *
 * @param sceneId - The scene ID (e.g. "scene_abc12345")
 * @param filename - File name relative to the scene folder (e.g. "scene.sog")
 */
export function r2Url(sceneId: string, filename: string): string {
  const base = (R2_PUBLIC_URL || "https://placeholder.r2.dev").replace(/\/$/, "");
  return `${base}/${sceneId}/${filename}`;
}

/** Returns the public URL for a scene's thumbnail. */
export function thumbnailUrl(sceneId: string): string {
  return r2Url(sceneId, "thumbnail.webp");
}

/** Returns the public URL for the scene.json manifest. */
export function sceneJsonUrl(sceneId: string): string {
  return r2Url(sceneId, "scene.json");
}
