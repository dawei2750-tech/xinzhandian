import { featureCards } from "@/constants/finance";
import { GlowIcon } from "@/components/ui/glow-icon";

export function FeatureCards() {
  return <section data-testid="feature-grid" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{featureCards.map((card) => <article key={card.title} className="panel panel-hover relative flex min-h-52 overflow-hidden p-5 lg:min-h-48 lg:p-4"><div className="relative z-10 flex min-w-0 flex-1 flex-col"><h2 className="font-semibold">{card.title}</h2><p className="mt-1 text-xs text-muted">{card.subtitle}</p><div className="mt-4"><p className="text-xs text-muted">{card.valueLabel}</p><p className={`mt-1 text-xl font-medium ${card.tone === "orange" ? "text-warning" : "text-ink"}`}>{card.value}</p></div><button className="primary-button mt-auto w-fit rounded-control px-4 py-2 text-sm font-medium">{card.button}</button></div><GlowIcon name={card.icon} tone={card.tone} label={card.title} size="xl" className="absolute -bottom-3 -right-3 rotate-6 opacity-80 lg:size-20"/></article>)}</section>;
}
