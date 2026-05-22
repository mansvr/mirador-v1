import { fetchScene } from "@/lib/scene";
import { SceneCanvas } from "@/components/viewer/SceneCanvas";
import { ViewerViewport } from "@/components/viewer/ViewerViewport";
import { WaypointNav } from "@/components/hud/WaypointNav";
import { BrandingBadge } from "@/components/hud/BrandingBadge";
import { MetricBadge } from "@/components/hud/MetricBadge";

interface Props {
  params: Promise<{ sceneId: string }>;
}

/**
 * Embeddable iframe variant — no outer listing chrome.
 * X-Frame-Options: ALLOWALL is set in next.config.ts for this route.
 */
export default async function EmbedPage({ params }: Props) {
  const { sceneId } = await params;
  const scene = await fetchScene(sceneId);

  return (
    <ViewerViewport
      label={scene.title}
      className="h-dvh w-full min-h-0"
    >
      <SceneCanvas scene={scene} heightClass="absolute inset-0 size-full min-h-0" />
      <MetricBadge metric={scene.metric} />
      <WaypointNav scene={scene} />
      <BrandingBadge branding={scene.branding} />
    </ViewerViewport>
  );
}
