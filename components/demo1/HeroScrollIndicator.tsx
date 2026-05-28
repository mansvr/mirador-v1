"use client";

import { useDemo1Locale } from "@/components/demo1/Demo1LocaleProvider";
import { useHeroScrub } from "@/components/demo1/HeroScrubContext";

type HeroScrollIndicatorProps = {
  variant?: "inline" | "floating";
  progress?: number;
  show?: boolean;
};

function scrollHeroHint() {
  const step = Math.round(window.innerHeight * 0.4);
  window.scrollBy({ top: step, behavior: "smooth" });
}

function ScrollGlyph({ compact }: { compact?: boolean }) {
  return (
    <>
      <span
        className={`hero-scroll-indicator__track bg-gradient-to-b from-hero-glass-text/0 via-hero-glass-text/35 to-hero-glass-text/65 ${
          compact ? "h-7 w-px" : "h-10 w-px"
        }`}
        aria-hidden
      />
      <span className="hero-scroll-indicator__chevron text-hero-glass-text/75" aria-hidden>
        <svg
          width={compact ? 16 : 18}
          height={compact ? 16 : 18}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          <path
            d="M12 5v14M6 13l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  );
}

export function HeroScrollIndicator({
  variant = "inline",
  progress: progressProp,
  show: showProp,
}: HeroScrollIndicatorProps) {
  const { messages } = useDemo1Locale();
  const ctx = useHeroScrub();
  const progress = progressProp ?? ctx.progress;
  const show = showProp ?? ctx.show;

  const scrubComplete = progress >= 1;
  const visible = show && !scrubComplete;
  const opacity = visible ? 1 : 0;

  if (!show && opacity <= 0) return null;

  const labelClass =
    "text-[10px] font-medium uppercase tracking-[0.22em] text-hero-glass-text/55";

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={scrollHeroHint}
        aria-label={messages.hero.scrollAria}
        tabIndex={scrubComplete ? -1 : 0}
        className={`hero-scroll-indicator pointer-events-auto flex shrink-0 flex-col items-center gap-1 transition-sacred ${
          scrubComplete ? "pointer-events-none" : ""
        }`}
        style={{ opacity }}
      >
        <span className={labelClass}>{messages.hero.scrollLabel}</span>
        <span className="flex flex-col items-center gap-0.5">
          <ScrollGlyph compact />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={scrollHeroHint}
      aria-label={messages.hero.scrollAria}
      tabIndex={scrubComplete ? -1 : 0}
      className={`hero-scroll-indicator pointer-events-auto absolute bottom-14 right-4 z-20 flex flex-col items-center gap-2 p-2 transition-sacred sm:bottom-16 sm:right-6 ${
        scrubComplete ? "pointer-events-none" : ""
      }`}
      style={{ opacity }}
    >
      <span className={labelClass}>{messages.hero.scrollLabel}</span>
      <ScrollGlyph />
    </button>
  );
}
