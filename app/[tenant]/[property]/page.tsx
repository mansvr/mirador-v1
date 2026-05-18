import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchScene } from "@/lib/scene";
import { getSiteUrl } from "@/lib/site-url";
import { resolveSceneIdFromSlugs } from "@/lib/tenants";
import { ViewerPageShell } from "@/components/viewer/ViewerPageShell";

interface Props {
  params: Promise<{ tenant: string; property: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant, property } = await params;
  const sceneId = resolveSceneIdFromSlugs(tenant, property);
  if (!sceneId) return { title: "Mirador" };

  try {
    const scene = await fetchScene(sceneId);
    return {
      title: scene.title,
      description:
        scene.listing?.description_md?.slice(0, 160) ??
        `Tour virtual 3D de ${scene.title}`,
      openGraph: {
        title: scene.title,
        description:
          scene.listing?.description_md?.slice(0, 160) ??
          `Tour virtual 3D de ${scene.title}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: scene.title,
      },
    };
  } catch {
    return { title: "Mirador" };
  }
}

export default async function TenantPropertyPage({ params }: Props) {
  const { tenant, property } = await params;
  const sceneId = resolveSceneIdFromSlugs(tenant, property);
  if (!sceneId) notFound();

  const scene = await fetchScene(sceneId);
  const siteUrl = await getSiteUrl();

  return <ViewerPageShell scene={scene} siteUrl={siteUrl} />;
}
