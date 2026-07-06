import { promoBanners } from "@/constants/finance";
import { GlowIcon } from "@/components/ui/glow-icon";
import Image from "next/image";

const toneClass = { purple: "from-violet/35 via-surface to-warning/15", cyan: "from-cyan/30 via-surface to-warning/20", orange: "from-warning/30 via-surface to-violet/20" } as const;

export function PromoCarousel() {
  return <section aria-label="重点推荐" className="relative z-10 mx-auto max-w-content overflow-hidden px-page pt-3 sm:px-6">
    <div className="promo-carousel-track flex w-[400%]">
      {promoBanners.map((banner) => <article data-testid="promo-banner-slide" key={banner.title} className={`relative grid min-h-44 w-1/4 shrink-0 grid-cols-[1fr_auto] items-center overflow-hidden rounded-panel border border-line-bright bg-gradient-to-r ${toneClass[banner.tone as keyof typeof toneClass]} px-6 py-5 shadow-panel sm:min-h-48 sm:px-10`}>
        {banner.image ? <Image src={banner.image} alt={banner.title} fill sizes="100vw" className="object-cover" /> : <><div className="relative z-10"><p className="text-xs font-semibold tracking-[0.24em] text-warning">{banner.eyebrow}</p><h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{banner.title}</h2><p className="mt-2 text-sm text-muted">{banner.description}</p></div><GlowIcon name={banner.icon} tone={banner.tone} label={banner.title} size="xl" className="ml-4 opacity-90 sm:size-28" /></>}
        <span aria-hidden="true" className="absolute -right-12 -top-20 size-52 rounded-full bg-warning/10 blur-3xl" />
      </article>)}
    </div>
    <div aria-hidden="true" className="flex justify-center gap-2 py-2"><span className="size-2 rounded-full bg-warning"/>{promoBanners.slice(1).map((banner) => <span key={banner.title} className="size-2 rounded-full bg-subtle"/>)}</div>
  </section>;
}
