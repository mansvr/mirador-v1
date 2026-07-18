// TypeScript types for Mirador scene.json (schema v1)
// Derived from schemas/scene.v1.schema.json — keep in sync manually.

export type SceneMetricVerifiedBy = "apriltag" | "lidar" | "manual" | "unverified";

export interface SceneMetric {
  area_m2?: number;
  ceiling_m?: number;
  rooms?: number;
  bathrooms?: number;
  verified_by?: SceneMetricVerifiedBy;
  verified_at?: string; // ISO date string
}

export type SceneRenderFormat = "sog" | "spz" | "ply";

export type SceneRenderEngine = "spark" | "playcanvas";

/** PlayCanvas multi-room embed (Editor publish or self-hosted build URL). */
export interface ScenePlayCanvasConfig {
  /** Primary iframe src — publish URL preferred in production. */
  embed_url?: string;
  /** Alias fields — `generate-scene-json` may set these; embed_url wins. */
  publish_url?: string;
  launch_url?: string;
  project_id?: number;
  /** R2-relative manifest v2 filename in scene folder, e.g. manifest.json */
  manifest_url?: string;
  manifest_schema?: "2";
  property_id?: string;
  /** Include ?debug=true on embed (default false in production). */
  debug?: boolean;
  /** Future: R2-hosted PlayCanvas build index.html (replaces iframe to playcanv.as). */
  self_host_url?: string;
  /** Editor asset ids — ops reference only, not used at runtime in iframe v1. */
  editor_script_assets?: {
    splat_portal_manager?: number;
    tour_controller?: number;
    mirador_loading_screen?: number;
  };
}

export interface SceneRender {
  format: SceneRenderFormat;
  /**
   * Viewer runtime. Default spark when omitted.
   * playcanvas requires render.playcanvas.embed_url (or publish/launch alias).
   */
  engine?: SceneRenderEngine;
  /** Required when engine is playcanvas. */
  playcanvas?: ScenePlayCanvasConfig;
  /**
   * Optional when `url_mobile` uses a different extension (e.g. desktop SOG, mobile SPZ).
   * Defaults to `format`.
   */
  format_mobile?: SceneRenderFormat;
  /** Filename relative to the scene's R2 folder, e.g. "scene.sog" or "scene.spz" */
  url: string;
  /**
   * Optional lighter splat for phones/tablets (e.g. "scene-mobile.sog" or "scene-mobile.spz").
   * Same folder as `url` on R2, or same-origin path in `public/` for local dev.
   */
  url_mobile?: string;
  splat_budget_desktop?: number;
  splat_budget_mobile?: number;
  /** World-space up vector, defaults to [0, 1, 0] */
  up_axis?: [number, number, number];
  /**
   * Extra rotation around world +Y (degrees) on the splat root in Three.js.
   * Use 180 when the scene faces “backward” vs orbit controls / marketing north.
   */
  yaw_correction_deg?: number;
  /**
   * Extra rotation around world +X (degrees). Use 180 when the splat reads
   * upside-down (training vs Three.js Y-up); does not modify the asset file.
   */
  pitch_correction_deg?: number;
  /** Extra rotation around world +Z (degrees); rare, for rolled exports. */
  roll_correction_deg?: number;
  /** When `url_mobile` is used; falls back to `yaw_correction_deg` if omitted. */
  yaw_correction_deg_mobile?: number;
  /** When `url_mobile` is used; falls back to `pitch_correction_deg` if omitted. */
  pitch_correction_deg_mobile?: number;
  /** When `url_mobile` is used; falls back to `roll_correction_deg` if omitted. */
  roll_correction_deg_mobile?: number;
}

export interface SceneContextMacro {
  type: "mapbox3d" | "google3d";
  lat: number;
  lng: number;
  zoom?: number;
}

export interface SceneContextMeso {
  type: "pano360";
  url: string;
  label?: string;
}

export interface SceneContext {
  macro?: SceneContextMacro;
  meso?: SceneContextMeso[];
}

export interface SceneCameraDefault {
  pos: [number, number, number];
  quat: [number, number, number, number];
  /** Vertical FOV in degrees; defaults to canvas camera (60) when omitted */
  fov?: number;
}

export interface SceneWaypoint {
  id: string;
  label: string;
  /** [x, y, z] camera position in world space */
  pos: [number, number, number];
  /** [x, y, z, w] camera orientation quaternion */
  quat: [number, number, number, number];
  /** Camera tween duration in ms, default 1200 */
  transition_ms?: number;
  /** Filename relative to scene R2 folder */
  thumbnail_url?: string;
}

export type HotspotType = "info" | "cta" | "media";

export interface HotspotPayload {
  title?: string;
  body_md?: string;
  image_urls?: string[];
  pdf_url?: string | null;
  video_url?: string | null;
  cta_label?: string;
  cta_href?: string;
}

export interface SceneHotspot {
  id: string;
  pos: [number, number, number];
  type: HotspotType;
  payload?: HotspotPayload;
}

export interface ScenePortal {
  id: string;
  pos: [number, number, number];
  normal?: [number, number, number];
  label?: string;
  target_scene_id: string;
}

export interface SceneListing {
  address?: string;
  neighborhood?: string;
  city?: string;
  description_md?: string;
  /**
   * Longer case-study / blog-style body for the `/v` page (Markdown: paragraphs,
   * ##/### headings, - lists, **bold**, *italic*, [links](url), `code`).
   * `description_md` stays the short sidebar blurb; `story_md` is the rich body.
   */
  story_md?: string;
  agent_name?: string;
  /** E.164 phone number for wa.me link, e.g. +573001234567 */
  agent_whatsapp?: string;
  /** Filename relative to scene R2 folder */
  floorplan_svg_url?: string;

  // --- Ficha técnica (optional; render only when set) — CO listing conventions ---
  /** Estrato socioeconómico (1–6). */
  stratum?: number;
  /** Parqueaderos / garajes. */
  parking?: number;
  /** Administración mensual en COP (numeric; formatted at render). 0 renders as "Sin administración". */
  admin_fee_cop?: number;
  /** Piso, e.g. 3 or "PH". */
  floor?: number | string;
  /** Antigüedad — free text, e.g. "Entre 5 y 10 años" or "2018". */
  building_age?: string;
}

/**
 * One image in the property photo gallery. `url` is either an https URL or a
 * filename relative to the scene R2 folder (e.g. "gallery/01.jpg") — resolved
 * via resolvePublicAssetUrl().
 */
export interface SceneGalleryItem {
  url: string;
  caption?: string;
  /** Optional alt text; falls back to caption or the scene title. */
  alt?: string;
}

export interface SceneCaptureMethodRow {
  label: string;
  value: string;
}

/**
 * Human-readable production provenance for the `/v` page. This is intentionally
 * editorial/flexible: some tours come from phone MRNF, some from equirect+Blender,
 * some from hand-authored PlayCanvas/Aholo pilots.
 */
export interface SceneCaptureMethod {
  title?: string;
  summary?: string;
  rows?: SceneCaptureMethodRow[];
  notes?: string;
}

export interface SceneBranding {
  tenant_id?: string;
  logo_url?: string | null;
  /** Hex color string, e.g. #5e5956 */
  primary_color?: string;
  show_mirador_badge?: boolean;
}

export interface SceneAccess {
  visibility?: "public" | "password";
  password_hash?: string | null;
  embed_domains?: string[];
}

export interface SceneUnit {
  id: string;
  label: string;
  scene_id: string;
  status?: "available" | "reserved" | "sold";
}

export interface SceneUnitSelector {
  enabled?: boolean;
  units?: SceneUnit[];
}

export interface SceneAnalytics {
  enabled?: boolean;
  posthog_key?: string | null;
}

export interface SceneAttribution {
  capture_date?: string;
  pipeline?: string;
  converter?: string;
}

export interface SceneOrbitLeash {
  max_yaw_deg?: number;
  max_pitch_deg?: number;
  release_reset_ms?: number;
  max_distance_m?: number;
  min_distance_m?: number;
  max_distance_scene?: number;
  min_distance_scene?: number;
}

export interface SceneNavigation {
  orbit_leash?: SceneOrbitLeash;
}

/** Root scene.json structure */
export interface Scene {
  schema_version: "1";
  id: string;
  title: string;
  metric?: SceneMetric;
  render: SceneRender;
  context?: SceneContext;
  /** Opening camera before the first waypoint tween (Author / SuperSplat handoff). */
  camera_default?: SceneCameraDefault;
  waypoints?: SceneWaypoint[];
  navigation?: SceneNavigation;
  hotspots?: SceneHotspot[];
  portals?: ScenePortal[];
  listing?: SceneListing;
  /** Property photo gallery shown as a grid on the `/v` page. */
  gallery?: SceneGalleryItem[];
  /** Human-readable capture / reconstruction method shown near the bottom of `/v`. */
  capture_method?: SceneCaptureMethod;
  branding?: SceneBranding;
  access?: SceneAccess;
  unit_selector?: SceneUnitSelector;
  analytics?: SceneAnalytics;
  attribution?: SceneAttribution;
}
