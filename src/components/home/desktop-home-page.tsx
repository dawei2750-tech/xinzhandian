import { BenefitsBar } from "@/components/finance/benefits-bar";
import { AdvantagesPanel } from "@/components/finance/advantages-panel";
import { FeatureCards } from "@/components/finance/feature-cards";
import { QuickActions } from "@/components/finance/quick-actions";
import { SavingsSnapshot } from "@/components/finance/savings-snapshot";
import { SavingsRateTable } from "@/components/finance/savings-rate-table";
import { HeroSection } from "@/components/hero/hero-section";
import { MarketTicker } from "@/components/layout/market-ticker";
import { PopularCoins } from "@/components/market/popular-coins";
import { fixedSavingsRates, flexibleSavingsRates, savingsTables } from "@/constants/finance";

export function DesktopHomePage() {
  return <main data-testid="desktop-home" className="relative z-10 mx-auto hidden max-w-content px-6 py-3 lg:block">
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-9 space-y-3">
        <HeroSection />
        <FeatureCards anchorId="features" />
        <div data-testid="desktop-action-rail">
          <QuickActions />
        </div>
        <MarketTicker variant="highlight" testId="desktop-highlight-ticker" />
        <div data-testid="desktop-rates" className="grid grid-cols-2 gap-3">
          <SavingsRateTable {...savingsTables.flexible} rates={flexibleSavingsRates} tone="cyan" />
          <SavingsRateTable {...savingsTables.fixed} rates={fixedSavingsRates} tone="violet" />
        </div>
      </div>
      <aside data-testid="desktop-sidebar" className="col-span-3 flex flex-col gap-3">
        <AdvantagesPanel instance="desktop" className="advantages-panel-complete" />
        <SavingsSnapshot />
      </aside>
    </div>
    <div className="mt-3 grid grid-cols-12 gap-3">
      <div className="col-span-12"><PopularCoins /></div>
      <div className="col-span-12"><BenefitsBar /></div>
    </div>
  </main>;
}
