"use client";

import { marketItems } from "@/constants/finance";
import { chromeCopy } from "@/i18n/finance-copy";
import { useLocale } from "@/i18n/locale-provider";

const values = ["$53.27M", "952", "$2.16T", "$64.94B", "BTC: 60.1%  ETH: 11.4%", "1.24 Gwei"];

function TickerTrack({ duplicate = false }: { duplicate?: boolean }) {
  const { locale } = useLocale();
  const labels = chromeCopy[locale].ticker;

  return <div data-testid="market-ticker-track" aria-hidden={duplicate ? "true" : undefined} className="market-ticker-track flex shrink-0 items-center gap-10 pr-10">
    {marketItems.map((item, i) => {
      if (i === 0) return <div key={i} className="shrink-0">{"\u00a9"} 2026 CoinMarketCap</div>;
      const label = i <= 5 ? labels[i - 1] : i === 6 ? "Gas" : labels[i - 2];
      const value = i <= 6 ? values[i - 1] : undefined;

      return <div key={i} className="flex shrink-0 items-center gap-1.5">
        <span className={i > 6 ? "ticker-proof-label" : undefined}>{i > 6 ? `\u2713 ${label}` : label}{value ? ":" : ""}</span>
        {value && <span data-testid="ticker-value-pill" className="ticker-value-pill text-electric">{value}</span>}
        {item.change && <span data-testid={item.trend === "up" ? "ticker-change-positive" : "ticker-change-negative"} className={`ticker-change-pill ${item.trend === "up" ? "text-success" : "text-danger"}`}>{item.trend === "up" ? "\u25b2" : "\u25bc"} {item.change}</span>}
      </div>;
    })}
  </div>;
}

export function MarketTicker({ variant = "top", testId }: { variant?: "top" | "highlight"; testId?: string }) {
  const highlight = variant === "highlight";
  const tickerClass = highlight
    ? "market-ticker-highlight market-ticker-spotlight overflow-hidden rounded-full border border-cyan/80 bg-cyan/10 shadow-cyan"
    : "market-ticker-highlight market-ticker-spotlight market-ticker-top overflow-hidden border-b border-cyan/35 bg-cyan/10";

  return <div data-testid={testId} className={`relative z-10 ${tickerClass}`}>
    <div className={`market-ticker-viewport mx-auto ${highlight ? "px-3 py-2.5 text-xs font-semibold text-ink" : "max-w-content py-2 text-xs font-semibold text-ink"}`}>
      <div className="market-ticker-marquee flex w-max">
        <TickerTrack />
        <TickerTrack duplicate />
      </div>
    </div>
  </div>;
}
