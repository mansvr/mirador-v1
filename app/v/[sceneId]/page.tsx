import type { Metadata } from "next";
import { fetchScene } from "@/lib/scene";
import { getSiteUrl } from "@/lib/site-url";
import {
  buildOpenGraphImages,
  ogCardAbsoluteUrl,
  ogCardApiUrl,
  shareDescription,
  shareTitle,
} from "@/lib/og";
import { ViewerPageShell } from "@/components/viewer/ViewerPageShell";

interface Props {
  params: Promise<{ sceneId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sceneId } = await params;

  try {
    const scene = await fetchScene(sceneId);
    const siteUrl = await getSiteUrl();
    const title = shareTitle(scene);
    const description = shareDescription(scene);
    const ogImage =
      ogCardAbsoluteUrl(sceneId, siteUrl) ?? ogCardApiUrl(sceneId, siteUrl);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `${siteUrl}/v/${sceneId}`,
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

export default async function ViewerPage({ params }: Props) {
  const { sceneId } = await params;
  const scene = await fetchScene(sceneId);
  const siteUrl = await getSiteUrl();

  return <ViewerPageShell scene={scene} siteUrl={siteUrl} />;
}