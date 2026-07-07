"use client";

import { actionLinks } from "@/constants/links";
import { useLocale } from "@/i18n/locale-provider";
import type { Locale } from "@/i18n/locales";

const copy: Record<Locale, { eyebrow: string; title: string; flexible: string; fixed: string; liquid: string; fixedTerm: string; note: string; cta: string }> = {
  en: { eyebrow: "PLAN SUMMARY", title: "Savings snapshot", flexible: "Flexible", fixed: "Fixed", liquid: "Withdraw anytime", fixedTerm: "Fixed term", note: "Choose by liquidity need and on-chain plan rules.", cta: "Compare plans" },
  "zh-CN": { eyebrow: "计划摘要", title: "储蓄概览", flexible: "灵活", fixed: "定期", liquid: "随时进出", fixedTerm: "固定期限", note: "按流动性需求和链上计划规则选择。", cta: "对比计划" },
  "zh-TW": { eyebrow: "計畫摘要", title: "儲蓄概覽", flexible: "靈活", fixed: "定期", liquid: "隨時進出", fixedTerm: "固定期限", note: "按流動性需求和鏈上計畫規則選擇。", cta: "對比計畫" },
  ja: { eyebrow: "プラン概要", title: "貯蓄スナップショット", flexible: "フレキシブル", fixed: "固定", liquid: "いつでも出金", fixedTerm: "固定期間", note: "流動性とオンチェーン条件で選択します。", cta: "プラン比較" },
  ko: { eyebrow: "플랜 요약", title: "저축 스냅샷", flexible: "유연", fixed: "고정", liquid: "언제든 출금", fixedTerm: "고정 기간", note: "유동성과 온체인 규칙에 따라 선택합니다.", cta: "플랜 비교" },
  th: { eyebrow: "สรุปแผน", title: "ภาพรวมการออม", flexible: "ยืดหยุ่น", fixed: "กำหนดเวลา", liquid: "ถอนเมื่อไรก็ได้", fixedTerm: "ระยะเวลาคงที่", note: "เลือกตามสภาพคล่องและกฎบนเชน", cta: "เปรียบเทียบแผน" },
};

export function SavingsSnapshot() {
  const { locale } = useLocale();
  const c = copy[locale];

  return <section data-testid="savings-snapshot" className="savings-snapshot panel flex flex-1 flex-col p-4">
    <p className="text-xs font-semibold tracking-[0.2em] text-warning">{c.eyebrow}</p>
    <h2 className="mt-2 text-lg font-semibold">{c.title}</h2>
    <div className="mt-4 grid gap-3">
      <div className="rounded-control border border-cyan/20 bg-cyan/10 p-3">
        <div className="flex items-center justify-between"><strong>{c.flexible}</strong><span className="text-cyan">2.70%</span></div>
        <p className="mt-1 text-xs text-muted">{c.liquid}</p>
      </div>
      <div className="rounded-control border border-violet/25 bg-violet/10 p-3">
        <div className="flex items-center justify-between"><strong>{c.fixed}</strong><span className="text-warning">11.00%</span></div>
        <p className="mt-1 text-xs text-muted">{c.fixedTerm}</p>
      </div>
    </div>
    <p className="mt-4 text-xs leading-5 text-muted">{c.note}</p>
    <a href={actionLinks.fixedSavings} className="primary-button mt-auto inline-flex self-start rounded-control px-4 py-2 text-sm font-semibold">{c.cta}</a>
  </section>;
}
