"use client";

import { useLocale } from "@/i18n/locale-provider";
import type { Locale } from "@/i18n/locales";

const copy: Record<Locale, { title: string; eyebrow: string; nodes: readonly string[]; metric: string }> = {
  en: { eyebrow: "ON-CHAIN STATUS", title: "Savings flow monitor", nodes: ["Wallet", "USDC Pool", "Vault", "Settlement"], metric: "Live verification" },
  "zh-CN": { eyebrow: "链上状态", title: "储蓄流转监控", nodes: ["钱包", "USDC 池", "金库", "结算"], metric: "实时验证" },
  "zh-TW": { eyebrow: "鏈上狀態", title: "儲蓄流轉監控", nodes: ["錢包", "USDC 池", "金庫", "結算"], metric: "即時驗證" },
  ja: { eyebrow: "オンチェーン状態", title: "貯蓄フローモニター", nodes: ["ウォレット", "USDCプール", "保管庫", "決済"], metric: "リアルタイム検証" },
  ko: { eyebrow: "온체인 상태", title: "저축 흐름 모니터", nodes: ["지갑", "USDC 풀", "금고", "정산"], metric: "실시간 검증" },
  th: { eyebrow: "สถานะบนเชน", title: "ตัวตรวจสอบกระแสการออม", nodes: ["กระเป๋า", "พูล USDC", "คลัง", "ชำระบัญชี"], metric: "ตรวจสอบสด" },
};

export function ChainFlowCard({ compact = false }: { compact?: boolean }) {
  const { locale } = useLocale();
  const c = copy[locale];

  if (compact) return <section data-testid="chain-flow-card" className="chain-flow-card chain-flow-card-compact overflow-hidden border-t border-cyan/20 px-4 py-1.5">
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-cyan">{c.eyebrow}</p>
        <h2 className="mt-1 truncate text-sm font-semibold">{c.title}</h2>
      </div>
      <span className="chain-flow-signal shrink-0 text-xs font-semibold text-success">● Active</span>
    </div>
    <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[0.68rem] text-muted">
      {c.nodes.slice(1).map((node, index) => <span key={node} className="chain-flow-chip">
        <span className="chain-flow-mini-dot" style={{ animationDelay: `${index * 0.18}s` }} />{node}
      </span>)}
    </div>
  </section>;

  return <section data-testid="chain-flow-card" className="chain-flow-card panel overflow-hidden p-4">
    <p className="text-xs font-semibold tracking-[0.2em] text-cyan">{c.eyebrow}</p>
    <h2 className={`${compact ? "mt-1 text-sm" : "mt-2 text-lg"} font-semibold`}>{c.title}</h2>
    <div className={`chain-flow-line grid grid-cols-4 gap-2 ${compact ? "mt-3" : "mt-5"}`}>
      {c.nodes.map((node, index) => <div key={node} className="chain-flow-node">
        <span className="chain-flow-dot" style={{ animationDelay: `${index * 0.18}s` }} />
        <span className="mt-2 block truncate text-[0.68rem] text-muted">{node}</span>
      </div>)}
    </div>
    <div className={`${compact ? "mt-3" : "mt-5"} flex items-center justify-between rounded-control border border-cyan/20 bg-cyan/10 px-3 py-2`}>
      <span className="text-xs text-muted">{c.metric}</span>
      <span className="chain-flow-signal text-xs font-semibold text-success">● Active</span>
    </div>
  </section>;
}
