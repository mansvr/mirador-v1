import type { SceneListing, SceneMetric } from "@/lib/types/scene";

interface PropertyStripProps {
  title: string;
  listing?: SceneListing;
  metric?: SceneMetric;
}

export function PropertyStrip({ title, listing, metric }: PropertyStripProps) {
  return (
    <div className="bg-white border-t border-gray-100 px-4 py-4 md:px-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">{title}</h1>

      {listing?.address && (
        <p className="text-sm text-gray-500 mb-3">
          {listing.address}
          {listing.neighborhood ? `, ${listing.neighborhood}` : ""}
          {listing.city ? ` · ${listing.city}` : ""}
        </p>
      )}

      {/* Stats row */}
      {metric && (
        <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-3">
          {metric.rooms != null && (
            <span className="flex items-center gap-1">
              <span className="text-gray-400">🛏</span> {metric.rooms} hab.
            </span>
          )}
          {metric.bathrooms != null && (
            <span className="flex items-center gap-1">
              <span className="text-gray-400">🚿</span> {metric.bathrooms} baños
            </span>
          )}
          {metric.area_m2 != null && (
            <span className="flex items-center gap-1">
              <span className="text-gray-400">◻</span> {metric.area_m2} m²
              {metric.verified_by && metric.verified_by !== "unverified" && (
                <span className="text-green-500 text-xs ml-0.5" title="Medidas verificadas">✓</span>
              )}
            </span>
          )}
          {metric.ceiling_m != null && (
            <span className="flex items-center gap-1">
              <span className="text-gray-400">↕</span> {metric.ceiling_m}m altura
            </span>
          )}
        </div>
      )}

      {listing?.description_md && (
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {listing.description_md}
        </p>
      )}
    </div>
  );
}
