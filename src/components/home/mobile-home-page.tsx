import { BenefitsBar } from "@/components/finance/benefits-bar";
import { AdvantagesPanel } from "@/components/finance/advantages-panel";
import { FeatureCards } from "@/components/finance/feature-cards";
import { QuickActions } from "@/components/finance/quick-actions";
import { SavingsRateTable } from "@/components/finance/savings-rate-table";
import { HeroSection } from "@/components/hero/hero-section";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { PopularCoins } from "@/components/market/popular-coins";
import { fixedSavingsRates, flexibleSavingsRates, savingsTables } from "@/constants/finance";

export function MobileHomePage() {
  return <div data-testid="mobile-home" className="lg:hidden">
    <main className="relative z-10 mx-auto grid gap-3 px-page py-3 pb-mobile-nav sm:px-6">
      <HeroSection />
      <FeatureCards />
      <div data-testid="mobile-rates" className="grid gap-3">
        <SavingsRateTable {...savingsTables.flexible} rates={flexibleSavingsRates} tone="cyan" />
        <SavingsRateTable {...savingsTables.fixed} rates={fixedSavingsRates} tone="violet" />
      </div>
      <AdvantagesPanel anchorId="advantages" instance="mobile" />
      <PopularCoins />
      <QuickActions />
      <BenefitsBar />
    </main>
    <MobileBottomNav />
  </div>;
}
