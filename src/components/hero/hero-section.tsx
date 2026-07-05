import { heroContent } from "@/constants/finance";
import { EthVisual } from "./eth-visual";

export function HeroSection() {
  return <section id="home" className="panel relative grid min-h-96 overflow-hidden lg:grid-cols-2">
    <div className="relative z-10 flex flex-col justify-center p-7 sm:p-10"><p className="mb-4 text-base tracking-widest text-muted">{heroContent.eyebrow}</p><h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">{heroContent.titlePrefix} <span className="brand-text">{heroContent.titleAccent}</span> {heroContent.titleSuffix}</h1><p className="mt-5 text-sm text-muted sm:text-base">{heroContent.description}</p><div className="mt-8 flex gap-4"><button className="primary-button rounded-control px-6 py-3 font-medium">{heroContent.primaryAction}</button><button className="rounded-control border border-line-bright bg-surface-soft px-6 py-3 text-muted hover:text-ink">{heroContent.secondaryAction}</button></div></div>
    <EthVisual />
    <div data-testid="hero-dots" className="absolute bottom-3 left-1/3 flex gap-2">{Array.from({ length: heroContent.carouselDots }, (_, index) => <span key={index} className={`size-2 rounded-full ${index === 0 ? "bg-violet shadow-icon-purple" : "bg-subtle"}`}/>)}</div>
  </section>;
}
