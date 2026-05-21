import type { SceneListing, SceneMetric } from "@/lib/types/scene";

function formatListingLocation(listing: SceneListing): string | null {
  if (listing.address) {
    const tail = [listing.neighborhood, listing.city].filter(Boolean).join(" · ");
    return tail ? `${listing.address} · ${tail}` : listing.address;
  }
  const line = [listing.neighborhood, listing.city].filter(Boolean).join(" · ");
  return line || null;
}

interface PropertyStripProps {
  title: string;
  listing?: SceneListing;
  metric?: SceneMetric;
  /** From listings catalog when scene is on /home grid */
  priceLabel?: string;
  /** Sidebar on tour page (larger type); default strip for legacy embeds */
  variant?: "default" | "sidebar";
}

export function PropertyStrip({
  title,
  listing,
  metric,
  priceLabel,
  variant = "default",
}: PropertyStripProps) {
  const isSidebar = variant === "sidebar";

  return (
    <div className={isSidebar ? "px-5 py-5 md:px-6 md:py-6" : "px-4 py-4 md:px-6"}>
      <h1
        className={
          isSidebar
            ? "mb-1 text-balance text-xl font-medium leading-tight tracking-tight text-mirador-text break-words sm:text-2xl"
            : "mb-1 text-xl font-medium text-mirador-text break-words"
        }
      >
        {title}
      </h1>

      {priceLabel && isSidebar && (
        <p className="mb-2 text-lg font-medium tracking-tight text-mirador-text break-words sm:text-xl">
          {priceLabel}
        </p>
      )}

      {listing && formatListingLocation(listing) && (
        <p
          className={
            isSidebar
              ? "text-sm text-mirador-text-muted mb-4"
              : "text-sm text-mirador-text-muted mb-3"
          }
        >
          {formatListingLocation(listing)}
        </p>
      )}

      {/* Stats row */}
      {metric && (
        <div
          className={
            isSidebar
              ? "flex flex-wrap gap-x-5 gap-y-2 text-sm text-mirador-text mb-4 pb-4 border-b border-mirador-border"
              : "flex flex-wrap gap-4 text-sm text-mirador-text mb-3"
          }
        >
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
