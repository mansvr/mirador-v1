# 3DGS viewer — performance debug overlay

Dev tooling for Mirador’s Spark + R3F viewer: **stats.js** FPS HUD + **lil-gui** panel with splat / WebGL metrics.

## Enable

| Context | How |
|---------|-----|
| Local dev | On by default (`npm run dev`) |
| Force off in dev | Add `?nodebug` to the URL |
| Production profiling | Set `NEXT_PUBLIC_VIEWER_DEBUG=1` at build time (requires `stats.js` / `lil-gui` in dependencies) |
| **Live site (default)** | **Off** on `mirador.lat` when that env var is unset — no `?debug` URL toggle (env only). See **`docs/vercel-mirador.lat-setup.md`** → Viewer perf debug checklist. |

Works on `/v/[sceneId]`, `/e/[sceneId]`, and tenant property routes (all use `SceneCanvas`).

## UI

Everything is **off until you press `H`** (stats HUD + lil-gui panel together). Press **`H`** again to hide.

- **stats.js** — top-left FPS / frame time (only when visible).
- **lil-gui** — splat + WebGL metrics; includes **“Log snapshot → F12 Console”** (see below).
- Ignores **H** when focus is in an input/textarea.

### Log snapshot (not a separate app)

Click **Log snapshot → F12 Console** in the panel (only visible after **`H`**). That runs `console.table` + JSON in the browser **DevTools → Console** tab (Chrome/Edge: **F12** → Console). Use it to copy one frame of numbers before/after an optimization change.

## Metrics

**Frame:** FPS, frame ms, `devicePixelRatio`, `renderer.info` (draw calls, triangles, points).

**Splats (Spark):** total splats (mesh), active/max splats (renderer), LoD count, scene splat budget, sorting flag, ms since last sort.

### Confirm budget is enforced

After deploy, open a tour in dev, press **H**, orbit for a few seconds:

- **`splatBudget`** = value from `scene.json` (`splat_budget_desktop` or `_mobile`).
- **`activeSplats`** should stay **≤ `splatBudget`** (often lower while LoD settles).
- **`totalSplats`** may still show the full file size (e.g. 5M loaded); that is OK — what matters is **active** splats per frame.

If `activeSplats` stays above budget, LoD may not be active for that asset (see `docs/spark-assets-and-budget.md`).

## Stack (what we did not wire yet)

- **Chrome Performance** — long tasks / GC when FPS drops.
- **Spector.js** — WebGL pass inspection.
- **r3f-perf** — optional later; stats.js + custom Spark fields cover the 3DGS-specific case.

## Files

- `lib/viewer-debug.ts` — enable gate
- `lib/viewer-debug-registry.ts` — Spark/Splat handles + live metrics object
- `components/viewer/ViewerDebugPanel.tsx` — lil-gui (DOM)
- `components/viewer/ViewerDebugSampler.tsx` — stats.js + sampling (`useFrame`)

After changing overlay copy or scene budget logic, no rebake needed — metrics are live.
