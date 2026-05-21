# Mobile splat delivery (dual SOG)

## Why two files?

| Knob | What it does | What it does *not* do |
|------|----------------|------------------------|
| `splat_budget_mobile` | Caps **drawn** splats after decode | Shrink download size |
| Smaller `scene-mobile.sog` | Less to download and decode on iPhone | Fix wrong orientation by itself |
| `pitch_correction_deg` | Viewer-only root rotation | Change SOG bytes |

Mobile Safari needs a **smaller file** and a **lower budget**. Cropping in SuperSplat then exporting SOG is the right pipeline step.

## Naming (R2)

Per scene folder `/<scene-id>/`:

| File | `scene.json` field |
|------|-------------------|
| `scene.sog` | `render.url` |
| `scene-mobile.sog` | `render.url_mobile` |

Keep the `scene-mobile` prefix so ops can tell assets apart in the bucket.

## Orientation per asset

Training/Postshot exports are often upside-down in Three.js. Mirador fixes that with **`pitch_correction_deg: 180`** on the splat root (world +X).

If you **re-oriented or re-exported** the mobile SOG so it already looks correct in SuperSplat / Mirador:

```json
"pitch_correction_deg": 180,
"pitch_correction_deg_mobile": 0
```

If mobile still needs the same flip as desktop, omit `pitch_correction_deg_mobile` (inherits desktop value).

**Waypoints** (`pos` / `quat`) are in world space **after** the root correction. If you change pitch between desktop and mobile, verify entry/corner cameras on both.

## Staging layout (Umbral)

```
mirador/r2-share/          ← drop exports while iterating (not served)
r2upload/                  ← copy here before R2 upload
  scene.json
  scene.sog
  scene-mobile.sog
```

Local dev (optional):

```
mirador/public/scene-mobile.sog   ← copy or hardlink
mirador/scenes/<id>/scene.json    ← url_mobile: "/scene-mobile.sog"
```

Production uses `r2upload/scene.json` uploaded to R2; Mirador fetches JSON from R2 in prod.

## Upload checklist

1. Copy `scene-mobile.sog` into `r2upload/`.
2. Update `r2upload/scene.json` (`url_mobile`, mobile pitch if needed).
3. `wrangler r2 object put … scene.json`
4. `wrangler r2 object put … scene-mobile.sog`
5. Deploy Mirador if the app did not yet support `url_mobile` (one-time).
6. Test desktop vs iPhone Network tab for which `.sog` loads.

## Size target

~64 MB mobile SOG is only a small win over ~68 MB desktop. For reliable iOS load, aim for **8–20 MB** after more aggressive prune + `splat-transform`.
