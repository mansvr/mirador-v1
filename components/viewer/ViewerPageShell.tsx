import type { CSSProperties } from "react";
import { SceneCanvas } from "@/components/viewer/SceneCanvas";
import { WaypointNav } from "@/components/hud/WaypointNav";
import { BrandingBadge } from "@/components/hud/BrandingBadge";
import { MetricBadge } from "@/components/hud/MetricBadge";
import { PropertyStrip } from "@/components/listing/PropertyStrip";
import { AgentCTA } from "@/components/listing/AgentCTA";
import { EmbedSnippet } from "@/components/listing/EmbedSnippet";
import type { Scene } from "@/lib/types/scene";
import { MIRADOR_DEFAULT_PRIMARY } from "@/lib/brand";

interface ViewerPageShellProps {
  scene: Scene;
  siteUrl: string;
}

/**
 * Shared layout for `/v/[sceneId]` and `/[tenant]/[property]`.
 * Branding CSS variable on `main` so HUD siblings inherit tenant color.
 */
export function ViewerPageShell({ scene, siteUrl }: ViewerPageShellProps) {
  const primary = scene.branding?.primary_color ?? MIRADOR_DEFAULT_PRIMARY;

  return (
    <main
      className="mirador-viewer-chrome flex min-h-dvh flex-col md:h-dvh md:overflow-hidden"
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

        <div className="pointer-events-none absolute bottom-16 right-4 z-20 hidden max-w-sm md:block">
          <div className="pointer-events-auto rounded-xl border border-white/10 bg-black/80 p-3 shadow-xl backdrop-blur-md">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/50">
              Embed en tu web
            </p>
            <EmbedSnippet sceneId={scene.id} siteUrl={siteUrl} compact />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col border-t border-mirador-border bg-mirador-surface text-mirador-text md:hidden">
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
