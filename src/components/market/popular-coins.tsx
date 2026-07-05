import { coinColumns, coinListHeading, coins, uiText } from "@/constants/finance";
import { GlowIcon } from "@/components/ui/glow-icon";
import { TrendSparkline } from "./trend-sparkline";

export function PopularCoins() {
  return <section className="panel overflow-hidden"><div className="flex items-center justify-between p-4"><h2 className="text-lg font-semibold">{coinListHeading}</h2><span className="text-xs text-muted">{uiText.more} ›</span></div><div className="scrollbar-none overflow-x-auto"><div data-testid="coin-grid" className="min-w-xl lg:min-w-0 2xl:text-xs"><div className="grid grid-cols-market gap-2 px-3 pb-2 text-market text-muted">{coinColumns.map((column) => <span key={column}>{column}</span>)}</div><div className="divide-y divide-line">{coins.map((coin) => <div key={coin.symbol} className="grid grid-cols-market items-center gap-2 px-3 py-2 text-market"><div className="flex min-w-0 items-center gap-1.5"><GlowIcon name={coin.icon} tone={coin.tone} label={coin.name} size="sm"/><span className="font-medium">{coin.symbol}</span><span className="truncate text-muted">{coin.name}</span></div><span className="whitespace-nowrap">{coin.price}</span><span className="whitespace-nowrap text-success">{coin.change}</span><span className="whitespace-nowrap">{coin.volume}</span><TrendSparkline values={coin.trend}/></div>)}</div></div></div></section>;
}
