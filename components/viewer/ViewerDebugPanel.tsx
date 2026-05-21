"use client";

/**
 * DOM overlay: lil-gui + stats.js (both hidden until **H**).
 * "Log snapshot" writes one frame of metrics to DevTools → Console (F12).
 */

import { useEffect, useRef } from "react";
import type { GUI } from "lil-gui";
import {
  createPerfSnapshot,
  logPerfSnapshot,
  viewerDebugRegistry,
  type ViewerPerfSnapshot,
} from "@/lib/viewer-debug-registry";

const PANEL_STYLE_ID = "mirador-viewer-debug-styles";

function applyDebugUiVisible(gui: GUI | null, visible: boolean) {
  viewerDebugRegistry.uiVisible = visible;
  if (viewerDebugRegistry.statsDom) {
    viewerDebugRegistry.statsDom.style.display = visible ? "block" : "none";
  }
  if (!gui) return;
  if (visible) gui.show();
  else gui.hide();
}

export function ViewerDebugPanel() {
  const guiRef = useRef<GUI | null>(null);
  const controllersRef = useRef<Record<string, { updateDisplay: () => void }>>(
    {}
  );

  useEffect(() => {
    let gui: GUI | null = null;
    let destroyed = false;

    const metrics = createPerfSnapshot();
    viewerDebugRegistry.metrics = metrics;
    viewerDebugRegistry.uiVisible = false;

    void (async () => {
      const { default: GUI } = await import("lil-gui");
      if (destroyed) return;

      gui = new GUI({ title: "Mirador · 3DGS" });
      gui.domElement.style.zIndex = "10050";
      gui.domElement.style.top = "48px";
      gui.hide();
      guiRef.current = gui;

      const actions = {
        logSnapshot: () => logPerfSnapshot(),
      };
      gui
        .add(actions, "logSnapshot")
        .name("Log snapshot → F12 Console");

      const perf = gui.addFolder("Frame");
      perf.open();
      const bind = (folder: GUI, key: keyof ViewerPerfSnapshot, label: string) => {
        const c = folder.add(metrics, key).name(label);
        c.disable();
        controllersRef.current[key] = c;
      };

      bind(perf, "fps", "FPS");
      bind(perf, "frameMs", "frame ms");
      bind(perf, "dpr", "devicePixelRatio");
      bind(perf, "drawCalls", "draw calls");
      bind(perf, "triangles", "triangles");
      bind(perf, "points", "points");

      const splats = gui.addFolder("Splats (Spark)");
      splats.open();
      bind(splats, "totalSplats", "total splats");
      bind(splats, "activeSplats", "active splats");
      bind(splats, "maxSplats", "max splats");
      bind(splats, "lodSplats", "LoD splats");
      bind(splats, "splatBudget", "budget (scene)");
      bind(splats, "sorting", "sorting");
      bind(splats, "msSinceSort", "ms since sort");
    })();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "h" && event.key !== "H") return;
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
      applyDebugUiVisible(guiRef.current, !viewerDebugRegistry.uiVisible);
    };

    window.addEventListener("keydown", onKeyDown);

    if (!document.getElementById(PANEL_STYLE_ID)) {
      const style = document.createElement("style");
      style.id = PANEL_STYLE_ID;
      style.textContent = `
        #stats { z-index: 10051 !important; left: 0 !important; top: 0 !important; }
        .lil-gui.root { z-index: 10050 !important; }
      `;
      document.head.appendChild(style);
    }

    const tick = window.setInterval(() => {
      if (!viewerDebugRegistry.uiVisible) return;
      for (const c of Object.values(controllersRef.current)) {
        c.updateDisplay();
      }
    }, 100);

    return () => {
      destroyed = true;
      window.clearInterval(tick);
      window.removeEventListener("keydown", onKeyDown);
      gui?.destroy();
      guiRef.current = null;
      viewerDebugRegistry.metrics = null;
      viewerDebugRegistry.uiVisible = false;
      viewerDebugRegistry.setStatsDom(null);
      controllersRef.current = {};
    };
  }, []);

  return null;
}
