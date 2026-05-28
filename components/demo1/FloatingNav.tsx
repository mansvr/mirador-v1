"use client";

import Link from "next/link";
import { MiradorWordmark } from "@/components/brand/MiradorMark";
import { OutboundLink } from "@/components/demo1/OutboundLink";
import { LocaleToggle } from "@/components/demo1/LocaleToggle";
import { useDemo1Locale } from "@/components/demo1/Demo1LocaleProvider";
import { whatsappHref } from "@/lib/demo1/property";

const navLinkClass =
  "transition-sacred hover:text-hero-glass-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-glass-text/40";

export function FloatingNav() {
  const { property, messages } = useDemo1Locale();
  const waLink = whatsappHref(property.agent.whatsapp, property.whatsappNavText);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav
        className="mx-auto grid w-full max-w-lg grid-cols-[1fr_auto_1fr] items-center gap-x-3 rounded-full border border-hero-glass-text/15 bg-hero-scrim/48 px-3 py-2.5 backdrop-blur-md sm:max-w-xl sm:gap-x-5 sm:px-4"
        aria-label="Principal"
      >
        <Link
          href="/"
          className="justify-self-start transition-sacred hover:opacity-90"
          aria-label={messages.nav.homeAria}
        >
          <MiradorWordmark
            size="sm"
            className="text-hero-glass-text [&_svg]:text-hero-glass-text"
          />
        </Link>

        <div className="flex items-center justify-center gap-2.5 text-sm text-hero-glass-text/85 sm:gap-5">
          <a href="#galeria" className={navLinkClass}>
            {messages.nav.gallery}
          </a>
          <a href="#contacto" className={navLinkClass}>
            {messages.nav.contact}
          </a>
          <LocaleToggle />
        </div>

        <OutboundLink
          href={waLink}
          channel="whatsapp"
          placement="nav"
          target="_blank"
          rel="noopener noreferrer"
          className="justify-self-end inline-flex min-h-9 shrink-0 items-center justify-center rounded-full bg-accent px-3.5 text-sm font-medium text-hero-glass-text transition-sacred hover:bg-text-emphasis sm:min-h-11 sm:px-4"
        >
          {messages.nav.whatsapp}
        </OutboundLink>
      </nav>
    </header>
  );
}
