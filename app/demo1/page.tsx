import { AgentBlock } from "@/components/demo1/AgentBlock";
import { BentoGallery } from "@/components/demo1/BentoGallery";
import { Demo1Analytics } from "@/components/demo1/Demo1Analytics";
import { Demo1Footer } from "@/components/demo1/Demo1Footer";
import { FloatingNav } from "@/components/demo1/FloatingNav";
import { HeroScrollScrub } from "@/components/demo1/HeroScrollScrub";
import { SpecStrip } from "@/components/demo1/SpecStrip";
import { getHeroScrubMp4Url, getProperty } from "@/lib/demo1/property";

export default function Demo1Page() {
  const property = getProperty();

  return (
    <>
      <Demo1Analytics />
      <FloatingNav property={property} />

      <section className="relative bg-viewer text-hero-glass-text">
        <HeroScrollScrub
          srcMp4={getHeroScrubMp4Url()}
          posterUrl={property.posterUrl}
          title={property.hero.title}
          secondsPerViewport={3.5}
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
                  {property.specs.beds} hab · {property.specs.baths} ba ·{" "}
                  {property.specs.sqm} m²
                </p>
              </div>
            </div>
          </div>
        </HeroScrollScrub>
      </section>

      <SpecStrip specs={property.specs} />
      <BentoGallery items={property.gallery} />
      <AgentBlock property={property} />

      <Demo1Footer propertyTitle={property.hero.title} />
    </>
  );
}
