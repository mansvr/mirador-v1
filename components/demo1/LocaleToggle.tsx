"use client";

import { useDemo1Locale } from "@/components/demo1/Demo1LocaleProvider";
import type { Demo1Locale } from "@/lib/demo1/locale";

const linkClass =
  "transition-sacred hover:text-hero-glass-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-glass-text/40";

function LangButton({
  code,
  label,
  active,
  onSelect,
}: {
  code: Demo1Locale;
  label: string;
  active: boolean;
  onSelect: (locale: Demo1Locale) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(code)}
      className={`${linkClass} ${active ? "font-semibold text-hero-glass-text" : "font-normal text-hero-glass-text/75"}`}
      aria-pressed={active}
      aria-label={label}
    >
      {code.toUpperCase()}
    </button>
  );
}

/** ES / EN — same size as nav links; active language slightly bolder. */
export function LocaleToggle() {
  const { locale, setLocale } = useDemo1Locale();

  return (
    <div
      className="flex items-center gap-1 text-sm text-hero-glass-text/85"
      role="group"
      aria-label="Idioma"
    >
      <LangButton
        code="es"
        label="Español"
        active={locale === "es"}
        onSelect={setLocale}
      />
      <span className="text-hero-glass-text/45" aria-hidden>
        /
      </span>
      <LangButton
        code="en"
        label="English"
        active={locale === "en"}
        onSelect={setLocale}
      />
    </div>
  );
}
