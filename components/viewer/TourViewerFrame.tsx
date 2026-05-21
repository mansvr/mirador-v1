import { SceneCanvas } from "@/components/viewer/SceneCanvas";
import { WaypointNav } from "@/components/hud/WaypointNav";
import { BrandingBadge } from "@/components/hud/BrandingBadge";
import { MetricBadge } from "@/components/hud/MetricBadge";
import type { Scene } from "@/lib/types/scene";

interface TourViewerFrameProps {
  scene: Scene;
}

/**
 * Bounded tour viewport on `/v/…` — inline GL (not iframe) so localhost and R2
 * URLs match the parent page. External sites still embed `/e/…` in an iframe.
 */
export function TourViewerFrame({ scene }: TourViewerFrameProps) {
  return (
    <div
      className="relative aspect-[16/10] w-full min-w-0 max-w-full min-h-[200px] overflow-hidden rounded-xl border border-mirador-border bg-[#121212] shadow-sm sm:min-h-[240px] max-h-[min(72dvh,720px)]"
      aria-label={scene.title}
    >
      <SceneCanvas scene={scene} heightClass="absolute inset-0 size-full min-h-0" />
      <MetricBadge metric={scene.metric} />
      <WaypointNav waypoints={scene.waypoints ?? []} sceneId={scene.id} />
      <BrandingBadge branding={scene.branding} />
    </div>
  );
}
