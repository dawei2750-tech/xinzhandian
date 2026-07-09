"use client";

import { coins } from "@/constants/finance";
import { GlowIcon } from "@/components/ui/glow-icon";
import { useLocale } from "@/i18n/locale-provider";
import { getFinanceCopy } from "@/i18n/finance-copy";
import { TrendSparkline } from "./trend-sparkline";

export function PopularCoins() {
  const { locale } = useLocale();
  const c = getFinanceCopy(locale);

  return (
    <section className="panel overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">{c.sections.popular}</h2>
        <span className="text-xs text-muted">{c.sections.more}</span>
      </div>
      <div className="scrollbar-none overflow-x-auto">
        <div data-testid="coin-grid" className="min-w-xl lg:min-w-0 2xl:text-xs">
          <div className="grid grid-cols-market gap-2 px-3 pb-2 text-market text-muted">
            {c.coinColumns.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <div className="divide-y divide-line">
            {coins.map((coin, i) => (
              <div key={coin.symbol} className="grid grid-cols-market items-center gap-2 px-3 py-2 text-market">
                <div className="flex min-w-0 items-center gap-1.5">
                  <GlowIcon name={coin.icon} tone={coin.tone} label={c.coins[i]} size="sm" />
                  <span className="font-medium">{coin.symbol}</span>
                  <span className="truncate text-muted">{c.coins[i]}</span>
                </div>
                <span className="whitespace-nowrap">{coin.price}</span>
                <span className="whitespace-nowrap text-success">{coin.change}</span>
                <span className="whitespace-nowrap">{coin.volume}</span>
                <TrendSparkline values={coin.trend} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
