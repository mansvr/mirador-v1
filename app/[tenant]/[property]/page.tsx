import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchScene } from "@/lib/scene";
import { getSiteUrl } from "@/lib/site-url";
import {
  buildOpenGraphImages,
  ogCardApiUrl,
  shareDescription,
  shareTitle,
} from "@/lib/og";
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
    const siteUrl = await getSiteUrl();
    const title = shareTitle(scene);
    const description = shareDescription(scene);
    const ogImage = ogCardApiUrl(sceneId, siteUrl);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `${siteUrl}/${tenant}/${property}`,
        siteName: "Mirador",
        locale: "es_CO",
        images: buildOpenGraphImages(sceneId, siteUrl, title),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
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
