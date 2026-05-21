"use client";

import { useEffect, useSyncExternalStore } from "react";
import { readAuthorCamera } from "@/lib/viewer-author-registry";
import { viewerAuthorRegistry } from "@/lib/viewer-author-registry";
import { useAuthorStore } from "@/lib/author-store";
import {
  isViewerAuthorBuildEnabled,
  isViewerAuthorEnabled,
} from "@/lib/viewer-author";
import type { Scene } from "@/lib/types/scene";

function useAuthorActive() {
  return useSyncExternalStore(
    () => () => {},
    () => isViewerAuthorEnabled(),
    () => isViewerAuthorBuildEnabled()
  );
}

function subscribeAuthorUi(cb: () => void) {
  const handler = () => cb();
  window.addEventListener("mirador-author-ui", handler);
  return () => window.removeEventListener("mirador-author-ui", handler);
}

function getAuthorUiVisible() {
  return viewerAuthorRegistry.uiVisible;
}

interface ViewerAuthorPanelProps {
  scene: Scene;
}

export function ViewerAuthorPanel({ scene }: ViewerAuthorPanelProps) {
  const authorActive = useAuthorActive();
  const uiVisible = useSyncExternalStore(
    subscribeAuthorUi,
    getAuthorUiVisible,
    () => false
  );

  const initFromScene = useAuthorStore((s) => s.initFromScene);
  const cameraDefault = useAuthorStore((s) => s.cameraDefault);
  const waypoints = useAuthorStore((s) => s.waypoints);
  const selectedWaypointId = useAuthorStore((s) => s.selectedWaypointId);
  const newLabel = useAuthorStore((s) => s.newLabel);
  const copied = useAuthorStore((s) => s.copied);
  const setNewLabel = useAuthorStore((s) => s.setNewLabel);
  const selectWaypoint = useAuthorStore((s) => s.selectWaypoint);
  const setCameraDefault = useAuthorStore((s) => s.setCameraDefault);
  const addWaypointFromCamera = useAuthorStore((s) => s.addWaypointFromCamera);
  const updateSelectedFromCamera = useAuthorStore((s) => s.updateSelectedFromCamera);
  const deleteSelected = useAuthorStore((s) => s.deleteSelected);
  const moveSelected = useAuthorStore((s) => s.moveSelected);
  const copyExport = useAuthorStore((s) => s.copyExport);
  const exportJson = useAuthorStore((s) => s.exportJson);

  useEffect(() => {
    if (!authorActive) return;
    initFromScene(scene);
  }, [authorActive, scene, initFromScene]);

  useEffect(() => {
    if (!authorActive) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "a" && event.key !== "A") return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      viewerAuthorRegistry.uiVisible = !viewerAuthorRegistry.uiVisible;
      window.dispatchEvent(new Event("mirador-author-ui"));
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      viewerAuthorRegistry.uiVisible = false;
      window.dispatchEvent(new Event("mirador-author-ui"));
    };
  }, [authorActive]);

  if (!authorActive || !uiVisible) return null;

  function captureOrAlert() {
    const cam = readAuthorCamera();
    if (!cam) {
      window.alert("Camera not ready — wait for the splat to load.");
      return null;
    }
    return cam;
  }

  return (
    <div
      className="pointer-events-auto absolute right-2 top-2 z-[10049] max-h-[min(85%,520px)] w-[min(100%-1rem,320px)] overflow-y-auto rounded-xl border border-white/15 bg-black/85 p-3 text-xs text-white shadow-lg backdrop-blur-md sm:right-3 sm:top-3"
      role="dialog"
      aria-label="Mirador Author"
    >
      <p className="mb-2 font-semibold tracking-wide text-white/90">
        Author <span className="font-normal text-white/50">· A to hide</span>
      </p>
      <p className="mb-3 text-[10px] leading-relaxed text-white/55">
        Orbit the scene, then capture poses. Export JSON → paste into{" "}
        <span className="font-mono text-white/70">scenes/{scene.id}/scene.json</span>{" "}
        or R2.
      </p>

      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          className="rounded-lg bg-white/10 px-2.5 py-2 text-left hover:bg-white/15"
          onClick={() => {
            const cam = captureOrAlert();
            if (cam) setCameraDefault(cam);
          }}
        >
          Set opening view (camera_default)
        </button>
        <button
          type="button"
          className="rounded-lg bg-white/10 px-2.5 py-2 text-left hover:bg-white/15"
          onClick={() => {
            const cam = captureOrAlert();
            if (cam) addWaypointFromCamera(cam);
          }}
        >
          Add waypoint from camera
        </button>
        <button
          type="button"
          disabled={!selectedWaypointId}
          className="rounded-lg bg-white/10 px-2.5 py-2 text-left hover:bg-white/15 disabled:opacity-40"
          onClick={() => {
            const cam = captureOrAlert();
            if (cam) updateSelectedFromCamera(cam);
          }}
        >
          Update selected waypoint
        </button>
      </div>

      <label className="mt-3 block text-[10px] text-white/50">
        Label for next waypoint
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="e.g. Terraza"
          className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-2 py-1.5 text-sm text-white"
        />
      </label>

      {cameraDefault ? (
        <p className="mt-2 text-[10px] text-emerald-400/90">✓ Opening view set</p>
      ) : null}

      <ul className="mt-3 max-h-32 space-y-1 overflow-y-auto">
        {waypoints.map((wp) => (
          <li key={wp.id}>
            <button
              type="button"
              onClick={() => selectWaypoint(wp.id)}
              className={`w-full rounded-md px-2 py-1.5 text-left font-mono text-[11px] ${
                wp.id === selectedWaypointId
                  ? "bg-[var(--mirador-primary,#5e5956)] text-white"
                  : "bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              {wp.label}{" "}
              <span className="text-white/40">({wp.id})</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          disabled={!selectedWaypointId}
          className="rounded-md bg-white/10 px-2 py-1 disabled:opacity-40"
          onClick={() => moveSelected(-1)}
        >
          ↑
        </button>
        <button
          type="button"
          disabled={!selectedWaypointId}
          className="rounded-md bg-white/10 px-2 py-1 disabled:opacity-40"
          onClick={() => moveSelected(1)}
        >
          ↓
        </button>
        <button
          type="button"
          disabled={!selectedWaypointId}
          className="rounded-md bg-red-500/30 px-2 py-1 disabled:opacity-40"
          onClick={deleteSelected}
        >
          Delete
        </button>
      </div>

      <div className="mt-3 flex gap-1.5">
        <button
          type="button"
          className="flex-1 rounded-lg bg-[var(--mirador-primary,#5e5956)] px-2 py-2 font-medium hover:opacity-90"
          onClick={() => void copyExport()}
        >
          {copied ? "✓ Copied" : "Copy JSON"}
        </button>
        <button
          type="button"
          className="rounded-lg bg-white/10 px-2 py-2 hover:bg-white/15"
          onClick={() => {
            const blob = new Blob([exportJson()], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${scene.id}-author-patch.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          ↓
        </button>
      </div>

      <pre className="mt-2 max-h-24 overflow-auto rounded-md bg-black/50 p-2 font-mono text-[9px] leading-relaxed text-white/60">
        {exportJson()}
      </pre>
    </div>
  );
}
