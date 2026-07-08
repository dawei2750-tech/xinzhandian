import { DesktopHomePage } from "@/components/home/desktop-home-page";
import { MobileHomePage } from "@/components/home/mobile-home-page";
import { Header } from "@/components/layout/header";
import { MarketTicker } from "@/components/layout/market-ticker";
import { PromoCarousel } from "@/components/layout/promo-carousel";

function MaintenancePage() {
  return <main className="min-h-screen bg-canvas px-page py-16 text-ink sm:px-6">
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-violet">HB Chain Finance</p>
      <h1 className="brand-text text-4xl font-semibold leading-tight sm:text-6xl">Service maintenance</h1>
      <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
        HB Chain Finance is temporarily offline while we prepare the next release.
      </p>
      <div className="mt-8 rounded-panel border border-line bg-surface-soft p-5 text-sm leading-6 text-muted">
        Existing balances and records are not affected. Please check back later.
      </div>
    </section>
  </main>;
}

export default function Home() {
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== "false") return <MaintenancePage />;

  return <div id="home" className="page-grid min-h-screen">
    <Header />
    <MarketTicker testId="top-market-ticker" />
    <PromoCarousel />
    <DesktopHomePage />
    <MobileHomePage />
  </div>;
}
