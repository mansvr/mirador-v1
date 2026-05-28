"use client";

type HeroScrollIndicatorProps = {
  /** 0–1 from hero ScrollTrigger; hidden only when scrub completes (≈100%). */
  progress: number;
  /** Hide until video scrub is ready. */
  show: boolean;
};

function scrollHeroHint() {
  const step = Math.round(window.innerHeight * 0.4);
  window.scrollBy({ top: step, behavior: "smooth" });
}

/** Bottom-right hero hint — Sacred glass text, 500ms motion, Solar-style stroke chevron. */
export function HeroScrollIndicator({
  progress,
  show,
}: HeroScrollIndicatorProps) {
  const scrubComplete = progress >= 1;
  const opacity = show && !scrubComplete ? 1 : 0;

  if (!show && opacity <= 0) return null;

  return (
    <button
      type="button"
      onClick={scrollHeroHint}
      aria-label="Deslizar para explorar el recorrido"
      tabIndex={scrubComplete ? -1 : 0}
      className={`hero-scroll-indicator pointer-events-auto absolute bottom-14 right-4 z-20 flex flex-col items-center gap-2 p-2 transition-sacred sm:bottom-16 sm:right-6 ${
        scrubComplete ? "pointer-events-none" : ""
      }`}
      style={{ opacity }}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-hero-glass-text/55">
        Deslizar
      </span>
      <span
        className="hero-scroll-indicator__track h-10 w-px bg-gradient-to-b from-hero-glass-text/0 via-hero-glass-text/35 to-hero-glass-text/65"
        aria-hidden
      />
      <span className="hero-scroll-indicator__chevron text-hero-glass-text/75" aria-hidden>
        <svg
          width="18"
          height="18"
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
    </button>
  );
}
