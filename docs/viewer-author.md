# Mirador Author mode — camera & waypoints

Capture opening views and tour stops on the **production Spark renderer**, then paste JSON into `scene.json`.

## Enable

| Context | How |
|---------|-----|
| Vercel / build | `NEXT_PUBLIC_VIEWER_AUTHOR=1` → **redeploy** (env is baked at build time) |
| Force off | Add `?noauthor` to the tour URL |

Works on `/v/[sceneId]`, `/e/[sceneId]`, and tenant property routes (`SceneCanvas`).

## UI

- **Hidden by default** (same idea as perf debug).
- Press **`A`** to show / hide the Author panel.
- Press **`H`** for perf debug (independent).

Ignore **A** / **H** when focus is in an input or textarea.

## Workflow

1. Open a tour, e.g. `https://mirador.homes/v/scene_poblado001`.
2. Wait for the splat to load.
3. Press **A** → Author panel (top-right).
4. Orbit to the desired view (mouse / touch).
5. **Set opening view** → writes `camera_default` (first frame before tour pills).
6. Enter a label → **Add waypoint from camera** (repeat per stop).
7. Select a row → **Update selected** or reorder / delete.
8. **Copy JSON** or download patch → merge into `scenes/<id>/scene.json` or `r2upload/`, upload to R2.

Export is a **patch** only (`camera_default` + `waypoints`), not the full scene file.

## Preview

While Author is enabled, draft waypoints sync to the live viewer (pills + tweens) so you can test before export.

**Author = free orbit** (no snap-back) so you can frame captures. Closing the panel (**A**) tweens back to the active pill. Production tour mode uses **orbit leash**: limited drag + scroll zoom, release → tween home (~450 ms). Optional tuning in `scene.json` → `navigation.orbit_leash` (degrees / ms; zoom uses scene-relative units unless `metric.verified_by` is `apriltag` or `lidar`).

## Fresh start (no legacy waypoints)

Listing demos ship **without** `waypoints` in `scenes/*/scene.json` until you author them. The viewer still loads the splat; only the tour pills / tweens are absent until you paste exported JSON and upload `scene.json` to R2.

## Security note

`NEXT_PUBLIC_VIEWER_AUTHOR` is visible in client JS. Use it on **Preview** for daily work; enable on **Production** only when agents need in-browser authoring (no secrets in the panel).

## Files

- `lib/viewer-author.ts` — enable gate
- `lib/author-store.ts` — draft state + preview sync
- `lib/author-export.ts` — JSON patch builder
- `components/viewer/ViewerAuthorPanel.tsx` — **A** toggle UI
- `components/viewer/AuthorCameraBridge.tsx` — camera readback inside R3F

## Related

- [viewer-debug.md](./viewer-debug.md) — **H** perf overlay
- [viewer-roadmap-gameplan.md](./viewer-roadmap-gameplan.md) — Phase 3 / tour bar
