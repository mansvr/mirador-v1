# Spark assets, LoD, and Mirador splat budgets

Mirador maps `scene.json` → Spark:

| `scene.json` | Spark |
|--------------|-------|
| `splat_budget_desktop` / `splat_budget_mobile` | `SparkRenderer.lodSplatCount`, `SplatMesh.maxSplats` |
| (auto) | `SplatMesh.lod: true`, `SparkRenderer.enableLod: true` |

Implementation: `lib/spark-viewer-config.ts`, `SparkInit`, `SplatScene`.

## File formats (Spark)

Spark supports PLY, **SPZ**, SPLAT, KSPLAT, **SOG** (PlayCanvas SOG → `PCSOGSZIP` internally), RAD, etc. See [Spark Getting Started](https://sparkjs.dev/docs/) and the package README.

| Extension | LoD / paging notes |
|-----------|-------------------|
| **`.sog`** | PlayCanvas SOG (zip bundle). Spark decodes and can build **runtime LoD** when `lod: true` on load. This is what Mirador uses today. |
| **`.spz`** | Niantic SPZ; Spark-native, good for web. LoD tree can be embedded or built at load. |
| **`.ply` / `.splat` / `.ksplat`** | Loaded as packed splats; enable `lod: true` for Spark-generated LoD where supported. |
| **Paged / RAD** | Best for **streaming** large scenes (chunk fetch). Not wired in Mirador yet. |

“Prefer LoD/paging” means: use formats Spark can **subsample per frame** (SOG/SPZ with `lod: true`, or pre-built paged/RAD assets), not a single flat 5M blob with no LoD path.

## Tuning per scene

In `scenes/<id>/scene.json`:

```json
"render": {
  "splat_budget_desktop": 2000000,
  "splat_budget_mobile": 750000
}
```

Lower `_mobile` for heavy indoor scans; raise desktop only if profiling shows headroom.

## Docs

- [Spark Level-of-Detail](https://sparkjs.dev/docs/) (TOC)
- [Performance tuning](https://sparkjs.dev/docs/) (TOC)
- Dev overlay: `docs/viewer-debug.md`
