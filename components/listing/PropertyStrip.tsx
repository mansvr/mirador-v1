import type { SceneListing, SceneMetric } from "@/lib/types/scene";

interface PropertyStripProps {
  title: string;
  listing?: SceneListing;
  metric?: SceneMetric;
}

export function PropertyStrip({ title, listing, metric }: PropertyStripProps) {
  return (
    <div className="px-4 py-4 md:px-6">
      <h1 className="text-xl font-medium text-mirador-text mb-1">{title}</h1>

      {listing?.address && (
        <p className="text-sm text-mirador-text-muted mb-3">
          {listing.address}
          {listing.neighborhood ? `, ${listing.neighborhood}` : ""}
          {listing.city ? ` · ${listing.city}` : ""}
        </p>
      )}

      {/* Stats row */}
      {metric && (
        <div className="flex flex-wrap gap-4 text-sm text-mirador-text mb-3">
          {metric.rooms != null && (
            <span className="flex items-center gap-1">
              <span className="text-mirador-text-muted">🛏</span> {metric.rooms} hab.
            </span>
          )}
          {metric.bathrooms != null && (
            <span className="flex items-center gap-1">
              <span className="text-mirador-text-muted">🚿</span> {metric.bathrooms} baños
            </span>
          )}
          {metric.area_m2 != null && (
            <span className="flex items-center gap-1">
              <span className="text-mirador-text-muted">◻</span> {metric.area_m2} m²
              {metric.verified_by && metric.verified_by !== "unverified" && (
                <span className="text-green-500 text-xs ml-0.5" title="Medidas verificadas">✓</span>
              )}
            </span>
          )}
          {metric.ceiling_m != null && (
            <span className="flex items-center gap-1">
              <span className="text-mirador-text-muted">↕</span> {metric.ceiling_m}m altura
            </span>
          )}
        </div>
      )}

      {listing?.description_md && (
        <p className="text-sm text-mirador-text-muted leading-relaxed whitespace-pre-line">
          {listing.description_md}
        </p>
      )}
    </div>
  );
}
