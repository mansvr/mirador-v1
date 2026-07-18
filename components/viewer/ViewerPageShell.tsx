import type { CSSProperties } from "react";
import { HomeFooter, HomeHeader, SitePageShell } from "@/components/home/HomeShell";
import { TourViewerFrame } from "@/components/viewer/TourViewerFrame";
import { PropertyStrip } from "@/components/listing/PropertyStrip";
import { AgentCTA } from "@/components/listing/AgentCTA";
import { EmbedSnippet } from "@/components/listing/EmbedSnippet";
import { CaseStudyBody } from "@/components/listing/CaseStudyBody";
import { LocationMap } from "@/components/listing/LocationMap";
import { SceneGallery, type GalleryImage } from "@/components/listing/SceneGallery";
import { CaptureMethodFicha } from "@/components/listing/CaptureMethodFicha";
import { getPriceLabelForScene } from "@/lib/listings/get-listings";
import { isPlayCanvasScene } from "@/lib/viewer-engine";
import { resolvePublicAssetUrl } from "@/lib/r2";
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

  const galleryImages: GalleryImage[] = (scene.gallery ?? []).map((item) => ({
    src: resolvePublicAssetUrl(scene.id, item.url),
    caption: item.caption,
    alt: item.alt,
  }));
  const locationLabel =
    [scene.listing?.neighborhood, scene.listing?.city].filter(Boolean).join(" · ") || undefined;
  const hasEnrichment =
    Boolean(scene.listing?.story_md?.trim()) ||
    galleryImages.length > 0 ||
    Boolean(scene.context?.macro) ||
    Boolean(scene.capture_method);

  return (
    <SitePageShell style={{ "--mirador-primary": primary } as CSSProperties}>
      <HomeHeader />

      <main className="mx-auto flex w-full min-w-0 max-w-6xl flex-1 flex-col justify-center px-4 py-8 sm:px-5 md:px-6 md:py-10">
        <div className="grid w-full min-w-0 max-w-full grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-center xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
          <section className="min-w-0 max-w-full" aria-label="Tour 3D">
            <TourViewerFrame scene={scene} />
            <p className="mt-3 max-w-full text-pretty px-0.5 text-center text-xs text-mirador-text-muted sm:text-sm lg:text-left">
              {playCanvas
                ? scene.id === "scene_pablos01"
                  ? "Explora libre · arrastra para mirar · camina entre salas"
                  : "Recorrido guiado · arrastra para mirar · ‹ ▶ › en el visor"
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

        {hasEnrichment && (
          <div className="mt-8 flex w-full min-w-0 max-w-full flex-col gap-6 sm:mt-10 sm:gap-8">
            <CaseStudyBody storyMd={scene.listing?.story_md} />
            <SceneGallery images={galleryImages} />
            <LocationMap macro={scene.context?.macro} locationLabel={locationLabel} />
            <CaptureMethodFicha captureMethod={scene.capture_method} />
          </div>
        )}
      </main>

      <HomeFooter />
    </SitePageShell>
  );
}
