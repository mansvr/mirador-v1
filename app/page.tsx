import { SitePageShell } from "@/components/home/HomeShell";
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
    <SitePageShell>
      <MarketingHeader />
      <main className="flex-1">
        <MarketingHero />
        <SystemBand />
        <SolutionsSection />
        <ProcessSection />
        <DemoSection />
        <TrustSection />
        <CtaBand />
      </main>
      <MarketingFooter />
    </SitePageShell>
  );
}
