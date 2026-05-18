import type { SceneBranding } from "@/lib/types/scene";

interface BrandingBadgeProps {
  branding?: SceneBranding;
}

export function BrandingBadge({ branding }: BrandingBadgeProps) {
  const showBadge = branding?.show_mirador_badge ?? true;
  const logoUrl = branding?.logo_url;

  if (!showBadge && !logoUrl) return null;

  return (
    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 select-none pointer-events-none">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="Brand" className="h-6 object-contain" />
      ) : (
        <span className="text-white/50 text-xs tracking-[0.2em] uppercase font-light">
          Mirador
        </span>
      )}
    </div>
  );
}
