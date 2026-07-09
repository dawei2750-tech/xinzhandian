"use client";

import { QuickActions } from "@/components/finance/quick-actions";
import { SavingsCalculator } from "@/components/finance/savings-calculator";
import { SavingsRateTable } from "@/components/finance/savings-rate-table";
import { fixedSavingsRates, flexibleSavingsRates, savingsTables } from "@/constants/finance";

export function SavingsCommandCenter() {
  return <section id="features" data-testid="savings-command-center" className="savings-command-center savings-command-cockpit relative z-10 mx-auto max-w-content px-page py-4 sm:px-6 lg:py-5">
    <div className="savings-command-frame">
      <div className="savings-command-header">
        <span className="savings-command-kicker">SAVINGS COMMAND CENTER</span>
        <span className="savings-command-signal">LIVE PLAN DATA</span>
      </div>
      <div className="savings-command-control">
        <SavingsCalculator testId="hero-savings-calculator" />
        <div className="savings-command-metrics" aria-hidden="true">
          <div><span>Matched Tier</span><strong>Auto</strong></div>
          <div><span>Daily Interest</span><strong>Tier Based</strong></div>
          <div><span>Maturity</span><strong>Once</strong></div>
          <div><span>Settlement</span><strong>On Rules</strong></div>
        </div>
      </div>
      <div className="savings-command-rates">
        <SavingsRateTable {...savingsTables.flexible} rates={flexibleSavingsRates} tone="cyan" />
        <SavingsRateTable {...savingsTables.fixed} rates={fixedSavingsRates} tone="violet" />
      </div>
      <QuickActions className="command-action-strip" />
    </div>
  </section>;
}
