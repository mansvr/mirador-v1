import { fetchScene } from "@/lib/scene";
import { SceneCanvas } from "@/components/viewer/SceneCanvas";
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
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <SceneCanvas scene={scene} heightClass="h-screen" />
      <MetricBadge metric={scene.metric} />
      <WaypointNav waypoints={scene.waypoints ?? []} sceneId={scene.id} />
      <BrandingBadge branding={scene.branding} />
    </div>
  );
}
