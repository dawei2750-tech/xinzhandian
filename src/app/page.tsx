import { BenefitsBar } from "@/components/finance/benefits-bar";
import { FeatureCards } from "@/components/finance/feature-cards";
import { PlatformStats } from "@/components/finance/platform-stats";
import { QuickActions } from "@/components/finance/quick-actions";
import { SavingsRateTable } from "@/components/finance/savings-rate-table";
import { SummaryTiles } from "@/components/finance/summary-tiles";
import { HeroSection } from "@/components/hero/hero-section";
import { Header } from "@/components/layout/header";
import { MarketTicker } from "@/components/layout/market-ticker";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { PopularCoins } from "@/components/market/popular-coins";
import { fixedSavingsRates, flexibleSavingsRates, savingsTables } from "@/constants/finance";

export default function Home() {
  return <div className="page-grid min-h-screen pb-mobile-nav lg:pb-0"><Header/><MarketTicker/><main className="relative z-10 mx-auto grid max-w-content gap-3 px-page py-3 sm:px-6 lg:grid-cols-12"><div data-column="primary" className="contents lg:col-span-9 lg:block lg:space-y-3"><div className="contents lg:grid lg:grid-cols-9 lg:gap-3"><div data-section="hero" className="order-1 min-w-0 lg:col-span-7"><HeroSection/></div><div data-section="stats" className="order-2 min-w-0 lg:col-span-2"><PlatformStats/></div></div><div data-section="features" className="order-4 min-w-0"><FeatureCards/></div><div data-section="rates" className="order-6 grid min-w-0 gap-3 xl:grid-cols-2"><SavingsRateTable {...savingsTables.fixed} rates={fixedSavingsRates} tone="violet"/><SavingsRateTable {...savingsTables.flexible} rates={flexibleSavingsRates} tone="cyan"/></div><div data-section="benefits" className="order-8 min-w-0"><BenefitsBar/></div></div><aside data-column="secondary" className="contents lg:col-span-3 lg:block lg:space-y-3"><div data-section="summary" className="order-3 min-w-0"><SummaryTiles/></div><div data-section="coins" className="order-5 min-w-0"><PopularCoins/></div><div data-section="quick" className="order-7 min-w-0"><QuickActions/></div></aside></main><MobileBottomNav/></div>;
}
