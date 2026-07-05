import { platformHeading, platformPeriod, platformStats } from "@/constants/finance";
import { GlowIcon } from "@/components/ui/glow-icon";

export function PlatformStats() {
  return <section data-testid="platform-stats" className="panel p-5 lg:p-4"><div className="mb-2 flex items-center justify-between gap-2"><h2 className="text-base font-semibold">{platformHeading}</h2><span className="rounded-control border border-line px-2 py-1 text-xs text-muted">{platformPeriod}⌄</span></div><div className="divide-y divide-line">{platformStats.map((stat) => <div key={stat.label} className="flex items-center gap-2 py-2"><GlowIcon name={stat.icon} tone={stat.tone} label={stat.label} size="sm"/><div className="min-w-0 flex-1"><p className="text-xs text-muted">{stat.label}</p><p className="text-xs font-medium 2xl:text-sm">{stat.value}</p></div><span className="shrink-0 text-[0.625rem] text-success">{stat.change}</span></div>)}</div></section>;
}
