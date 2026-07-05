import { benefits } from "@/constants/finance";
import { GlowIcon } from "@/components/ui/glow-icon";

export function BenefitsBar() {
  return <section className="panel grid divide-y divide-line overflow-hidden sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">{benefits.map((benefit) => <div key={benefit.title} className="flex items-center gap-4 p-5"><GlowIcon name={benefit.icon} tone={benefit.tone} label={benefit.title}/><div><h2 className="text-sm font-medium">{benefit.title}</h2><p className="mt-1 text-xs text-muted">{benefit.description}</p></div></div>)}</section>;
}
