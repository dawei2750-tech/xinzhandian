"use client";

import { actionLinks } from "@/constants/links";
import { getFinanceCopy } from "@/i18n/finance-copy";
import { useLocale } from "@/i18n/locale-provider";
import type { SavingsRate } from "@/types/finance";
import { GlowIcon } from "@/components/ui/glow-icon";

const depositCopy = {
  en: { flexible: "Enter Smart Contract", fixed: "Enter Smart Contract" },
  "zh-CN": { flexible: "进入智能合约", fixed: "进入智能合约" },
  "zh-TW": { flexible: "進入智能合約", fixed: "進入智能合約" },
  ja: { flexible: "スマートコントラクトへ", fixed: "スマートコントラクトへ" },
  ko: { flexible: "스마트 계약으로", fixed: "스마트 계약으로" },
  th: { flexible: "เข้าสู่สัญญาอัจฉริยะ", fixed: "เข้าสู่สัญญาอัจฉริยะ" },
} as const;

export function SavingsRateTable({
  rates,
  tone,
  showAction = true,
}: {
  title: string;
  note: string;
  rates: SavingsRate[];
  tone: "violet" | "cyan";
  showAction?: boolean;
}) {
  const { locale } = useLocale();
  const c = getFinanceCopy(locale).rates;
  const fixed = tone === "violet";
  const columns = [c.amount, c.daily];
  const ctaLabel = fixed ? depositCopy[locale].fixed : depositCopy[locale].flexible;

  return (
    <section
      data-testid="rate-table"
      className={`panel relative overflow-hidden lg:text-[0.8125rem] ${fixed ? "border-violet/40" : "border-cyan/40"}`}
    >
      <div className="p-5 pb-2 lg:p-4 lg:pb-1">
        <h2 className="text-lg font-semibold">
          {fixed ? c.fixed : c.flexible}{" "}
          <span className="text-xs font-normal text-muted">({fixed ? c.fixedNote : c.flexibleNote})</span>
        </h2>
      </div>
      <div className="relative z-10 px-5 pb-5 lg:px-4 lg:pb-4">
        <table className="w-full table-fixed text-left text-sm lg:text-[0.8125rem]">
          <colgroup>
            <col className="w-[62%]" />
            <col className="w-[38%]" />
          </colgroup>
          <thead className="text-xs text-muted">
            <tr>
              {columns.map((x, i) => (
                <th key={x} className={`py-3 font-normal ${i === 1 ? "text-right" : "pr-6"}`}>
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {rates.map((r) => (
              <tr key={r.amount}>
                <td className="py-2.5 pr-6">{r.amount}</td>
                <td className="py-2.5 text-right">
                  <span className="inline-flex min-w-20 justify-center rounded-full border border-cyan/25 bg-cyan/10 px-3 py-1 font-medium text-cyan">
                    {r.dailyRate}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showAction ? <a
          data-testid="rate-table-deposit-link"
          href={actionLinks.fixedSavings}
          className={`rate-table-deposit-link ${fixed ? "rate-table-deposit-link-fixed" : "rate-table-deposit-link-flexible"}`}
        >
          {ctaLabel}
        </a> : null}
      </div>
      <div data-testid="rate-illustration" className="pointer-events-none absolute -bottom-4 -right-3 hidden opacity-35 2xl:block">
        <GlowIcon name={fixed ? "vault" : "coins"} tone={fixed ? "purple" : "cyan"} size="xl" />
      </div>
    </section>
  );
}
