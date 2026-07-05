import { platformHeading, platformPeriod, platformStats } from "@/constants/finance";
import { GlowIcon } from "@/components/ui/glow-icon";

export function PlatformStats() {
  return <section className="panel p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">{platformHeading}</h2><span className="rounded-control border border-line px-3 py-1.5 text-xs text-muted">{platformPeriod}⌄</span></div><div className="divide-y divide-line">{platformStats.map((stat) => <div key={stat.label} className="flex items-center gap-3 py-3"><GlowIcon name={stat.icon} tone={stat.tone} label={stat.label} size="sm"/><div className="min-w-0 flex-1"><p className="text-xs text-muted">{stat.label}</p><p className="truncate text-sm font-medium">{stat.value}</p></div><span className="text-xs text-success">{stat.change}</span></div>)}</div></section>;
}
