"use client";

import { useSyncExternalStore } from "react";
import { isViewerAuthorEnabled } from "@/lib/viewer-author";
import { viewerAuthorRegistry } from "@/lib/viewer-author-registry";

/** Tour = leash + release reset. Author panel open = free orbit for framing. */
export type NavigationMode = "tour" | "author";

function subscribeNavigationMode(onStoreChange: () => void) {
  window.addEventListener("mirador-author-ui", onStoreChange);
  return () => window.removeEventListener("mirador-author-ui", onStoreChange);
}

export function getNavigationMode(): NavigationMode {
  if (typeof window === "undefined") return "tour";
  if (isViewerAuthorEnabled() && viewerAuthorRegistry.uiVisible) {
    return "author";
  }
  return "tour";
}

export function useNavigationMode(): NavigationMode {
  return useSyncExternalStore(
    subscribeNavigationMode,
    getNavigationMode,
    () => "tour"
  );
}
