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

// ─── Typed event helpers ──────────────────────────────────────────────────────

export function trackSceneLoaded(sceneId: string, title: string) {
  posthog.capture("scene_loaded", { scene_id: sceneId, title });
}

export function trackWaypointReached(sceneId: string, waypointId: string, label: string) {
  posthog.capture("waypoint_reached", {
    scene_id: sceneId,
    waypoint_id: waypointId,
    label,
  });
}

export function trackHotspotClicked(sceneId: string, hotspotId: string, type: string) {
  posthog.capture("hotspot_clicked", {
    scene_id: sceneId,
    hotspot_id: hotspotId,
    type,
  });
}

export function trackCTAClicked(sceneId: string, hotspotId: string, href: string) {
  posthog.capture("cta_clicked", {
    scene_id: sceneId,
    hotspot_id: hotspotId,
    href,
  });
}

export function trackVREntered(sceneId: string) {
  posthog.capture("vr_entered", { scene_id: sceneId });
}

export function trackEmbedCopied(sceneId: string) {
  posthog.capture("embed_copied", { scene_id: sceneId });
}
