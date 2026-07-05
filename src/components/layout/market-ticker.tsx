import { marketItems } from "@/constants/finance";

function TickerTrack({ duplicate = false }: { duplicate?: boolean }) {
  return <div
    data-testid="market-ticker-track"
    aria-hidden={duplicate ? "true" : undefined}
    className="market-ticker-track flex shrink-0 items-center gap-10 pr-10"
  >
    {marketItems.map((item) => <div key={item.label} className="flex shrink-0 items-center gap-1.5">
      <span>{item.label}{item.value ? ":" : ""}</span>
      {item.value && <span className="text-electric">{item.value}</span>}
      {item.change && <span className={item.trend === "up" ? "text-success" : "text-danger"}>{item.trend === "up" ? "▲" : "▼"} {item.change}</span>}
    </div>)}
  </div>;
}

export function MarketTicker() {
  return <div className="relative z-10 border-b border-line bg-surface/50">
    <div className="market-ticker-viewport mx-auto max-w-content py-2 text-xs text-muted">
      <div className="market-ticker-marquee flex w-max">
        <TickerTrack />
        <TickerTrack duplicate />
      </div>
    </div>
  </div>;
}
