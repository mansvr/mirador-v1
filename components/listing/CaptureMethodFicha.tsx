import type { SceneCaptureMethod } from "@/lib/types/scene";

interface CaptureMethodFichaProps {
  captureMethod?: SceneCaptureMethod;
}

/**
 * Bottom-of-page technical ficha for how the tour was produced. This turns the
 * pipeline into a trust asset: capture method, reconstruction path, viewer, and
 * deliverable, without crowding the listing card.
 */
export function CaptureMethodFicha({ captureMethod }: CaptureMethodFichaProps) {
  if (!captureMethod) return null;
  const rows = captureMethod.rows ?? [];
  if (!captureMethod.summary?.trim() && rows.length === 0 && !captureMethod.notes?.trim()) {
    return null;
  }

  return (
    <section
      aria-label={captureMethod.title ?? "Ficha técnica de captura"}
      className="rounded-xl border border-mirador-border bg-mirador-surface p-5 shadow-sm sm:p-6"
    >
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-mirador-text-muted">
        Producción Mirador
      </p>
      <h2 className="text-lg font-medium tracking-tight text-mirador-text sm:text-xl">
        {captureMethod.title ?? "Ficha técnica de captura"}
      </h2>
      {captureMethod.summary && (
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-mirador-text-muted">
          {captureMethod.summary}
        </p>
      )}

      {rows.length > 0 && (
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <div key={row.label} className="rounded-lg border border-mirador-border/70 p-3">
              <dt className="text-xs uppercase tracking-wide text-mirador-text-muted">
                {row.label}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-mirador-text">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {captureMethod.notes && (
        <p className="mt-4 text-xs leading-relaxed text-mirador-text-muted">
          {captureMethod.notes}
        </p>
      )}
    </section>
  );
}
