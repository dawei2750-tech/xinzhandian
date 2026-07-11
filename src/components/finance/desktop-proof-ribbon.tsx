"use client";

import { useLocale } from "@/i18n/locale-provider";
import type { Locale } from "@/i18n/locales";

const copy: Record<
  Locale,
  { eyebrow: string; title: string; steps: string[]; status: string }
> = {
  en: {
    eyebrow: "LIVE TRACE MATERIAL",
    title: "Every savings action leaves a visible route.",
    steps: ["Wallet", "Plan match", "Yield accrual", "USDC settlement"],
    status: "VERIFIED PATH",
  },
  "zh-CN": {
    eyebrow: "实时链上轨迹",
    title: "每一次储蓄操作，都留下清晰可见的路径。",
    steps: ["用户钱包", "计划匹配", "收益累计", "USDC 结算"],
    status: "路径已验证",
  },
  "zh-TW": {
    eyebrow: "即時鏈上軌跡",
    title: "每一次儲蓄操作，都留下清晰可見的路徑。",
    steps: ["用戶錢包", "計劃匹配", "收益累計", "USDC 結算"],
    status: "路徑已驗證",
  },
  ja: {
    eyebrow: "ライブ追跡",
    title: "すべての貯蓄操作に確認可能な経路を。",
    steps: ["ウォレット", "プラン照合", "収益累積", "USDC 決済"],
    status: "検証済み",
  },
  ko: {
    eyebrow: "실시간 추적",
    title: "모든 저축 작업에 확인 가능한 경로를 남깁니다.",
    steps: ["지갑", "플랜 매칭", "수익 누적", "USDC 정산"],
    status: "경로 검증 완료",
  },
  th: {
    eyebrow: "เส้นทางเรียลไทม์",
    title: "ทุกการออมมีเส้นทางที่ตรวจสอบได้",
    steps: ["กระเป๋าเงิน", "จับคู่แผน", "สะสมผลตอบแทน", "ชำระ USDC"],
    status: "ตรวจสอบแล้ว",
  },
};

export function DesktopProofRibbon() {
  const { locale } = useLocale();
  const c = copy[locale];
  return (
    <section
      data-testid="desktop-proof-ribbon"
      className="relative mt-3 flex min-h-44 flex-1 flex-col justify-between overflow-hidden rounded-panel border border-cyan/25 bg-[linear-gradient(120deg,#071224,#0d1830_55%,#10102c)] p-5"
    >
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,transparent_49%,rgba(34,211,238,.18)_50%,transparent_51%)] [background-size:70px_100%]" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[.65rem] font-bold tracking-[.22em] text-cyan">
            {c.eyebrow}
          </p>
          <h2 className="mt-2 text-xl font-semibold">{c.title}</h2>
        </div>
        <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-[.65rem] font-bold text-success">
          {c.status}
        </span>
      </div>
      <div className="relative mt-6 grid grid-cols-4 gap-2 before:absolute before:left-[10%] before:right-[10%] before:top-3 before:h-px before:bg-gradient-to-r before:from-cyan before:via-violet before:to-success">
        {c.steps.map((step, index) => (
          <div key={step} className="relative text-center">
            <span className="mx-auto grid size-6 place-items-center rounded-full border border-cyan/60 bg-bg text-[.6rem] font-black text-cyan shadow-[0_0_14px_rgba(34,211,238,.45)]">
              {index + 1}
            </span>
            <strong className="mt-2 block text-xs">{step}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
