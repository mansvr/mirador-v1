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

export interface SceneRender {
  format: SceneRenderFormat;
  /** Filename relative to the scene's R2 folder, e.g. "scene.sog" */
  url: string;
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
  agent_name?: string;
  /** E.164 phone number for wa.me link, e.g. +573001234567 */
  agent_whatsapp?: string;
  /** Filename relative to scene R2 folder */
  floorplan_svg_url?: string;
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

/** Root scene.json structure */
export interface Scene {
  schema_version: "1";
  id: string;
  title: string;
  metric?: SceneMetric;
  render: SceneRender;
  context?: SceneContext;
  waypoints?: SceneWaypoint[];
  hotspots?: SceneHotspot[];
  portals?: ScenePortal[];
  listing?: SceneListing;
  branding?: SceneBranding;
  access?: SceneAccess;
  unit_selector?: SceneUnitSelector;
  analytics?: SceneAnalytics;
  attribution?: SceneAttribution;
}
