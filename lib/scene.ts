import "server-only";

import type { Scene } from "@/lib/types/scene";
import { sceneJsonUrl } from "@/lib/r2";

/**
 * Fetch and parse a scene.json by scene ID.
 *
 * In development: if the R2_PUBLIC_URL is the placeholder value, falls back to
 * loading from the local `scenes/<sceneId>/scene.json` file on disk so you
 * can work without a real R2 bucket.
 *
 * In production: fetches from the R2 public bucket with 60s ISR revalidation.
 */
async function localSceneExists(sceneId: string): Promise<boolean> {
  const fs = await import("fs/promises");
  const path = await import("path");
  try {
    await fs.access(path.join(process.cwd(), "scenes", sceneId, "scene.json"));
    return true;
  } catch {
    return false;
  }
}

export async function fetchScene(sceneId: string): Promise<Scene> {
  const isDev = process.env.NODE_ENV === "development";
  const forceR2 =
    process.env.MIRADOR_USE_R2 === "1" || process.env.MIRADOR_USE_R2 === "true";
  const r2Url_ = process.env.R2_PUBLIC_URL ?? process.env.NEXT_PUBLIC_R2_URL ?? "";
  const isPlaceholder = !r2Url_ || r2Url_.includes("placeholder");

  // Local dev: use scenes/<id>/scene.json when present (public/ splats via render.url paths).
  // Set MIRADOR_USE_R2=1 to test against the real bucket from localhost.
  if (isDev && !forceR2 && (isPlaceholder || (await localSceneExists(sceneId)))) {
    return fetchLocalScene(sceneId);
  }

  const url = sceneJsonUrl(sceneId);

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch scene "${sceneId}": ${res.status} ${res.statusText}`
    );
  }

  return parseSceneJson(await res.json(), sceneId);
}

async function fetchLocalScene(sceneId: string): Promise<Scene> {
  const fs = await import("fs/promises");
  const path = await import("path");

  const filePath = path.join(process.cwd(), "scenes", sceneId, "scene.json");

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return parseSceneJson(JSON.parse(raw), sceneId);
  } catch {
    throw new Error(
      `Local scene not found for "${sceneId}". ` +
        `Create scenes/${sceneId}/scene.json or set NEXT_PUBLIC_R2_URL.`
    );
  }
}

function parseSceneJson(data: unknown, sceneId: string): Scene {
  if (
    typeof data !== "object" ||
    data === null ||
    !("id" in data) ||
    !("render" in data)
  ) {
    throw new Error(`scene.json for "${sceneId}" is malformed`);
  }
  return data as Scene;
}
