"use client";

import Image from "next/image";
import { OutboundLink } from "@/components/demo1/OutboundLink";
import { SacredIcon } from "@/components/demo1/SacredIcon";
import { useDemo1Locale } from "@/components/demo1/Demo1LocaleProvider";
import { whatsappHref } from "@/lib/demo1/property";

export function AgentBlock() {
  const { property, messages } = useDemo1Locale();
  const waLink = whatsappHref(property.agent.whatsapp, property.whatsappAgentText);

  return (
    <section id="contacto" className="bg-surface px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-bg p-8 sm:p-12">
        <p className="label-sacred text-text-muted">{messages.contact.eyebrow}</p>
        <div className="mt-4 flex items-center gap-4 sm:gap-5">
          {property.agent.photoUrl ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-border-subtle bg-surface-alt sm:h-20 sm:w-20">
              <Image
                src={property.agent.photoUrl}
                alt={property.agent.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ) : null}
          <h2 className="font-display text-3xl text-text sm:text-4xl">
            {property.agent.name}
          </h2>
        </div>
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
