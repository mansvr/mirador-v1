import type { CSSProperties } from "react";
import { HomeFooter, HomeHeader, SitePageShell } from "@/components/home/HomeShell";
import { TourViewerFrame } from "@/components/viewer/TourViewerFrame";
import { PropertyStrip } from "@/components/listing/PropertyStrip";
import { AgentCTA } from "@/components/listing/AgentCTA";
import { EmbedSnippet } from "@/components/listing/EmbedSnippet";
import { getPriceLabelForScene } from "@/lib/listings/get-listings";
import { isPlayCanvasScene } from "@/lib/viewer-engine";
import type { Scene } from "@/lib/types/scene";
import { MIRADOR_DEFAULT_PRIMARY } from "@/lib/brand";

interface ViewerPageShellProps {
  scene: Scene;
  siteUrl: string;
}

/**
 * Full tour page (`/v/…`, tenant slugs): site chrome + vrestate-style contained
 * iframe viewer and listing card — not a full-viewport GL column.
 */
export async function ViewerPageShell({ scene, siteUrl }: ViewerPageShellProps) {
  const primary = scene.branding?.primary_color ?? MIRADOR_DEFAULT_PRIMARY;
  const priceLabel = await getPriceLabelForScene(scene.id);
  const playCanvas = isPlayCanvasScene(scene);

  return (
    <SitePageShell style={{ "--mirador-primary": primary } as CSSProperties}>
      <HomeHeader />

      <main className="mx-auto flex w-full min-w-0 max-w-6xl flex-1 flex-col justify-center px-4 py-8 sm:px-5 md:px-6 md:py-10">
        <div className="grid w-full min-w-0 max-w-full grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-center xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
          <section className="min-w-0 max-w-full" aria-label="Tour 3D">
            <TourViewerFrame scene={scene} />
            <p className="mt-3 max-w-full text-pretty px-0.5 text-center text-xs text-mirador-text-muted sm:text-sm lg:text-left">
              {playCanvas
                ? "Recorrido guiado · arrastra para mirar · ‹ ▶ › en el visor"
                : "Arrastra para mirar · usa los puntos del recorrido en el visor"}
            </p>
          </section>

          <aside
            className="flex min-w-0 max-w-full flex-col gap-4 sm:gap-6"
            aria-label="Detalles del inmueble"
          >
            <div className="overflow-hidden rounded-xl border border-mirador-border bg-mirador-surface shadow-sm">
              <PropertyStrip
                title={scene.title}
                listing={scene.listing}
                metric={scene.metric}
                priceLabel={priceLabel}
                variant="sidebar"
              />
              <AgentCTA listing={scene.listing} sceneTitle={scene.title} variant="card" />
            </div>

            <div className="overflow-hidden rounded-xl border border-mirador-border bg-mirador-surface shadow-sm">
              <EmbedSnippet
                sceneId={scene.id}
                siteUrl={siteUrl}
                variant="card"
                collapsible
              />
            </div>
          </aside>
        </div>
      </main>

      <HomeFooter />
    </SitePageShell>
  );
}
