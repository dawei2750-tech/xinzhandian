import type { ReactNode } from "react";
import type { IconName, Tone } from "@/types/finance";
import { GlowIcon } from "@/components/ui/glow-icon";
import { Header } from "./header";
import { MarketTicker } from "./market-ticker";
import { MobileBottomNav } from "./mobile-bottom-nav";

export function SecondaryPageShell({ eyebrow, title, description, icon, tone, children }: { eyebrow: string; title: string; description: string; icon: IconName; tone: Tone; children: ReactNode }) {
  return <div className="page-grid min-h-screen pb-mobile-nav lg:pb-0">
    <Header />
    <MarketTicker />
    <main className="relative z-10 mx-auto max-w-content space-y-3 px-page py-3 sm:px-6">
      <section className="panel relative min-h-48 overflow-hidden p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl"><p className="text-xs font-semibold tracking-[0.22em] text-warning">{eyebrow}</p><h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h1><p className="mt-3 text-sm leading-7 text-muted">{description}</p></div>
        <GlowIcon name={icon} tone={tone} label={title} size="xl" className="absolute -bottom-4 right-4 opacity-70 sm:size-32" />
      </section>
      {children}
    </main>
    <div className="lg:hidden"><MobileBottomNav /></div>
  </div>;
}
