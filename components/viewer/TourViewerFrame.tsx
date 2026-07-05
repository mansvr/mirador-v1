import { ViewerGlSurface } from "@/components/viewer/ViewerGlSurface";
import { ViewerViewport } from "@/components/viewer/ViewerViewport";
import { WaypointNav } from "@/components/hud/WaypointNav";
import { BrandingBadge } from "@/components/hud/BrandingBadge";
import { isPlayCanvasScene } from "@/lib/viewer-engine";
import type { Scene } from "@/lib/types/scene";

interface TourViewerFrameProps {
  scene: Scene;
}

/**
 * Bounded tour viewport on `/v/…` — inline GL (not iframe) so localhost and R2
 * URLs match the parent page. External sites still embed `/e/…` in an iframe.
 */
export function TourViewerFrame({ scene }: TourViewerFrameProps) {
  const playCanvas = isPlayCanvasScene(scene);

  return (
    <ViewerViewport
      label={scene.title}
      className="aspect-[16/10] w-full min-w-0 max-w-full min-h-[200px] rounded-xl border border-mirador-border shadow-sm sm:min-h-[240px] max-h-[min(72dvh,720px)]"
    >
      <ViewerGlSurface scene={scene} heightClass="absolute inset-0 size-full min-h-0" />
      {!playCanvas ? <WaypointNav scene={scene} /> : null}
      <BrandingBadge branding={scene.branding} />
    </ViewerViewport>
  );
}
