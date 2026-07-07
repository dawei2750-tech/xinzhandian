"use client";

import { quickActions } from "@/constants/finance";
import { actionLinks } from "@/constants/links";
import { GlowIcon } from "@/components/ui/glow-icon";
import { useLocale } from "@/i18n/locale-provider";
import { getFinanceCopy } from "@/i18n/finance-copy";

const actionHrefs = [actionLinks.mysteryBox, actionLinks.invite, actionLinks.liquidityMining, actionLinks.fixedSavings] as const;

export function QuickActions() {
  const { locale } = useLocale();
  const c = getFinanceCopy(locale).quick;

  return <section data-testid="quick-actions" className="space-y-3">
    {quickActions.map((x, i) => <a key={x.icon} href={x.href ?? actionHrefs[i]} className="panel panel-hover flex items-center gap-4 p-4 lg:p-3">
      <GlowIcon name={x.icon} tone={x.tone} label={c[i][0]} />
      <div className="min-w-0 flex-1">
        <h2 className="font-medium">{c[i][0]}</h2>
        <p className="mt-1 text-xs text-muted">{c[i][1]}</p>
      </div>
      <span aria-hidden="true" className="text-xl text-electric">›</span>
    </a>)}
  </section>;
}
