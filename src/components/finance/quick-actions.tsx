import { quickActions } from "@/constants/finance";
import { GlowIcon } from "@/components/ui/glow-icon";

export function QuickActions() {
  return <section className="space-y-3">{quickActions.map((item) => <article key={item.title} className="panel panel-hover flex items-center gap-4 p-4"><GlowIcon name={item.icon} tone={item.tone} label={item.title}/><div className="min-w-0 flex-1"><h2 className="font-medium">{item.title}</h2><p className="mt-1 text-xs text-muted">{item.description}</p></div><span className="text-xl text-electric">›</span></article>)}</section>;
}
