import type { PropertyMicrosite } from "@/lib/demo1/types";
import { OutboundLink } from "@/components/demo1/OutboundLink";
import { SacredIcon } from "@/components/demo1/SacredIcon";
import { whatsappHref } from "@/lib/demo1/property";

interface AgentBlockProps {
  property: PropertyMicrosite;
}

export function AgentBlock({ property }: AgentBlockProps) {
  const waLink = whatsappHref(
    property.agent.whatsapp,
    `Hola ${property.agent.name}, quiero agendar una visita a ${property.hero.title}.`,
  );

  return (
    <section id="contacto" className="bg-surface px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-bg p-8 sm:p-12">
        <p className="label-sacred text-text-muted">Contacto</p>
        <h2 className="mt-2 font-display text-3xl text-text">{property.agent.name}</h2>
        <p className="mt-3 max-w-lg text-text-muted">{property.hero.description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <OutboundLink
            href={waLink}
            channel="whatsapp"
            placement="agent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white transition-sacred hover:bg-accent-hover"
          >
            <SacredIcon name="solar:chat-round-dots-linear" size={18} color="FFFFFF" />
            {property.ctas.secondary}
          </OutboundLink>
          <OutboundLink
            href={`tel:${property.agent.phone.replace(/\s/g, "")}`}
            channel="phone"
            placement="agent"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-6 text-sm font-medium text-text transition-sacred hover:bg-surface"
          >
            <SacredIcon name="solar:phone-linear" size={18} />
            {property.agent.phone}
          </OutboundLink>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 p-4 backdrop-blur-md sm:hidden">
        <OutboundLink
          href={waLink}
          channel="whatsapp"
          placement="sticky"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-medium text-white transition-sacred hover:bg-accent-hover"
        >
          <SacredIcon name="solar:chat-round-dots-linear" size={18} color="FFFFFF" />
          {property.ctas.secondary}
        </OutboundLink>
      </div>
    </section>
  );
}
