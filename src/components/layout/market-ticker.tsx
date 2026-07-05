import { marketItems } from "@/constants/finance";

export function MarketTicker() {
  return <div className="relative z-10 border-b border-line bg-surface/50"><div className="scrollbar-none mx-auto flex max-w-content items-center gap-10 overflow-x-auto px-page py-2 text-xs text-muted sm:px-6">
    {marketItems.map((item) => <div key={item.label} className="flex shrink-0 items-center gap-1.5"><span>{item.label}{item.value ? ":" : ""}</span>{item.value && <span className="text-electric">{item.value}</span>}{item.change && <span className={item.trend === "up" ? "text-success" : "text-danger"}>{item.trend === "up" ? "▲" : "▼"} {item.change}</span>}</div>)}
  </div></div>;
}
