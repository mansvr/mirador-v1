import { MiradorWordmark } from "@/components/brand/MiradorMark";
import type { SceneBranding } from "@/lib/types/scene";

interface BrandingBadgeProps {
  branding?: SceneBranding;
}

export function BrandingBadge({ branding }: BrandingBadgeProps) {
  const showBadge = branding?.show_mirador_badge ?? true;
  const logoUrl = branding?.logo_url;

  if (!showBadge && !logoUrl) return null;

  return (
    <div className="absolute bottom-12 left-2 z-10 flex max-w-[40%] items-center gap-1.5 select-none pointer-events-none sm:bottom-4 sm:left-4 sm:max-w-none">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="Brand" className="h-6 object-contain" />
      ) : (
        <MiradorWordmark onDark size="sm" className="text-white/60" />
      )}
    </div>
  );
}
