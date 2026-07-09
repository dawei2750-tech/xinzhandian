import { DesktopHomePage } from "@/components/home/desktop-home-page";
import { MobileHomePage } from "@/components/home/mobile-home-page";
import { GlobalVolumeGlobe } from "@/components/finance/global-volume-globe";
import { SavingsCommandCenter } from "@/components/finance/savings-command-center";
import { Header } from "@/components/layout/header";
import { MarketTicker } from "@/components/layout/market-ticker";
import { PromoCarousel } from "@/components/layout/promo-carousel";

export default function Home() {
  return <div id="home" className="page-grid min-h-screen">
    <Header />
    <MarketTicker testId="top-market-ticker" />
    <PromoCarousel />
    <GlobalVolumeGlobe testId="hero-global-volume-globe" hero />
    <SavingsCommandCenter />
    <DesktopHomePage />
    <MobileHomePage />
  </div>;
}
