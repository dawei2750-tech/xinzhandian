import { DesktopHomePage } from "@/components/home/desktop-home-page";
import { MobileHomePage } from "@/components/home/mobile-home-page";
import { Header } from "@/components/layout/header";
import { MarketTicker } from "@/components/layout/market-ticker";
import { PromoCarousel } from "@/components/layout/promo-carousel";

export default function Home() {
  return <div id="home" className="page-grid min-h-screen">
    <Header />
    <MarketTicker />
    <PromoCarousel />
    <DesktopHomePage />
    <MobileHomePage />
  </div>;
}
