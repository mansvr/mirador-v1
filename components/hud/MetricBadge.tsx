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
    <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full select-none pointer-events-none">
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
