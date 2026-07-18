import "server-only";

import type { Scene } from "@/lib/types/scene";
import { OG_CARD_ACCENT, OG_EYEBROW, OG_SITE_SUBTITLE } from "@/lib/og-copy";
import { ogThumbnailSourceForCard, shareTitle } from "@/lib/og";

export {
  OG_CARD_ACCENT,
  OG_EYEBROW,
  OG_MARKETING_TITLE,
  OG_SITE_SUBTITLE,
} from "@/lib/og-copy";

export async function ogCardPropsForScene(sceneId: string, scene: Scene) {
  return {
    eyebrow: OG_EYEBROW,
    title: shareTitle(scene),
    subtitle: OG_SITE_SUBTITLE,
    accent: OG_CARD_ACCENT,
    thumbSrc: await ogThumbnailSourceForCard(sceneId),
  };
}
