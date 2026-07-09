"use client";

import { QuickActions } from "@/components/finance/quick-actions";
import { SavingsCalculator } from "@/components/finance/savings-calculator";
import { SavingsPoolTeasers } from "@/components/finance/savings-pool-teasers";
import { SavingsRateTable } from "@/components/finance/savings-rate-table";
import { fixedSavingsRates, flexibleSavingsRates, savingsTables } from "@/constants/finance";
import { savingsCommandCopy } from "@/i18n/finance-copy";
import { useLocale } from "@/i18n/locale-provider";

export function SavingsCommandCenter() {
  const { locale } = useLocale();
  const copy = savingsCommandCopy[locale];

  return <section id="features" data-testid="savings-command-center" className="savings-command-center savings-command-cockpit relative z-10 mx-auto max-w-content px-page py-4 sm:px-6 lg:py-5">
    <div className="savings-command-frame">
      <div className="savings-command-header">
        <span className="savings-command-kicker">{copy.title}</span>
        <span className="savings-command-signal">{copy.signal}</span>
      </div>
      <div className="savings-command-control">
        <SavingsCalculator testId="hero-savings-calculator" />
        <div className="savings-command-metrics hidden lg:grid" aria-hidden="true">
          {copy.metrics.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </div>
      </div>
      <div className="savings-command-rates">
        <SavingsRateTable {...savingsTables.flexible} rates={flexibleSavingsRates} tone="cyan" />
        <SavingsRateTable {...savingsTables.fixed} rates={fixedSavingsRates} tone="violet" />
      </div>
      <SavingsPoolTeasers />
      <QuickActions className="command-action-strip hidden lg:grid" />
    </div>
  </section>;
}
