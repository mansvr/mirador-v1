import { MarketingFooter, MarketingHeader } from "@/components/marketing/MarketingShell";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import {
  CtaBand,
  DemoSection,
  ProcessSection,
  SolutionsSection,
  SystemBand,
  TrustSection,
} from "@/components/marketing/MarketingSections";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-mirador-bg text-mirador-text">
      <MarketingHeader />
      <main>
        <MarketingHero />
        <SystemBand />
        <SolutionsSection />
        <ProcessSection />
        <DemoSection />
        <TrustSection />
        <CtaBand />
      </main>
      <MarketingFooter />
    </div>
  );
}
