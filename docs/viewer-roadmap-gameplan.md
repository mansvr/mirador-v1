# Mirador viewer — product audit & phased gameplan

> **Status (2026-05-22):** Phase 0–1 ✅ · Phase 2 core ✅ (viewer paused) · Phase 3 Author MVP ✅.  
> Next ROI: hotspots, mobile SPZ, `.homes` polish, OG share — see §10.

> Synthesises your notes (vrestate, StorySplat, Dioramix beta, SuperSplat, Marble,
> mirador3d.com) against **current Mirador v0** (`/v`, `/e`, waypoints, hotspots,
> `scene.json`). Companion: [3dgs-viewer-system.md](../../docs/canon/gtm/tech-notes/3dgs-viewer-system.md) §2–6.

**Deferred by design:** Real Horizons macro/meso/micro + unit selector → **mirador.build** phase only.

---

## 1. Audit of your observations (nuances)

### 1.1 Listings open in new tab; Back closes

| Intent | Nuance | Mirador today |
|--------|--------|----------------|
| Card → tour in **new tab** | User stays on grid; browser Back on tour tab closes tab → returns to grid | `ListingCard` uses `<Link href>` same tab |
| **Implement:** `target="_blank"` + `rel="noopener noreferrer"` on tour links from `/home` | Also consider `window.open` only on CTA, not whole card (UX choice) |

### 1.2 vrestateviewings.com — split layout + navigation modes

| Pattern | Works best for | Risk / nuance |
|---------|----------------|---------------|
| **Viewer left + listing right** (not iframe on their site — native split) | Desktop sales page | Mobile: you already stack GL + strip; keep both layouts |
| **Orbit vs Floorplan** toggle | Houses, townhomes | Needs **second representation** (dollhouse mesh or top-down minimap) — not just splat |
| **Walk + WASD** | Large interiors, single floor | Users **clip through splats** without collision; needs nav mesh |
| **Room labels / portals on floorplan** | Multi-room homes | Portals = **scene graph** (link to another `sceneId` or waypoint) |
| **Embed example card** | Agent sites | You already have `EmbedSnippet` on `/v/` |

**Apartment rule:** enable **Tour + constrained orbit** only; skip floorplan + walk unless client pays for extra capture.

**House rule:** Tour + orbit + optional floorplan; walk only when collision asset exists.

### 1.3 StorySplat — Tour vs Explore

| Pattern | Nuance | Recommendation |
|---------|--------|----------------|
| **Tour** (Prev / Play / Next) | Curated; no wall clip if camera stays near waypoints | **Default for Mirador** — extend `WaypointNav` |
| **Explore** | Free orbit/fly — users see voids, back faces, ceiling bugs | Do **not** ship full Explore initially |
| **Orbit with damping → return to waypoint** | “Explore-lite” — orbit around current stop, idle spring back | **Best compromise** — clamp radius + polar angles per waypoint; idle 3–5s → tween home |

This is the answer to “controlled and curated”: **no unconstrained fly mode** in v1; only **orbit-on-a-leash** tied to active waypoint.

### 1.4 Walk mode + collision

| Reality | Pipeline implication |
|---------|---------------------|
| Collision matters most for **room shell** | Full-scene auto collision is heavy; room-level is enough for apartments |
| SuperSplat adding collision tools | **Export step** in SuperSplat after crop — not in Mirador runtime first |
| Spark / Mirador | `isWalkMode` exists in store but **no UI / no collision** wired |

**Order:** collision export format research → optional `scene.json` `nav_mesh_url` → walk mode last.

### 1.5 Dioramix (beta — study today)

Expected steals (from internal audit §2.2): **slide = camera view**, rich hotspots (PDF/video/button). After your beta test, add a short “Dioramix delta” section to this doc or `3dgs-viewer-system.md`.

**Skip for Mirador:** WebGPU-only stack, local ZIP-first (conflicts with R2 SaaS).

### 1.6 SuperSplat — attribution + camera

**“Software Attribution metadata”** means:

- SuperSplat (and SOG exports) can embed **provenance** in file metadata (which editor/version touched the splat).
- Extend **`scene.json` → `attribution`** for **pipeline traceability**, not just marketing:

```json
"attribution": {
  "capture_date": "2026-05-18",
  "pipeline": "Postshot → SuperSplat → splat-transform",
  "converter": "splat-transform 2.x",
  "editor": "SuperSplat 2.x",
  "source_ply_sha256": "optional",
  "notes": "AprilTag scale verified"
}
```

**Camera / waypoints in SuperSplat Studio:**

- SuperSplat is the right place for **rough camera bookmarks** while you see the splat.
- Mirador needs those bookmarks as **`scene.json` data** (positions + quaternions), not inside the `.sog` bytes.

**Replicable workflow (recommended):**

1. **SuperSplat** — cleanup, crop, optional collision bake, note default view.
2. **Mirador Author mode** (env-gated) — fine-tune on real `/v/` URL, copy JSON.
3. **R2** — `scene.json` is source of truth for production.

### 1.7 Marble Studio

Treat like SuperSplat: **prep environment** for crop/camera experiments. Same handoff: export splat + manual or exported JSON → merge into `scene.json`. Do not fork Marble until SuperSplat path is boring.

### 1.8 mirador3d.com + Reddit / Reality Stack

| Learn | Do not copy blindly |
|-------|---------------------|
| Streaming very large splats, production UX polish | Their hosting + pricing model |
| “Same link in VR” | WebXR button is **later** (you noted) |
| Go-to-market nuance | You differentiate on **metric capture, R2 pipeline, `.home` + embed API** |

Action: 30-minute competitive pass — record **load UX, navigation limits, embed, mobile** — append to §2 in `3dgs-viewer-system.md`.

### 1.9 Real Horizons

Constructora-grade **context stack** (map → pano → splat, unit selector). **Explicitly out of scope** until mirador.build; do not block v1 on Mapbox/3D Tiles.

---

## 2. Layer model (how to think about the system)

```mermaid
flowchart TB
  subgraph prep [Prep - offline / browser tools]
    CAP[Capture + train]
    SS[SuperSplat / Marble]
    ST[splat-transform → SOG/SPZ]
  end

  subgraph manifest [Manifest - scene.json on R2]
    REN[render.* assets]
    CAM[camera_default + waypoints]
    NAV[navigation_profile + modes_enabled]
    HOT[hotspots]
    PORT[portals - later]
    NAVMESH[nav_mesh - later]
  end

  subgraph viewer [Mirador runtime]
    TOUR[Tour mode]
    ORB[Orbit-on-leash]
    EMB[/e embed]
    AUTH[Author mode - env]
  end

  subgraph dist [Distribution]
    HOME[mirador.home grid]
    LAT[mirador.lat / client sites]
    IFR[iframe /e]
  end

  CAP --> SS --> ST --> REN
  SS --> CAM
  AUTH --> CAM
  CAM --> manifest
  manifest --> viewer
  viewer --> dist
```

| Layer | Owns | Does not own |
|-------|------|----------------|
| **Prep** | Quality, crop, floaters, metric scale | Listing price/copy |
| **manifest (`scene.json`)** | Cameras, modes, hotspots, asset URLs | Rendering code |
| **Viewer** | UX, Spark, controls, author/debug | Training |
| **Catalog (`catalog.json`)** | Grid cards, sort, publish | Splat bytes |

---

## 3. Where to implement what (your pipeline question)

| Task | Best environment | Why |
|------|------------------|-----|
| Crop / delete floaters / export SOG | **SuperSplat** | Sees full splat; industry SOP |
| First-pass default camera | **SuperSplat** (if they expose pose export) or **Mirador Author** | Same frame as production |
| Waypoint / wayfinder placement | **Mirador Author** on `/v/<id>` | Real Spark renderer + HUD |
| Hotspot placement (3D pin) | **Mirador Author** (later) | Needs raycast + save |
| Portals | **Mirador Author** + `scene.json` | Links scenes |
| Collision mesh | **SuperSplat** (new tools) → file on R2 | Avoid hand-modeling in Mirador |
| Listing copy / price | **catalog.json** or CMS later | Not in viewer |
| Client embed code | Auto **`EmbedSnippet`** | Already on `/v/` |

### Author mode vs fork SuperSplat

| Approach | When |
|----------|------|
| **`NEXT_PUBLIC_VIEWER_AUTHOR=1`** (like debug `H`) | **Now** — fastest iteration on camera + waypoints |
| **Fork [playcanvas/supersplat](https://github.com/playcanvas/supersplat)** | **Later** — if you need splat editing + camera in one branded tool; high maintenance |
| **Marble** | Optional parallel prep; same handoff |

**Recommendation:** Author mode in Mirador first; evaluate SuperSplat fork only when author mode hits limits (e.g. placing hotspots on wrong frame, need splat crop in same UI).

### Author mode MVP features

- Toggle with env var (build-time or runtime flag).
- Panel: current camera `pos` + `quat` (+ FOV).
- **“Set as default”** → writes `camera_default`.
- **“Add waypoint”** → appends to `waypoints[]` with label.
- **Export JSON** / copy to clipboard for paste into `scenes/` or `r2upload/`.
- Optional: drag waypoint order.

---

## 4. `scene.json` extensions (proposed)

```json
{
  "camera_default": {
    "pos": [0, 1.6, 3],
    "quat": [0, 0, 0, 1],
    "fov": 60
  },
  "navigation": {
    "profile": "apartment",
    "modes": {
      "tour": true,
      "orbit_leash": true,
      "floorplan": false,
      "walk": false
    },
    "orbit_leash": {
      "max_distance_m": 4,
      "idle_reset_ms": 4000
    }
  },
  "portals": [
    {
      "id": "p_garden",
      "label": "Jardín",
      "pos": [2, 1.5, -4],
      "target_scene_id": "scene_garden_01",
      "target_waypoint_id": "w_entry"
    }
  ],
  "nav_mesh": {
    "url": "navmesh.glb",
    "format": "glb"
  }
}
```

`profile` presets:

| profile | tour | orbit_leash | floorplan | walk |
|---------|------|-------------|-----------|------|
| `apartment` | ✓ | ✓ | ✗ | ✗ |
| `house` | ✓ | ✓ | optional | optional |
| `showroom` | ✓ | ✓ | ✗ | ✗ |

---

## 5. Phased implementation (simple → aspirational)

### Phase 0 — Distribution quick wins (1–2 days) ✅

- [x] `ListingCard` tour links: **`target="_blank"`** + `rel="noopener"`
- [x] Grid stays on `.home`; tour opens in new tab (Back closes tab)

### Phase 1 — vrestate-style split shell (3–5 days) ✅

- [x] `/v/[sceneId]` **vrestate page shell**: `HomeHeader`/`HomeFooter`, `max-w-6xl`, contained **`/e/` iframe** + listing cards
- [x] **Mobile:** same blocks — bounded viewer top, cards below
- [ ] Optional: marketing site embeds **`/e/` in iframe** + **your** sidebar HTML (vrestate pattern on *their* site)

*Already have:* waypoints, hotspots schema, embed, metrics strip.

### Phase 2 — Tour UX (StorySplat-lite) ✅ core complete (2026-05-22)

- [x] **Tour bar:** Prev / Next chevrons (wrap) + Play/Pause autoplay loop
- [x] **Orbit-on-leash:** fixed-pivot orbit during tour; damped drag; release → spring home
- [x] **Autoplay:** dwell → slow tween (3× manual speed) between pills; orbit stays live during autoplay tweens
- [x] **`camera_default` + Inicio pill** — opening view before first waypoint
- [x] Walk mode **not exposed** in UI until collision exists (`isWalkMode` stub only)
- [ ] `navigation.profile` in schema; default `apartment` (orbit_leash per-scene tuning exists today)

*Shipped in:* `WaypointNav`, `WaypointCamera`, `TourOrbitLeash`, `TourAutoplay`, `lib/tour-autoplay.ts`, `lib/orbit-leash.ts`.

**Viewer paused here** — curated tour nav is production-ready; spatial nav (walk, floorplan, portals) is a later phase.

### Phase 3 — Author mode (1 week) ✅ MVP

- [x] `NEXT_PUBLIC_VIEWER_AUTHOR=1` — hidden until **A** (see `docs/viewer-author.md`)
- [x] Capture camera → `camera_default` + waypoints
- [x] Export / copy JSON patch + download
- [x] Docs: `docs/viewer-author.md`

### Phase 4 — Wayfinders in 3D (1–2 weeks)

- [ ] Floor markers in GL (billboards / rings at waypoint or portal anchor)
- [ ] Click marker → same as waypoint nav
- [ ] Author: click splat to place anchor (raycast)

### Phase 5 — Property-type packs (ongoing)

- [ ] **House:** optional floorplan SVG sync (vrestate dollhouse) — needs separate asset
- [ ] **Apartment:** strict tour-only profile
- [ ] Hotspot richness: PDF/video (Dioramix-inspired) — extend `hotspots[].payload`

### Phase 6 — Portals (2 weeks)

- [ ] `portals[]` in schema
- [ ] Click → load `/v/<target_scene_id>` or in-place scene swap (harder)
- [ ] Author: link two uploaded scenes

### Phase 7 — Walk + collision (blocked on pipeline)

- [ ] SuperSplat (or tool) exports **nav mesh** per scene
- [ ] `nav_mesh` in R2; walk mode enables only when present
- [ ] First-person controller + collision (Spark/three.js or custom)

### Phase 8 — VR button + WebXR (later)

- [ ] Spark WebXR path; Quest / Vision Pro smoke test
- [ ] Separate pricing SKU (per `3dgs-viewer-system.md` §6.6)

### Phase 9 — mirador.build / Real Horizons class (future)

- [ ] Mapbox / Google 3D Tiles macro
- [ ] Unit selector for constructoras
- [ ] 4D timeline (progress captures)

---

## 6. Navigation decision matrix (before coding walk)

| Mode | User freedom | Clip risk | Pipeline cost | Ship when |
|------|--------------|-----------|---------------|-----------|
| **Tour only** | Low | Low | Low (JSON waypoints) | **Phase 2** ✅ |
| **Orbit-on-leash** | Medium | Medium | Low | **Phase 2** ✅ |
| **Floorplan** | Medium | Low (birds-eye) | Medium (extra asset) | Phase 5 houses |
| **Walk + collision** | High | Low if mesh good | **High** | Phase 7 |
| **Full explore fly** | Very high | **Very high** | Low | **Avoid** |

**Product principle:** Default path = **Tour + orbit leash**. Walk is **opt-in per scene** when `nav_mesh` exists.

---

## 7. Competitive study checklist (today / this week)

| Source | Study | Output |
|--------|-------|--------|
| **Dioramix beta** | Slides, hotspots, export | 5 bullet “steal / skip” |
| **mirador3d.com** | Load, nav limits, embed, mobile | Same |
| **vrestate** | You have screenshots — map to Phase 1–2 | Already in §1.2 |
| **StorySplat** | Tour/Explore toggle | §1.3 → Phase 2 |

---

## 8. SuperSplat fork — when it makes sense

**Fork [supersplat](https://github.com/playcanvas/supersplat) if:**

- Author mode cannot place cameras accurately enough on production SOG.
- You need **one branded “Umbral Studio”** for clients self-serving prep.
- You have bandwidth to track PlayCanvas upstream merges.

**Until then:**

- SuperSplat = **vendor prep tool**
- Mirador Author = **camera/waypoint truth**
- `scene.json` = contract between them

---

## 9. What Mirador already has (don’t rebuild)

| Feature | Location |
|---------|----------|
| Opening view + waypoints + tween | `WaypointCamera`, `WaypointNav`, `camera_default`, `scene.json` |
| Tour autoplay + pause/play | `TourAutoplay`, `lib/tour-autoplay.ts` |
| Orbit-on-leash (StorySplat-lite) | `TourOrbitLeash`, `lib/orbit-leash.ts` |
| Author mode (camera + waypoints) | `ViewerAuthorPanel`, `docs/viewer-author.md` |
| Hotspots (basic) | `HotspotPin`, `HotspotPanel` |
| Embed `/e/` | `app/e/[sceneId]`, CSP `frame-ancestors *` |
| Debug overlay | `H` + `NEXT_PUBLIC_VIEWER_DEBUG` |
| Mobile/desktop chrome | `ViewerPageShell`, HUD wordmark `BrandingBadge` |
| SPZ/SOG + mobile asset fields | `render.format`, `url_mobile` (wire per scene) |
| Listings grid | `/home`, `catalog.json` |

---

## 10. Suggested immediate next sprint (ordered)

> **As of 2026-05-22:** Phases 0–1 and Phase 2 core + Phase 3 Author MVP are **done**. Viewer feature work is **paused**; highest ROI is content + distribution, not new nav modes.

### Tier A — impress / convert (do first)

1. **Rich hotspots** — video, PDF, room specs on 1–2 demo scenes (extend `hotspots[].payload`; Dioramix-inspired)
2. **Mobile splat tier** — `url_mobile` / SPZ live on best scene; test WhatsApp → phone load
3. **`.homes` polish** — real `thumbnail.webp`, listing copy, agent WhatsApp CTA
4. **Share / OG** — baked scene cards; WhatsApp link preview (see `docs/whatsapp-og-troubleshooting.md`)

### Tier B — viewer polish (when resuming GL work)

5. **Phase 4** — 3D wayfinder markers at waypoints (click → same as pill)
6. **Author: hotspot placement** — raycast + export patch
7. **`navigation.profile`** — apartment vs house presets in schema (Phase 2 remainder)

### Tier C — defer (pipeline-heavy nav)

8. **Phase 5** — floorplan SVG sync (houses)
9. **Phase 6** — portals / multi-scene
10. **Phase 7** — walk + collision (`nav_mesh` from SuperSplat)

### Study (non-blocking)

- Dioramix + mirador3d competitive notes → update `3dgs-viewer-system.md`

---

## Related docs

- [mirador-operations-guide.md](./mirador-operations-guide.md) — URLs, R2, embed
- [3dgs-viewer-system.md](../../docs/canon/gtm/tech-notes/3dgs-viewer-system.md) — competitor audit §2
- [mirador-home-setup.md](./mirador-home-setup.md) — catalog + grid
- [viewer-debug.md](./viewer-debug.md) — debug `H` pattern (template for Author mode)
