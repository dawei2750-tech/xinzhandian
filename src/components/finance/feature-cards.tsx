"use client";

import { GlowIcon } from "@/components/ui/glow-icon";
import { featureCards } from "@/constants/finance";
import { actionLinks } from "@/constants/links";
import { getFinanceCopy } from "@/i18n/finance-copy";
import { useLocale } from "@/i18n/locale-provider";

export function FeatureCards({ anchorId }: { anchorId?: string }) {
  const { locale } = useLocale();
  const copy = getFinanceCopy(locale).features;
  const hrefs = [actionLinks.mysteryBox, actionLinks.invite, actionLinks.liquidityMining];
  const ids = ["mystery-box", "invite-friends", "liquidity-mining"];

  return <section id={anchorId} data-testid="feature-grid" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {featureCards.map((card, index) => {
      const item = copy[index];
      const primary = index === 0;

      return <article
        id={ids[index]}
        key={card.icon}
        data-testid={primary ? "feature-card-primary" : "feature-card-secondary"}
        className={`panel panel-hover relative flex min-h-52 overflow-hidden p-5 lg:min-h-48 lg:p-4 ${primary ? "activity-card-primary border-violet/60 bg-violet/10 shadow-glow" : "activity-card-secondary border-line-bright/80 bg-surface/95"}`}
      >
        <span aria-hidden="true" className={`pointer-events-none absolute inset-x-6 top-0 h-px ${primary ? "bg-brand-gradient" : "bg-cyan/40"}`} />
        <span aria-hidden="true" className={`pointer-events-none absolute -right-16 -top-16 size-40 rounded-full blur-3xl ${primary ? "bg-violet/30" : card.tone === "orange" ? "bg-warning/20" : "bg-electric/20"}`} />
        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <h2 className={`${primary ? "text-lg" : ""} font-semibold`}>{item[0]}</h2>
          <p className="mt-1 text-xs text-muted">{item[1]}</p>
          <div className="mt-4">
            <p className="text-xs text-muted">{item[2]}</p>
            <p className={`mt-1 font-semibold ${primary ? "activity-reward-primary text-3xl text-ink drop-shadow-icon" : `text-2xl ${card.tone === "orange" ? "text-warning" : "text-ink"}`}`}>{item[3]}</p>
          </div>
          <a href={card.href ?? hrefs[index]} className={`primary-button mt-auto w-fit rounded-control font-medium ${primary ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-sm"}`}>{item[4]}</a>
        </div>
        <GlowIcon name={card.icon} tone={card.tone} label={item[0]} size="xl" className={`absolute -right-3 rotate-6 opacity-90 ${primary ? "-bottom-4 lg:size-24" : "-bottom-3 lg:size-20"}`} />
      </article>;
    })}
  </section>;
}
