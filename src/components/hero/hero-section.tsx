import { heroContent } from "@/constants/finance";
import { EthVisual } from "./eth-visual";

export function HeroSection() {
  return <section id="home" className="panel relative grid min-h-96 overflow-hidden lg:min-h-72 lg:grid-cols-[1.12fr_.88fr]">
    <div className="relative z-10 flex flex-col justify-center p-7 lg:p-8"><p className="mb-3 text-sm tracking-widest text-muted">{heroContent.eyebrow}</p><h1 className="max-w-2xl text-4xl font-semibold leading-tight lg:text-[2.5rem]">{heroContent.titlePrefix} <span className="brand-text">{heroContent.titleAccent}</span> {heroContent.titleSuffix}</h1><p className="mt-4 text-sm text-muted">{heroContent.description}</p><div className="mt-6 flex gap-3"><button className="primary-button rounded-control px-6 py-2.5 font-medium">{heroContent.primaryAction}</button><button className="rounded-control border border-line-bright bg-surface-soft px-6 py-2.5 text-muted hover:text-ink">{heroContent.secondaryAction}</button></div></div>
    <EthVisual />
    <div data-testid="hero-dots" className="absolute bottom-3 left-1/3 flex gap-2">{Array.from({ length: heroContent.carouselDots }, (_, index) => <span key={index} className={`size-2 rounded-full ${index === 0 ? "bg-violet shadow-icon-purple" : "bg-subtle"}`}/>)}</div>
  </section>;
}
