import { brand, navItems, uiText } from "@/constants/finance";
import { Icon } from "@/components/ui/icon";
import { MobileSideMenu } from "./mobile-side-menu";

export function Header() {
  return <header className="relative z-20 border-b border-line bg-canvas/80 backdrop-blur-xl">
    <div className="mx-auto flex h-nav-h max-w-content items-center gap-2 px-page sm:gap-4 sm:px-6 lg:gap-8">
      <MobileSideMenu />
      <a href="#home" className="flex shrink-0 items-center gap-3 font-semibold"><span className="grid size-9 place-items-center rounded-control bg-brand-gradient p-2 text-ink shadow-glow"><Icon name="chain" className="size-full drop-shadow-icon"/></span><span className="hidden text-lg sm:inline">{brand.name}</span></a>
      <nav aria-label={uiText.mainNavigation} className="hidden min-w-0 flex-1 items-center gap-8 lg:flex">
        {navItems.map((item, index) => <a key={item.label} href={item.href} className={`relative py-5 text-sm transition-colors hover:text-ink ${index === 0 ? "text-violet" : "text-muted"}`}>{item.label}{index === 0 && <span className="absolute inset-x-0 bottom-0 h-px bg-violet shadow-glow" />}</a>)}
      </nav>
      <div className="ml-auto flex items-center gap-4"><button className="hidden items-center gap-2 text-sm text-muted hover:text-ink sm:flex"><Icon name="globe" className="size-4 text-cyan"/>{brand.language}⌄</button><button className="primary-button flex items-center gap-2 whitespace-nowrap rounded-control px-3 py-2.5 text-sm font-semibold sm:px-5"><Icon name="wallet" className="size-4"/>{brand.wallet}</button></div>
    </div>
  </header>;
}
