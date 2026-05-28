"use client";

import posthog from "posthog-js";

// ─── Initialization ──────────────────────────────────────────────────────────

let initialized = false;

export function initPosthog() {
  if (initialized || typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // We capture manually per route
  });

  initialized = true;
}

export function capturePageView(url: string) {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("$pageview", { $current_url: url });
}

// ─── Typed event helpers ──────────────────────────────────────────────────────

function capture(event: string, props: Record<string, unknown>) {
  if (!initialized) return;
  posthog.capture(event, props);
}

export function trackSceneLoaded(sceneId: string, title: string) {
  capture("scene_loaded", { scene_id: sceneId, title });
}

export function trackWaypointReached(sceneId: string, waypointId: string, label: string) {
  capture("waypoint_reached", {
    scene_id: sceneId,
    waypoint_id: waypointId,
    label,
  });
}

export function trackHotspotClicked(sceneId: string, hotspotId: string, type: string) {
  capture("hotspot_clicked", {
    scene_id: sceneId,
    hotspot_id: hotspotId,
    type,
  });
}

export function trackCTAClicked(sceneId: string, hotspotId: string, href: string) {
  capture("cta_clicked", {
    scene_id: sceneId,
    hotspot_id: hotspotId,
    href,
  });
}

export function trackVREntered(sceneId: string) {
  capture("vr_entered", { scene_id: sceneId });
}

export function trackEmbedCopied(sceneId: string) {
  capture("embed_copied", { scene_id: sceneId });
}

// ─── Demo1 listing microsite (mirador.lat/demo1) ─────────────────────────────

const DEMO1_SLUG = "ai67";

export function trackDemo1Outbound(props: {
  channel: "whatsapp" | "phone";
  placement: "nav" | "agent" | "sticky";
}) {
  capture("demo1_outbound_click", {
    demo_slug: DEMO1_SLUG,
    channel: props.channel,
    placement: props.placement,
  });
}

export function trackDemo1SectionViewed(
  section: "galeria" | "contacto",
) {
  capture("demo1_section_viewed", {
    demo_slug: DEMO1_SLUG,
    section,
  });
}
