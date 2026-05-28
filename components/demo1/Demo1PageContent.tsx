"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { AgentBlock } from "@/components/demo1/AgentBlock";
import { BentoGallery } from "@/components/demo1/BentoGallery";
import { Demo1Analytics } from "@/components/demo1/Demo1Analytics";
import { Demo1Footer } from "@/components/demo1/Demo1Footer";
import { Demo1LoadingScreen } from "@/components/demo1/Demo1LoadingScreen";
import { Demo1LocaleProvider } from "@/components/demo1/Demo1LocaleProvider";
import { Demo1MotionProvider } from "@/components/demo1/Demo1MotionProvider";
import { Demo1ScrollReveal } from "@/components/demo1/Demo1ScrollReveal";
import { FloatingNav } from "@/components/demo1/FloatingNav";
import { HeroCopyCard } from "@/components/demo1/HeroCopyCard";
import { HeroScrollIndicator } from "@/components/demo1/HeroScrollIndicator";
import { HeroScrollScrub } from "@/components/demo1/HeroScrollScrub";
import { SpecStrip } from "@/components/demo1/SpecStrip";
import { useDemo1Locale } from "@/components/demo1/Demo1LocaleProvider";
import { useDemo1Motion } from "@/components/demo1/Demo1MotionProvider";
import { useDemo1Prefetch } from "@/components/demo1/useDemo1Prefetch";
import { formatMessage } from "@/lib/demo1/messages";
import { getHeroScrubMp4Url } from "@/lib/demo1/property";
import type { PropertyMicrosite } from "@/lib/demo1/types";
import type { Demo1Locale } from "@/lib/demo1/locale";

const HERO_READY_TIMEOUT_MS = 12_000;

function Demo1PageInner() {
  const { property, messages } = useDemo1Locale();
  const { motion } = useDemo1Motion();
  const [scrubReady, setScrubReady] = useState(false);
  const scrubMp4 = getHeroScrubMp4Url();

  const galleryUrls = useMemo(
    () => property.gallery.map((item) => item.imageUrl),
    [property.gallery],
  );

  useDemo1Prefetch(motion.loading, scrubMp4, galleryUrls);

  const onScrubReadyChange = useCallback((ready: boolean) => {
    setScrubReady(ready);
  }, []);

  useEffect(() => {
    if (!motion.loading || scrubReady) return;
    const timeoutId = window.setTimeout(() => setScrubReady(true), HERO_READY_TIMEOUT_MS);
    return () => window.clearTimeout(timeoutId);
  }, [motion.loading, scrubReady]);

  const specsLine = formatMessage(messages.hero.specsLine, {
    beds: property.specs.beds,
    baths: property.specs.baths,
    sqm: property.specs.sqm,
  });

  const heroCardClassName =
    "inline-block w-full max-w-[32rem] overflow-hidden rounded-2xl bg-gradient-to-t from-hero-scrim/75 via-hero-scrim/18 to-transparent px-4 py-4 sm:max-w-xl sm:px-5 sm:py-6";

  return (
    <>
      <Demo1Analytics />
      <Demo1LoadingScreen show={motion.loading && !scrubReady} />
      <FloatingNav />

      <section className="relative bg-viewer text-hero-glass-text">
        <HeroScrollScrub
          srcMp4={scrubMp4}
          posterUrl={property.posterUrl}
          title={property.hero.title}
          secondsPerViewport={4}
          onScrubReadyChange={onScrubReadyChange}
        >
          <div className="flex min-h-[100svh] flex-col justify-end px-4 pb-16 pt-28">
            <div className="mx-auto w-full max-w-5xl">
              <HeroCopyCard
                motionHero={motion.hero}
                scrubReady={scrubReady}
                className={heroCardClassName}
              >
                <h1 className="font-display text-4xl leading-none text-hero-glass-text sm:text-7xl">
                  {property.hero.title}
                </h1>
                <p className="mt-3 text-sm leading-snug text-hero-glass-text/90 sm:mt-4 sm:text-lg">
                  {property.hero.description}
                </p>
                <div className="mt-4 border-t border-hero-glass-text/10 pt-2 sm:pt-2.5">
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-hero-glass-text/75 sm:text-xs sm:tracking-[0.25em]">
                        {property.hero.eyebrow}
                      </p>
                      <p className="mt-1 text-xs text-hero-glass-text/70 sm:text-sm">
                        {specsLine}
                      </p>
                    </div>
                    <HeroScrollIndicator variant="inline" />
                  </div>
                </div>
              </HeroCopyCard>
            </div>
          </div>
        </HeroScrollScrub>
      </section>

      <Demo1ScrollReveal afterHero>
        <SpecStrip specs={property.specs} />
      </Demo1ScrollReveal>
      <Demo1ScrollReveal>
        <BentoGallery items={property.gallery} />
      </Demo1ScrollReveal>
      <Demo1ScrollReveal>
        <AgentBlock />
      </Demo1ScrollReveal>
      <Demo1Footer propertyTitle={property.hero.title} />
    </>
  );
}

function Demo1PageFallback() {
  return <section className="relative min-h-[100svh] bg-viewer" aria-hidden />;
}

export function Demo1PageContent({
  property,
  initialLocale,
  initialMotionQuery,
}: {
  property: PropertyMicrosite;
  initialLocale: Demo1Locale;
  initialMotionQuery?: string | null;
}) {
  return (
    <Suspense fallback={<Demo1PageFallback />}>
      <Demo1LocaleProvider property={property} initialLocale={initialLocale}>
        <Demo1MotionProvider initialMotionQuery={initialMotionQuery}>
          <Demo1PageInner />
        </Demo1MotionProvider>
      </Demo1LocaleProvider>
    </Suspense>
  );
}
