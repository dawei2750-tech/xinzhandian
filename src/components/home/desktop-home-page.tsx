import { BenefitsBar } from "@/components/finance/benefits-bar";
import { AdvantagesPanel } from "@/components/finance/advantages-panel";
import { SavingsSnapshot } from "@/components/finance/savings-snapshot";
import { PopularCoins } from "@/components/market/popular-coins";

export function DesktopHomePage() {
  return <main data-testid="desktop-home" className="relative z-10 mx-auto hidden max-w-content px-6 py-3 lg:block">
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-9"><PopularCoins /></div>
      <aside data-testid="desktop-sidebar" className="col-span-3 flex flex-col gap-3">
        <AdvantagesPanel instance="desktop" className="advantages-panel-complete" />
        <SavingsSnapshot />
      </aside>
    </div>
    <div className="mt-3 grid grid-cols-12 gap-3">
      <div className="col-span-12"><BenefitsBar /></div>
    </div>
  </main>;
}
