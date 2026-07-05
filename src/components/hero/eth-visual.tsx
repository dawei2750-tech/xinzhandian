import { heroContent } from "@/constants/finance";
import { GlowIcon } from "@/components/ui/glow-icon";

export function EthVisual() {
  return <div className="hero-visual relative flex min-h-80 items-center justify-center overflow-hidden" aria-hidden="true">
    <div className="absolute h-20 w-72 rounded-full border border-electric/40 shadow-cyan [transform:rotate(-8deg)]" />
    <div className="absolute h-32 w-80 rounded-full border border-violet/30 [transform:rotate(12deg)]" />
    <svg viewBox="0 0 220 300" className="relative z-10 h-64 w-48 overflow-visible text-electric drop-shadow-2xl">
      <defs><linearGradient id="eth-a" x1="0" y1="0" x2="1" y2="1"><stop stopColor="currentColor"/><stop offset="1" stopColor="transparent"/></linearGradient></defs>
      <path d="M110 10 25 150 110 112Z" fill="url(#eth-a)" className="text-cyan" stroke="currentColor"/><path d="M110 10 195 150 110 112Z" fill="url(#eth-a)" className="text-violet" stroke="currentColor"/>
      <path d="M25 150 110 198 110 112Z" fill="currentColor" fillOpacity=".48" stroke="currentColor"/><path d="M195 150 110 198 110 112Z" fill="currentColor" fillOpacity=".18" stroke="currentColor"/>
      <path d="M30 168 110 285 110 214Z" fill="currentColor" fillOpacity=".22" stroke="currentColor"/><path d="M190 168 110 285 110 214Z" fill="currentColor" fillOpacity=".42" stroke="currentColor"/>
    </svg>
    {heroContent.coins.map((coin, index) => <GlowIcon key={coin.label} name={coin.icon} tone={coin.tone} label={coin.label} size="lg" shape="circle" className={`absolute ${index === 0 ? "bottom-14 left-8" : index === 1 ? "right-10 top-10" : "left-12 top-8"}`}/>)}
  </div>;
}
