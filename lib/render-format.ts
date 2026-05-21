import { SplatFileType } from "@sparkjsdev/spark";
import type { SceneRender, SceneRenderFormat } from "@/lib/types/scene";

const EXT_TO_FORMAT: Record<string, SceneRenderFormat> = {
  sog: "sog",
  spz: "spz",
  ply: "ply",
};

/** Infer Mirador render.format from a URL or R2 filename. */
export function inferFormatFromAssetUrl(assetUrl: string): SceneRenderFormat | null {
  const path = assetUrl.split(/[?#]/, 1)[0] ?? assetUrl;
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_FORMAT[ext] ?? null;
}

/**
 * Format used for Spark decode for the asset about to load.
 * Prefers file extension when it disagrees with scene.json (avoids SOG decoder on .spz).
 */
export function resolveEffectiveFormat(
  render: SceneRender,
  assetUrl: string,
  mobile: boolean
): SceneRenderFormat {
  const declared =
    mobile && render.format_mobile ? render.format_mobile : render.format;
  const inferred = inferFormatFromAssetUrl(assetUrl);
  if (!inferred) return declared;
  if (inferred !== declared && typeof console !== "undefined") {
    console.warn(
      `[mirador] render.format is "${declared}" but "${assetUrl}" looks like ${inferred}; using ${inferred} for Spark.`
    );
  }
  return inferred;
}

export function sparkFileTypeForFormat(
  format: SceneRenderFormat
): SplatFileType {
  switch (format) {
    case "spz":
      return SplatFileType.SPZ;
    case "ply":
      return SplatFileType.PLY;
    case "sog":
    default:
      return SplatFileType.PCSOGSZIP;
  }
}

export function defaultAssetFilename(format: SceneRenderFormat): string {
  switch (format) {
    case "spz":
      return "scene.spz";
    case "ply":
      return "scene.ply";
    case "sog":
    default:
      return "scene.sog";
  }
}

export function defaultMobileAssetFilename(format: SceneRenderFormat): string {
  switch (format) {
    case "spz":
      return "scene-mobile.spz";
    case "ply":
      return "scene-mobile.ply";
    case "sog":
    default:
      return "scene-mobile.sog";
  }
}
