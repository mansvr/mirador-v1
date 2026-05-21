import type { SceneMetric } from "@/lib/types/scene";

interface MetricBadgeProps {
  metric?: SceneMetric;
}

export function MetricBadge({ metric }: MetricBadgeProps) {
  if (!metric) return null;

  const { area_m2, ceiling_m, verified_by } = metric;
  const isVerified = verified_by && verified_by !== "unverified";

  if (!area_m2 && !ceiling_m) return null;

  const parts: string[] = [];
  if (area_m2) parts.push(`${area_m2} m²`);
  if (ceiling_m) parts.push(`${ceiling_m}m ceil.`);

  return (
    <div className="absolute top-2 right-2 z-10 flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-full bg-black/50 px-2 py-1 backdrop-blur-sm select-none pointer-events-none sm:top-4 sm:right-4 sm:px-2.5">
      {isVerified && (
        <span className="text-green-400 text-xs" title={`Verified by ${verified_by}`}>
          ✓
        </span>
      )}
      <span className="text-white/80 text-xs font-medium tracking-wide">
        {parts.join(" · ")}
      </span>
    </div>
  );
}
