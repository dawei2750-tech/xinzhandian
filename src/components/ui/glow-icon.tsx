import { Icon } from "@/components/ui/icon";
import type { IconName, Tone } from "@/types/finance";

const tones: Record<Tone, string> = {
  blue: "border-electric/40 bg-electric/15 text-electric shadow-icon-blue",
  purple: "border-violet/40 bg-violet/15 text-violet shadow-icon-purple",
  cyan: "border-cyan/40 bg-cyan/15 text-cyan shadow-icon-cyan",
  green: "border-success/40 bg-success/15 text-success shadow-icon-green",
  orange: "border-warning/40 bg-warning/15 text-warning shadow-icon-orange",
  red: "border-danger/40 bg-danger/15 text-danger shadow-icon-red",
};
const sizes = { sm: "size-8 p-1.5", md: "size-11 p-2.5", lg: "size-14 p-3", xl: "size-24 p-5" } as const;

export function GlowIcon({ name, tone, label, size = "md", shape = "square", className = "" }: { name: IconName; tone: Tone; label?: string; size?: keyof typeof sizes; shape?: "square" | "circle"; className?: string }) {
  const radius = shape === "circle" ? "rounded-full" : "rounded-control";
  return <span className={`relative grid shrink-0 place-items-center border backdrop-blur-sm ${radius} ${tones[tone]} ${sizes[size]} ${className}`}><span className={`absolute inset-1 border border-current/20 ${radius}`}/><Icon name={name} label={label} className="relative size-full drop-shadow-icon"/></span>;
}
