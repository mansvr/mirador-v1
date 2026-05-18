import type { CSSProperties } from "react";
import { SceneCanvas } from "@/components/viewer/SceneCanvas";
import { WaypointNav } from "@/components/hud/WaypointNav";
import { BrandingBadge } from "@/components/hud/BrandingBadge";
import { MetricBadge } from "@/components/hud/MetricBadge";
import { PropertyStrip } from "@/components/listing/PropertyStrip";
import { AgentCTA } from "@/components/listing/AgentCTA";
import { EmbedSnippet } from "@/components/listing/EmbedSnippet";
import type { Scene } from "@/lib/types/scene";

interface ViewerPageShellProps {
  scene: Scene;
  siteUrl: string;
}

/**
 * Shared layout for `/v/[sceneId]` and `/[tenant]/[property]`.
 * Branding CSS variable on `main` so HUD siblings inherit tenant color.
 */
export function ViewerPageShell({ scene, siteUrl }: ViewerPageShellProps) {
  const primary = scene.branding?.primary_color ?? "#FF6A00";

  return (
    <main
      className="flex min-h-dvh flex-col bg-black md:h-dvh md:overflow-hidden"
      style={{ "--mirador-primary": primary } as CSSProperties}
    >
      <div
        className="relative w-full shrink-0 h-[min(68dvh,720px)] min-h-[280px] md:h-0 md:min-h-0 md:max-h-none md:flex-1 md:basis-0 md:shrink"
        aria-label="Vista 3D"
      >
        <SceneCanvas scene={scene} heightClass="absolute inset-0 size-full min-h-0" />

        <MetricBadge metric={scene.metric} />
        <WaypointNav waypoints={scene.waypoints ?? []} sceneId={scene.id} />
        <BrandingBadge branding={scene.branding} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-white text-gray-900 md:hidden">
        <PropertyStrip
          title={scene.title}
          listing={scene.listing}
          metric={scene.metric}
        />
        <AgentCTA listing={scene.listing} sceneTitle={scene.title} />
        <EmbedSnippet sceneId={scene.id} siteUrl={siteUrl} />
      </div>
    </main>
  );
}
