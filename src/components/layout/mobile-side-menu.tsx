"use client";

import { useState } from "react";
import { brand, mobileDrawerItems } from "@/constants/finance";
import { Icon } from "@/components/ui/icon";

export function MobileSideMenu() {
  const [open, setOpen] = useState(false);

  return <>
    <button aria-label="打开移动端菜单" aria-expanded={open} onClick={() => setOpen(true)} className="grid size-10 shrink-0 place-items-center rounded-control border border-line bg-surface-soft lg:hidden">
      <span aria-hidden="true" className="grid gap-1.5"><span className="h-0.5 w-5 bg-ink"/><span className="h-0.5 w-5 bg-ink"/><span className="h-0.5 w-5 bg-ink"/></span>
    </button>
    {open && <div data-testid="mobile-drawer" className="fixed inset-0 z-[80] lg:hidden">
      <button aria-label="关闭菜单遮罩" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <aside className="relative flex h-full w-[82%] max-w-sm flex-col border-r border-line-bright bg-canvas p-5 shadow-2xl">
        <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-control bg-brand-gradient"><Icon name="chain" className="size-6"/></span><strong className="text-xl">{brand.name}</strong></div><button aria-label="关闭移动端菜单" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full border border-line text-xl text-muted">×</button></div>
        <nav aria-label="移动端侧边菜单" className="mt-10 grid gap-3">
          {mobileDrawerItems.map((item, index) => <a key={item.label} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-4 rounded-panel border p-4 ${index === 0 ? "border-warning/60 bg-warning/10 text-warning" : "border-line bg-surface-soft text-ink"}`}><Icon name={item.icon} label={item.label} className="size-6"/><span className="text-lg font-medium">{item.label}</span><span aria-hidden="true" className="ml-auto text-muted">›</span>{item.label === "语言" && <span className="rounded-control border border-line px-3 py-1 text-sm text-warning">简体中文</span>}</a>)}
        </nav>
      </aside>
    </div>}
  </>;
}
