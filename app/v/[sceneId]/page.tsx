import type { Metadata } from "next";
import { fetchScene } from "@/lib/scene";
import { thumbnailUrl } from "@/lib/r2";
import { SceneCanvas } from "@/components/viewer/SceneCanvas";
import { WaypointNav } from "@/components/hud/WaypointNav";
import { BrandingBadge } from "@/components/hud/BrandingBadge";
import { MetricBadge } from "@/components/hud/MetricBadge";
import { PropertyStrip } from "@/components/listing/PropertyStrip";
import { AgentCTA } from "@/components/listing/AgentCTA";
import { EmbedSnippet } from "@/components/listing/EmbedSnippet";

interface Props {
  params: Promise<{ sceneId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sceneId } = await params;

  try {
    const scene = await fetchScene(sceneId);
    const thumb = thumbnailUrl(sceneId);

    return {
      title: scene.title,
      description: scene.listing?.description_md?.slice(0, 160) ?? `Tour virtual 3D de ${scene.title}`,
      openGraph: {
        title: scene.title,
        description: scene.listing?.description_md?.slice(0, 160) ?? `Tour virtual 3D de ${scene.title}`,
        images: [{ url: thumb, width: 1200, height: 630 }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: scene.title,
        images: [thumb],
      },
    };
  } catch {
    return { title: "Mirador" };
  }
}

export default async function ViewerPage({ params }: Props) {
  const { sceneId } = await params;
  const scene = await fetchScene(sceneId);

  return (
    <main className="flex flex-col min-h-screen bg-black">
      {/* ── 3D Canvas ───────────────────────────────────────────────────── */}
      <div className="relative flex-1 min-h-[60vh] md:min-h-screen">
        <SceneCanvas scene={scene} heightClass="h-full min-h-[60vh] md:min-h-screen" />

        {/* HUD overlays — positioned absolute inside the canvas wrapper */}
        <MetricBadge metric={scene.metric} />
        <WaypointNav waypoints={scene.waypoints ?? []} sceneId={scene.id} />
        <BrandingBadge branding={scene.branding} />
      </div>

      {/* ── Listing chrome (below canvas on mobile, sidebar on desktop) ── */}
      <div className="bg-white text-gray-900 md:hidden">
        <PropertyStrip
          title={scene.title}
          listing={scene.listing}
          metric={scene.metric}
        />
        <AgentCTA listing={scene.listing} sceneTitle={scene.title} />
        <EmbedSnippet sceneId={scene.id} />
      </div>
    </main>
  );
}
