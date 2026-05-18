/**
 * v0 static slug → scene id map for branded microsite URLs
 * `/[tenant]/[property]` (e.g. `/umbral/best-splat-50k`).
 *
 * Does not overlap with `/v/[sceneId]` — that route uses a static `v` segment.
 */

const TENANT_SCENES: Record<string, Record<string, string>> = {
  umbral: {
    "best-splat-50k": "scene_best50000",
    "apto-502-chapinero": "scene_demo00",
  },
};

/**
 * Resolve `scene.json` id from URL segments (case-insensitive).
 * Returns `null` if the slug pair is unknown.
 */
export function resolveSceneIdFromSlugs(
  tenant: string,
  property: string
): string | null {
  const t = tenant.trim().toLowerCase();
  const p = decodeURIComponent(property.trim()).toLowerCase();
  return TENANT_SCENES[t]?.[p] ?? null;
}

/** Slugs that appear in URLs (for docs / admin copy-paste). */
export function listTenantRoutes(): { tenant: string; property: string; sceneId: string }[] {
  const out: { tenant: string; property: string; sceneId: string }[] = [];
  for (const [tenant, props] of Object.entries(TENANT_SCENES)) {
    for (const [property, sceneId] of Object.entries(props)) {
      out.push({ tenant, property, sceneId });
    }
  }
  return out;
}
