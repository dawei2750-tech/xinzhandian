"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { brand, navItems } from "@/constants/finance";
import { actionLinks } from "@/constants/links";
import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/i18n/locale-provider";
import { localeOptions, type Locale } from "@/i18n/locales";
import { MobileSideMenu } from "./mobile-side-menu";

export function Header() {
  const { locale, setLocale, text } = useLocale();
  const labels = [text.navigation.home, text.navigation.trade, text.navigation.pool, text.navigation.finance, text.navigation.mysteryBox, text.navigation.invite, text.navigation.more];
  return <header className="relative z-20 border-b border-line bg-canvas/80 backdrop-blur-xl"><div className="mx-auto flex h-nav-h max-w-content items-center gap-2 px-page sm:gap-4 sm:px-6 lg:gap-8">
    <MobileSideMenu />
    <a href="/" className="flex shrink-0 items-center gap-3 font-semibold"><span className="grid size-9 place-items-center rounded-control bg-brand-gradient p-2 text-ink shadow-glow"><Icon name="chain" className="size-full drop-shadow-icon"/></span><span className="hidden text-lg sm:inline">{brand.name}</span></a>
    <nav aria-label={text.common.mainNavigation} className="hidden min-w-0 flex-1 items-center gap-8 lg:flex">{navItems.map((item,index)=><a key={`${item.href}-${index}`} href={index===1?actionLinks.trade:item.href} className={`relative py-5 text-sm transition-colors hover:text-ink ${index===0?"text-violet":"text-muted"}`}>{labels[index]}{index===0&&<span className="absolute inset-x-0 bottom-0 h-px bg-violet shadow-glow"/>}</a>)}</nav>
    <div className="ml-auto flex items-center gap-4"><label className="hidden items-center gap-2 text-sm text-muted sm:flex"><Icon name="globe" className="size-4 text-cyan"/><span className="sr-only">{text.navigation.language}</span><select aria-label={text.navigation.language} value={locale} onChange={(event)=>setLocale(event.target.value as Locale)} className="bg-transparent text-muted outline-none">{localeOptions.map((option)=><option key={option.code} value={option.code} className="bg-surface text-ink">{option.label}</option>)}</select></label><a href={actionLinks.account} className="primary-button flex items-center gap-2 whitespace-nowrap rounded-control px-3 py-2.5 text-sm font-semibold sm:px-5"><Icon name="wallet" className="size-4"/>{text.common.wallet}</a></div>
  </div></header>;
}
