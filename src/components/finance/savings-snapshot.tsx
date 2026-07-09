"use client";

import { actionLinks } from "@/constants/links";
import { useLocale } from "@/i18n/locale-provider";
import type { Locale } from "@/i18n/locales";
import { SavingsCalculator } from "./savings-calculator";

type SnapshotCopy = { eyebrow: string; title: string; flexible: string; fixed: string; liquid: string; fixedTerm: string; pathTitle: string; flexiblePool: string; fixedPlan: string; maxRate: string; flexibleSteps: readonly [string,string,string]; fixedSteps: readonly [string,string,string]; disclosure: string; cta: string };

const copy: Record<Locale, SnapshotCopy> = {
  en: { eyebrow: "PLAN SUMMARY", title: "Savings snapshot", flexible: "Flexible", fixed: "Fixed", liquid: "Withdraw anytime", fixedTerm: "Fixed term", pathTitle: "HOW RETURNS ARE ASSIGNED", flexiblePool: "Flexible Savings Pool", fixedPlan: "Fixed Savings Plan", maxRate: "Maximum tier rate", flexibleSteps: ["Enter the flexible savings pool", "Match the deposit amount tier", "Exit under the flexible plan rules"], fixedSteps: ["Choose a fixed-term plan", "Match the amount and term tier", "Settle under the maturity rules"], disclosure: "Actual rate depends on the amount tier, selected term, and plan rules. The highest rate does not apply to every deposit.", cta: "Compare plans" },
  "zh-CN": { eyebrow: "计划摘要", title: "储蓄概览", flexible: "灵活", fixed: "定期", liquid: "按规则灵活退出", fixedTerm: "固定期限", pathTitle: "收益归属路径", flexiblePool: "灵活储蓄池", fixedPlan: "定期储蓄计划", maxRate: "对应档位最高利率", flexibleSteps: ["资金进入灵活储蓄池", "匹配存款金额档位", "按灵活计划规则退出"], fixedSteps: ["选择定期储蓄计划", "匹配金额与期限档位", "按到期规则完成结算"], disclosure: "实际利率根据存款金额、所选期限及计划规则确定，最高利率并非适用于每笔存款。", cta: "对比计划" },
  "zh-TW": { eyebrow: "計畫摘要", title: "儲蓄概覽", flexible: "靈活", fixed: "定期", liquid: "按規則靈活退出", fixedTerm: "固定期限", pathTitle: "收益歸屬路徑", flexiblePool: "靈活儲蓄池", fixedPlan: "定期儲蓄計畫", maxRate: "對應級距最高利率", flexibleSteps: ["資金進入靈活儲蓄池", "匹配存款金額級距", "按靈活計畫規則退出"], fixedSteps: ["選擇定期儲蓄計畫", "匹配金額與期限級距", "按到期規則完成結算"], disclosure: "實際利率依存款金額、所選期限及計畫規則確定，最高利率並非適用於每筆存款。", cta: "對比計畫" },
  ja: { eyebrow: "プラン概要", title: "貯蓄スナップショット", flexible: "フレキシブル", fixed: "固定", liquid: "ルールに沿って出金", fixedTerm: "固定期間", pathTitle: "収益の割当経路", flexiblePool: "フレキシブル貯蓄プール", fixedPlan: "固定貯蓄プラン", maxRate: "該当ティアの最高利率", flexibleSteps: ["フレキシブルプールへ入金", "入金額ティアを適用", "プラン規則に沿って出金"], fixedSteps: ["固定期間プランを選択", "金額と期間ティアを適用", "満期規則に沿って精算"], disclosure: "実際の利率は入金額、選択期間、プラン規則で決まり、最高利率がすべての入金に適用されるわけではありません。", cta: "プラン比較" },
  ko: { eyebrow: "플랜 요약", title: "저축 스냅샷", flexible: "유연", fixed: "고정", liquid: "규칙에 따라 출금", fixedTerm: "고정 기간", pathTitle: "수익 적용 경로", flexiblePool: "유연 저축 풀", fixedPlan: "고정 저축 플랜", maxRate: "해당 구간 최고 금리", flexibleSteps: ["유연 저축 풀에 예치", "예치 금액 구간 적용", "플랜 규칙에 따라 출금"], fixedSteps: ["고정 기간 플랜 선택", "금액 및 기간 구간 적용", "만기 규칙에 따라 정산"], disclosure: "실제 금리는 예치 금액, 선택 기간 및 플랜 규칙에 따라 결정되며 최고 금리가 모든 예치에 적용되지는 않습니다.", cta: "플랜 비교" },
  th: { eyebrow: "สรุปแผน", title: "ภาพรวมการออม", flexible: "ยืดหยุ่น", fixed: "กำหนดเวลา", liquid: "ถอนตามกฎของแผน", fixedTerm: "ระยะเวลาคงที่", pathTitle: "เส้นทางการกำหนดผลตอบแทน", flexiblePool: "พูลออมทรัพย์ยืดหยุ่น", fixedPlan: "แผนออมทรัพย์แบบกำหนดเวลา", maxRate: "อัตราสูงสุดของระดับ", flexibleSteps: ["ฝากเข้าพูลแบบยืดหยุ่น", "ใช้อัตราตามช่วงยอดฝาก", "ถอนตามกฎของแผน"], fixedSteps: ["เลือกแผนระยะเวลาคงที่", "ใช้อัตราตามยอดและระยะเวลา", "ชำระตามกฎเมื่อครบกำหนด"], disclosure: "อัตราจริงขึ้นอยู่กับยอดฝาก ระยะเวลาที่เลือก และกฎของแผน อัตราสูงสุดไม่ได้ใช้กับทุกยอดฝาก", cta: "เปรียบเทียบแผน" },
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
    <article data-testid="yield-explanation" className="mt-5 flex flex-1 flex-col rounded-control border border-cyan/20 bg-cyan/5 p-3">
      <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-cyan">{c.pathTitle}</p>
      <div className="mt-3 divide-y divide-line/70 rounded-control border border-line bg-canvas/35">
        <div data-testid="flexible-rate-label" className="flex items-center justify-between gap-3 p-3"><strong className="text-sm text-ink">{c.flexiblePool}</strong><div className="text-right"><span className="block text-[0.62rem] text-muted">{c.maxRate}</span><span className="font-semibold text-cyan">2.70%</span></div></div>
        <div data-testid="fixed-rate-label" className="flex items-center justify-between gap-3 p-3"><strong className="text-sm text-ink">{c.fixedPlan}</strong><div className="text-right"><span className="block text-[0.62rem] text-muted">{c.maxRate}</span><span className="font-semibold text-warning">11.00%</span></div></div>
      </div>
      <ol data-testid="yield-calculation-flow" className="mt-4 grid gap-3 text-xs leading-5 text-muted">{c.flexibleSteps.map((step,index)=><li key={step} className="flex gap-2"><span className="font-semibold text-cyan">0{index+1}</span><span>{step}<span className="mx-1 text-subtle">/</span>{c.fixedSteps[index]}</span></li>)}</ol>
      <div className="mt-4">
        <SavingsCalculator testId="desktop-savings-calculator" />
      </div>
      <p className="mt-auto rounded-control border border-warning/20 bg-warning/5 p-3 text-xs leading-5 text-muted">{c.disclosure}</p>
    </article>
    <a href={actionLinks.fixedSavings} className="primary-button mt-4 inline-flex self-start rounded-control px-4 py-2 text-sm font-semibold">{c.cta}</a>
  </section>;
}
