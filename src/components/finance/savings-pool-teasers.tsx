"use client";

import { actionLinks } from "@/constants/links";

const pools = [
  {
    key: "flexible",
    title: "Flexible Access Pool",
    eyebrow: "LIVE ACCESS",
    metric: "Daily Flow",
    glow: "cyan",
  },
  {
    key: "fixed",
    title: "Fixed Maturity Pool",
    eyebrow: "LOCKED PATH",
    metric: "Maturity Yield",
    glow: "violet",
  },
] as const;

export function SavingsPoolTeasers() {
  return (
    <section data-testid="pool-teaser-panel" className="mobile-pool-teasers lg:hidden" aria-label="Savings pool entries">
      {pools.map((pool) => (
        <a key={pool.key} data-testid="pool-teaser-card" href={actionLinks.fixedSavings} className={`pool-teaser-card pool-teaser-card-${pool.key}`}>
          <span className="pool-teaser-eyebrow">{pool.eyebrow}</span>
          <span className="pool-teaser-title">{pool.title}</span>
          <span className="pool-teaser-metric">{pool.metric}</span>
          <span className="pool-teaser-visual" aria-hidden="true">
            <span data-testid="pool-teaser-pillar" className={`pool-teaser-pillar pool-teaser-pillar-${pool.glow}`} />
            <span className="pool-teaser-crown" />
            <span data-testid="pool-teaser-roots" className="pool-teaser-roots"><span /><span /><span /></span>
          </span>
        </a>
      ))}
    </section>
  );
}
