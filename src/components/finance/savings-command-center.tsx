"use client";

import { QuickActions } from "@/components/finance/quick-actions";
import { SavingsPoolTeasers } from "@/components/finance/savings-pool-teasers";
import { SavingsRateTable } from "@/components/finance/savings-rate-table";
import { fixedSavingsRates, savingsTables } from "@/constants/finance";
import { savingsCommandCopy } from "@/i18n/finance-copy";
import { useLocale } from "@/i18n/locale-provider";
import type { Locale } from "@/i18n/locales";

const mobileMysteryCopy: Record<Locale, { eyebrow: string; title: string; detail: string; action: string }> = {
  en: { eyebrow: "REWARD EVENT", title: "Mystery Box", detail: "The reward page is being prepared. Keep this entry visible for the upcoming draw rules.", action: "Preparing" },
  "zh-CN": { eyebrow: "福利活动", title: "盲盒抽奖", detail: "活动页面准备中，奖励入口保留展示，后续接入后可查看抽奖规则。", action: "敬请期待" },
  "zh-TW": { eyebrow: "福利活動", title: "盲盒抽獎", detail: "活動頁面準備中，獎勵入口保留展示，後續接入後可查看抽獎規則。", action: "敬請期待" },
  ja: { eyebrow: "REWARD EVENT", title: "ミステリーボックス", detail: "イベントページの準備中も、報酬入口はここに表示されます。", action: "準備中" },
  ko: { eyebrow: "REWARD EVENT", title: "미스터리 박스", detail: "이벤트 페이지가 준비되는 동안 보상 입구를 계속 표시합니다.", action: "준비 중" },
  th: { eyebrow: "REWARD EVENT", title: "กล่องสุ่ม", detail: "ทางเข้ารางวัลยังแสดงไว้ระหว่างเตรียมหน้ากิจกรรม", action: "กำลังเตรียม" },
};

const mobileYieldCopy: Record<Locale, { title: string; items: [string, string][] }> = {
  en: { title: "Yield Stats", items: [["Total yield cap", "3,000,000 ETH"], ["Paid ETH", "0 ETH"], ["Paid USDC value", "0 USDC"], ["Remaining rewards", "3,000,000 ETH"], ["Current participants", "0"]] },
  "zh-CN": { title: "收益统计", items: [["总收益上限", "3,000,000 ETH"], ["已发放 ETH 数量", "0 ETH"], ["已发放 USDC 价值", "0 USDC"], ["剩余可发放数量", "3,000,000 ETH"], ["当前参与人数", "0"]] },
  "zh-TW": { title: "收益統計", items: [["總收益上限", "3,000,000 ETH"], ["已發放 ETH 數量", "0 ETH"], ["已發放 USDC 價值", "0 USDC"], ["剩餘可發放數量", "3,000,000 ETH"], ["目前參與人數", "0"]] },
  ja: { title: "Yield Stats", items: [["Total yield cap", "3,000,000 ETH"], ["Paid ETH", "0 ETH"], ["Paid USDC value", "0 USDC"], ["Remaining rewards", "3,000,000 ETH"], ["Current participants", "0"]] },
  ko: { title: "Yield Stats", items: [["Total yield cap", "3,000,000 ETH"], ["Paid ETH", "0 ETH"], ["Paid USDC value", "0 USDC"], ["Remaining rewards", "3,000,000 ETH"], ["Current participants", "0"]] },
  th: { title: "Yield Stats", items: [["Total yield cap", "3,000,000 ETH"], ["Paid ETH", "0 ETH"], ["Paid USDC value", "0 USDC"], ["Remaining rewards", "3,000,000 ETH"], ["Current participants", "0"]] },
};

export function SavingsCommandCenter() {
  const { locale } = useLocale();
  const copy = savingsCommandCopy[locale];
  const mystery = mobileMysteryCopy[locale];
  const yieldCopy = mobileYieldCopy[locale];

  return <section id="features" data-testid="savings-command-center" className="savings-command-center savings-command-cockpit relative z-10 mx-auto max-w-content px-page py-4 sm:px-6 lg:py-5">
    <div className="savings-command-frame">
      <a href="/docs" data-testid="mobile-mystery-card" className="mobile-mystery-card lg:hidden">
        <span className="mobile-mystery-eyebrow">{mystery.eyebrow}</span>
        <strong>{mystery.title}</strong>
        <span className="mobile-mystery-copy">{mystery.detail}</span>
        <span className="mobile-mystery-visual" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="mobile-mystery-action">{mystery.action}</span>
      </a>
      <section data-testid="mobile-yield-stats-panel" className="mt-3 rounded-panel border border-cyan/30 bg-surface-soft/80 p-4 lg:hidden">
        <h2 className="text-base font-semibold text-ink">{yieldCopy.title}</h2>
        <div className="mt-3 divide-y divide-line/70">
          {yieldCopy.items.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-3 py-2.5 text-sm"><span className="text-muted">{label}</span><strong className="text-right text-ink">{value}</strong></div>)}
        </div>
      </section>
      <div data-testid="mobile-smart-contract-rate-table" className="mt-3 lg:hidden">
        <SavingsRateTable {...savingsTables.fixed} rates={fixedSavingsRates} tone="violet" />
      </div>
      <div data-testid="desktop-command-center-content" className="hidden lg:block">
        <div className="savings-command-header">
          <span className="savings-command-kicker">{copy.title}</span>
          <span className="savings-command-signal">{copy.signal}</span>
        </div>
        <div className="savings-command-control">
          <div className="savings-command-metrics hidden lg:grid" aria-hidden="true">
            {copy.metrics.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </div>
        </div>
        <div className="savings-command-rates">
          <SavingsRateTable {...savingsTables.fixed} rates={fixedSavingsRates} tone="violet" />
        </div>
        <SavingsPoolTeasers />
        <QuickActions className="command-action-strip hidden lg:grid" />
      </div>
    </div>
  </section>;
}
