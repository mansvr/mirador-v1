import type { SceneListing } from "@/lib/types/scene";

interface AgentCTAProps {
  listing?: SceneListing;
  sceneTitle: string;
}

export function AgentCTA({ listing, sceneTitle }: AgentCTAProps) {
  if (!listing?.agent_whatsapp) return null;

  const message = encodeURIComponent(
    `Hola, vi el tour virtual de "${sceneTitle}" y me gustaría obtener más información.`
  );
  const href = `https://wa.me/${listing.agent_whatsapp.replace(/[^0-9]/g, "")}?text=${message}`;

  return (
    <div className="border-t border-mirador-border px-4 py-4 md:px-6 bg-mirador-surface">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 2.163c-5.415 0-9.837 4.422-9.837 9.837 0 1.741.457 3.376 1.255 4.796L2 22l5.336-1.397A9.806 9.806 0 0012 22c5.415 0 9.837-4.422 9.837-9.837C21.837 6.585 17.415 2.163 12 2.163z"/>
        </svg>
        {listing.agent_name
          ? `Contactar a ${listing.agent_name}`
          : "Contactar al agente"}
      </a>
    </div>
  );
}
