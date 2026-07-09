import { AdvantagesPanel } from "@/components/finance/advantages-panel";
import { MobileSpotlightHub } from "@/components/finance/mobile-spotlight-hub";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { PopularCoins } from "@/components/market/popular-coins";

export function MobileHomePage() {
  return <div data-testid="mobile-home" className="lg:hidden">
    <main className="relative z-10 mx-auto grid gap-3 px-page py-3 pb-mobile-nav sm:px-6">
      <AdvantagesPanel anchorId="advantages" instance="mobile" />
      <PopularCoins />
      <MobileSpotlightHub />
    </main>
    <MobileBottomNav />
  </div>;
}
