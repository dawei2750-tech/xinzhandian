"use client";

import { brand, mobileDrawerItems } from "@/constants/finance";
import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/i18n/locale-provider";
import { localeOptions } from "@/i18n/locales";

export function MobileSideMenu() {
  const { locale, setLocale, text } = useLocale();
  const labels = [text.navigation.home, text.navigation.poolData, text.navigation.loan, text.navigation.documents];

  return <div className="mobile-side-menu lg:hidden">
    <a href="#mobile-menu-drawer" aria-label={text.common.openMenu} className="grid size-10 shrink-0 place-items-center rounded-control border border-line bg-surface-soft">
      <span aria-hidden="true" className="grid gap-1.5"><span className="h-0.5 w-5 bg-ink" /><span className="h-0.5 w-5 bg-ink" /><span className="h-0.5 w-5 bg-ink" /></span>
    </a>
    <div id="mobile-menu-drawer" data-testid="mobile-drawer" className="mobile-drawer-panel fixed inset-0 z-[80]">
      <a href="#home" aria-label={text.common.closeMenu} className="absolute inset-0 block bg-black/70 backdrop-blur-sm" />
      <aside className="relative flex h-full w-[82%] max-w-sm flex-col overflow-y-auto border-r border-line-bright bg-canvas p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-control bg-brand-gradient"><Icon name="chain" className="size-6" /></span><strong className="text-xl">{brand.name}</strong></div>
          <a href="#home" aria-label={text.common.closeMenu} className="grid size-10 place-items-center rounded-full border border-line text-xl text-muted">×</a>
        </div>
        <nav aria-label={text.common.mobileMenu} className="mt-10 grid gap-3">
          {mobileDrawerItems.slice(0, 4).map((item, index) => <a key={item.href} href={item.href} className={`flex items-center gap-4 rounded-panel border p-4 ${index === 0 ? "border-warning/60 bg-warning/10 text-warning" : "border-line bg-surface-soft text-ink"}`}><Icon name={item.icon} label={labels[index]} className="size-6" /><span className="text-lg font-medium">{labels[index]}</span><span aria-hidden="true" className="ml-auto text-muted">›</span></a>)}
          <div id="language" className="rounded-panel border border-line bg-surface-soft p-4"><div className="mb-3 flex items-center gap-4"><Icon name="globe" label={text.navigation.language} className="size-6" /><span className="text-lg font-medium">{text.navigation.language}</span></div><div className="grid grid-cols-2 gap-2">{localeOptions.map((option) => <button key={option.code} onClick={() => setLocale(option.code)} aria-pressed={locale === option.code} className={`rounded-control border px-3 py-2 text-sm ${locale === option.code ? "border-warning bg-warning/10 text-warning" : "border-line text-muted"}`}>{option.label}</button>)}</div></div>
        </nav>
      </aside>
    </div>
  </div>;
}
