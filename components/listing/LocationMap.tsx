import type { SceneContextMacro } from "@/lib/types/scene";

interface LocationMapProps {
  /** From `scene.context.macro` — provides lat/lng/zoom. */
  macro?: SceneContextMacro;
  /** Optional label for the "open in Maps" link, e.g. "La Macarena · Bogotá". */
  locationLabel?: string;
}

/**
 * Keyless map widget for the `/v` page. Uses Google Maps' `output=embed` iframe
 * (no API key required) centered on `context.macro` lat/lng. Renders nothing when
 * no geo is set, so it stays optional per scene.
 */
export function LocationMap({ macro, locationLabel }: LocationMapProps) {
  if (!macro || typeof macro.lat !== "number" || typeof macro.lng !== "number") {
    return null;
  }

  const zoom = macro.zoom ?? 15;
  const q = `${macro.lat},${macro.lng}`;
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

  return (
    <section
      aria-label="Ubicación"
      className="overflow-hidden rounded-xl border border-mirador-border bg-mirador-surface shadow-sm"
    >
      <div className="flex items-center justify-between px-5 pt-5 sm:px-6">
        <h2 className="text-lg font-medium tracking-tight text-mirador-text sm:text-xl">Ubicación</h2>
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-mirador-text-muted underline underline-offset-2 hover:opacity-80"
        >
          Ver en Maps
        </a>
      </div>
      {locationLabel && (
        <p className="px-5 pt-1 text-sm text-mirador-text-muted sm:px-6">{locationLabel}</p>
      )}
      <div className="mt-4 aspect-[16/9] w-full">
        <iframe
          title={`Mapa — ${locationLabel ?? q}`}
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
          allowFullScreen
        />
      </div>
    </section>
  );
}
