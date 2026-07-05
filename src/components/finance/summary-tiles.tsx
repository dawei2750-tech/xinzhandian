import { summaryTiles } from "@/constants/finance";
import { GlowIcon } from "@/components/ui/glow-icon";

export function SummaryTiles() {
  return <section className="grid grid-cols-2 gap-3">{summaryTiles.map((item) => <article key={item.label} className="panel panel-hover flex min-h-32 flex-col p-4"><GlowIcon name={item.icon} tone={item.tone} label={item.label}/><p className="mt-auto text-xs text-muted">{item.label}</p><p className="mt-1 text-lg font-medium">{item.value}</p></article>)}</section>;
}
