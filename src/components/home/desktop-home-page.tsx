import { BenefitsBar } from "@/components/finance/benefits-bar";
import { AdvantagesPanel } from "@/components/finance/advantages-panel";
import { FeatureCards } from "@/components/finance/feature-cards";
import { QuickActions } from "@/components/finance/quick-actions";
import { SavingsRateTable } from "@/components/finance/savings-rate-table";
import { HeroSection } from "@/components/hero/hero-section";
import { PopularCoins } from "@/components/market/popular-coins";
import { fixedSavingsRates, flexibleSavingsRates, savingsTables } from "@/constants/finance";

export function DesktopHomePage() {
  return <main data-testid="desktop-home" className="relative z-10 mx-auto hidden max-w-content px-6 py-3 lg:block">
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-9 space-y-3">
        <HeroSection />
        <FeatureCards />
        <div data-testid="desktop-rates" className="grid grid-cols-2 gap-3">
          <SavingsRateTable {...savingsTables.flexible} rates={flexibleSavingsRates} tone="cyan" />
          <SavingsRateTable {...savingsTables.fixed} rates={fixedSavingsRates} tone="violet" />
        </div>
        <BenefitsBar />
      </div>
      <aside className="col-span-3 space-y-3">
        <AdvantagesPanel instance="desktop" />
        <PopularCoins />
        <QuickActions />
      </aside>
    </div>
  </main>;
}
