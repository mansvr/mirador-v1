"use client";

import { Suspense } from "react";
import { AgentBlock } from "@/components/demo1/AgentBlock";
import { BentoGallery } from "@/components/demo1/BentoGallery";
import { Demo1Analytics } from "@/components/demo1/Demo1Analytics";
import { Demo1Footer } from "@/components/demo1/Demo1Footer";
import { Demo1LocaleProvider } from "@/components/demo1/Demo1LocaleProvider";
import { FloatingNav } from "@/components/demo1/FloatingNav";
import { HeroScrollScrub } from "@/components/demo1/HeroScrollScrub";
import { SpecStrip } from "@/components/demo1/SpecStrip";
import { useDemo1Locale } from "@/components/demo1/Demo1LocaleProvider";
import { formatMessage } from "@/lib/demo1/messages";
import { getHeroScrubMp4Url } from "@/lib/demo1/property";
import type { PropertyMicrosite } from "@/lib/demo1/types";
import type { Demo1Locale } from "@/lib/demo1/locale";

function Demo1PageInner() {
  const { property, messages } = useDemo1Locale();
  const specsLine = formatMessage(messages.hero.specsLine, {
    beds: property.specs.beds,
    baths: property.specs.baths,
    sqm: property.specs.sqm,
  });

  return (
    <>
      <Demo1Analytics />
      <FloatingNav />

      <section className="relative bg-viewer text-hero-glass-text">
        <HeroScrollScrub
          srcMp4={getHeroScrubMp4Url()}
          posterUrl={property.posterUrl}
          title={property.hero.title}
          secondsPerViewport={4}
        >
          <div className="flex min-h-[100svh] flex-col justify-end px-4 pb-16 pt-28">
            <div className="mx-auto w-full max-w-5xl">
              <div className="inline-block w-full max-w-[32rem] overflow-hidden rounded-2xl bg-gradient-to-t from-hero-scrim/75 via-hero-scrim/18 to-transparent px-4 py-6 sm:max-w-xl sm:px-6 sm:py-8">
                <p className="text-xs uppercase tracking-[0.25em] text-hero-glass-text/75 sm:text-sm">
                  {property.hero.eyebrow}
                </p>
                <h1 className="mt-3 font-display text-4xl leading-none text-hero-glass-text sm:text-7xl">
                  {property.hero.title}
                </h1>
                <p className="mt-4 text-sm text-hero-glass-text/90 sm:text-lg">
                  {property.hero.description}
                </p>
                <p className="mt-6 text-xs text-hero-glass-text/70 sm:text-sm">
                  {specsLine}
                </p>
              </div>
            </div>
          </div>
        </HeroScrollScrub>
      </section>

      <SpecStrip specs={property.specs} />
      <BentoGallery items={property.gallery} />
      <AgentBlock />
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
}: {
  property: PropertyMicrosite;
  initialLocale: Demo1Locale;
}) {
  return (
    <Suspense fallback={<Demo1PageFallback />}>
      <Demo1LocaleProvider property={property} initialLocale={initialLocale}>
        <Demo1PageInner />
      </Demo1LocaleProvider>
    </Suspense>
  );
}
