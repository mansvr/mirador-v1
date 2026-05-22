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
    <div
      className={[
        "absolute top-2 left-2 z-10 flex max-w-[40%] items-center gap-1.5 select-none pointer-events-none",
        "origin-top-left scale-[0.89]",
        "sm:top-auto sm:bottom-4 sm:left-4 sm:max-w-none sm:scale-100 sm:origin-bottom-left",
      ].join(" ")}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="Brand" className="h-9 object-contain" />
      ) : (
        <MiradorWordmark onDark size="sm" className="text-white/60" />
      )}
    </div>
  );
}
