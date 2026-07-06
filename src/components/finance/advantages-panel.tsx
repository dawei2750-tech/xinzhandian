"use client";

import { useState } from "react";
import { advantages } from "@/constants/finance";

export function AdvantagesPanel({ anchorId, instance }: { anchorId?: string; instance: "desktop" | "mobile" }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return <section id={anchorId} data-testid="advantages-panel" className="panel overflow-hidden">
    <div className="border-b border-line p-5"><p className="text-xs font-semibold tracking-[0.22em] text-warning">WHY BLOCKCHAIN SAVINGS</p><h2 className="mt-2 text-2xl font-semibold">我们的优势</h2></div>
    <div className="divide-y divide-line">
      {advantages.map((item) => {
        const expanded = openId === item.id;
        return <div key={item.id}>
          <button type="button" aria-expanded={expanded} aria-controls={`${instance}-advantage-${item.id}`} onClick={() => setOpenId(expanded ? null : item.id)} className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-surface-soft"><span className="font-semibold text-warning">{item.id}.</span><span className="min-w-0 flex-1 font-medium">{item.title}</span><span aria-hidden="true" className={`text-xl text-muted transition-transform ${expanded ? "rotate-180" : ""}`}>⌄</span></button>
          {expanded && <div id={`${instance}-advantage-${item.id}`} className="space-y-3 bg-canvas/45 px-5 pb-5 text-sm leading-7 text-muted">{item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>}
        </div>;
      })}
    </div>
  </section>;
}
