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
  "https://placeholder.r2.dev";

/**
 * Construct a public R2 URL for a file inside a scene's folder.
 *
 * @param sceneId - The scene ID (e.g. "scene_abc12345")
 * @param filename - File name relative to the scene folder (e.g. "scene.sog")
 */
export function r2Url(sceneId: string, filename: string): string {
  const base = R2_PUBLIC_URL.replace(/\/$/, "");
  return `${base}/${sceneId}/${filename}`;
}

/** Returns the public URL for a scene's .sog (or other format) asset. */
export function sceneAssetUrl(sceneId: string, renderUrl: string): string {
  return r2Url(sceneId, renderUrl);
}

/** Returns the public URL for a scene's thumbnail. */
export function thumbnailUrl(sceneId: string): string {
  return r2Url(sceneId, "thumbnail.webp");
}

/** Returns the public URL for the scene.json manifest. */
export function sceneJsonUrl(sceneId: string): string {
  return r2Url(sceneId, "scene.json");
}
