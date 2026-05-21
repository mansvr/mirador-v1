import type { SparkRenderer, SplatMesh } from "@sparkjsdev/spark";

/** Module-level handles for the debug sampler (R3F + DOM overlay). */
export const viewerDebugRegistry = {
  spark: null as SparkRenderer | null,
  splat: null as SplatMesh | null,
  splatBudget: 0,
  /** Live object bound to lil-gui (created by ViewerDebugPanel). */
  metrics: null as ViewerPerfSnapshot | null,
  /** stats.js + lil-gui visibility (both off until **H**). */
  uiVisible: false,
  statsDom: null as HTMLElement | null,

  setSpark(spark: SparkRenderer | null) {
    this.spark = spark;
  },
  setSplat(splat: SplatMesh | null) {
    this.splat = splat;
  },
  setSplatBudget(budget: number) {
    this.splatBudget = budget;
  },

  setStatsDom(el: HTMLElement | null) {
    this.statsDom = el;
    if (el) el.style.display = "none";
  },

  /** Toggle stats HUD + lil-gui together. Returns new visibility. */
  toggleUiVisible(): boolean {
    this.uiVisible = !this.uiVisible;
    if (this.statsDom) {
      this.statsDom.style.display = this.uiVisible ? "block" : "none";
    }
    return this.uiVisible;
  },
};

/** One-line dump for before/after optimization — appears in DevTools → Console (F12). */
export function logPerfSnapshot(label = "mirador-perf"): void {
  const m = viewerDebugRegistry.metrics;
  if (!m) {
    console.warn("[Mirador] perf metrics not ready yet");
    return;
  }
  const payload = { ...m, at: new Date().toISOString() };
  console.group(`[Mirador] ${label}`);
  console.table(payload);
  console.log("JSON:", JSON.stringify(payload, null, 2));
  console.groupEnd();
}

export type ViewerPerfSnapshot = {
  fps: number;
  frameMs: number;
  dpr: number;
  drawCalls: number;
  triangles: number;
  points: number;
  totalSplats: number;
  activeSplats: number;
  maxSplats: number;
  lodSplats: number;
  splatBudget: number;
  sorting: boolean;
  msSinceSort: number;
};

export function createPerfSnapshot(): ViewerPerfSnapshot {
  return {
    fps: 0,
    frameMs: 0,
    dpr: 1,
    drawCalls: 0,
    triangles: 0,
    points: 0,
    totalSplats: 0,
    activeSplats: 0,
    maxSplats: 0,
    lodSplats: 0,
    splatBudget: 0,
    sorting: false,
    msSinceSort: 0,
  };
}
