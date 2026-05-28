import Link from "next/link";
import { MiradorWordmark } from "@/components/brand/MiradorMark";
import { OutboundLink } from "@/components/demo1/OutboundLink";
import type { PropertyMicrosite } from "@/lib/demo1/types";
import { whatsappHref } from "@/lib/demo1/property";

interface FloatingNavProps {
  property: PropertyMicrosite;
}

export function FloatingNav({ property }: FloatingNavProps) {
  const waLink = whatsappHref(
    property.agent.whatsapp,
    `Hola, me interesa ${property.hero.title}`,
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-hero-glass-text/15 bg-hero-scrim/48 px-4 py-2.5 backdrop-blur-md">
        <Link href="/" className="transition-sacred hover:opacity-90">
          <MiradorWordmark onDark size="sm" className="text-hero-glass-text" />
        </Link>
        <div className="hidden items-center gap-6 text-sm text-hero-glass-text/85 sm:flex">
          <a
            href="#galeria"
            className="transition-sacred hover:text-hero-glass-text"
          >
            Galería
          </a>
          <a
            href="#contacto"
            className="transition-sacred hover:text-hero-glass-text"
          >
            Contacto
          </a>
        </div>
        <OutboundLink
          href={waLink}
          channel="whatsapp"
          placement="nav"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-accent px-4 text-sm font-medium text-hero-glass-text transition-sacred hover:bg-text-emphasis"
        >
          WhatsApp
        </OutboundLink>
      </nav>
    </header>
  );
}
