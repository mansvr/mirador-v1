"use client";

import Link from "next/link";
import { useDemo1Locale } from "@/components/demo1/Demo1LocaleProvider";

interface Demo1FooterProps {
  propertyTitle: string;
}

export function Demo1Footer({ propertyTitle }: Demo1FooterProps) {
  const { messages } = useDemo1Locale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg px-4 py-10 pb-28 text-center sm:pb-10">
      <p className="font-display text-lg text-text">{propertyTitle}</p>
      <p className="mt-2 text-sm text-text-muted">{messages.footer.demoLine}</p>
      <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-text-muted">
        {messages.footer.disclaimer}
      </p>
      <nav
        className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm"
        aria-label={messages.footer.navAria}
      >
        <Link
          href="/"
          className="font-medium text-text transition-sacred hover:text-text-emphasis"
        >
          mirador.lat
        </Link>
        <span className="text-border" aria-hidden>
          ·
        </span>
        <a
          href="#contacto"
          className="text-text-muted transition-sacred hover:text-text"
        >
          {messages.footer.contact}
        </a>
      </nav>
      <p className="mt-6 text-xs text-text-muted">© {year} Mirador</p>
    </footer>
  );
}
