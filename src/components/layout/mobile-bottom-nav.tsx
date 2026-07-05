import { mobileNavItems, uiText } from "@/constants/finance";
import { Icon } from "@/components/ui/icon";

export function MobileBottomNav() {
  return <nav aria-label={uiText.mobileNavigation} className="fixed inset-x-0 bottom-0 z-50 grid h-mobile-nav grid-cols-5 border-t border-line bg-surface/95 px-2 backdrop-blur-xl lg:hidden">
    {mobileNavItems.map((item, index) => <a key={item.label} href={item.href} className={`flex flex-col items-center justify-center gap-1 text-xs ${index === 0 ? "text-violet drop-shadow-icon" : "text-muted"}`}>{item.icon && <Icon name={item.icon} label={item.label} className="size-5"/>}<span>{item.label}</span></a>)}
  </nav>;
}
