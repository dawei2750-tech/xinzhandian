"use client";
import { useLocale } from "@/i18n/locale-provider";

const proofItems = [
  ["Plan Match", "Rate tier locked"],
  ["Pool Route", "USDC route"],
  ["Daily Settle", "T+0 accrual"],
  ["Maturity Payout", "Fixed-term"],
  ["On-chain Proof", "Trace layer"],
];

const metrics = [
  ["$64.94B", "24H Volume"],
  ["Daily", "Settlement"],
  ["On-chain", "Proof"],
];

const riskSignals = [
  ["Reserve Check", "Synced"],
  ["Route Risk", "Low"],
  ["Trace Layer", "Active"],
];

export function SavingsProofMatrix() {
  const { locale } = useLocale();
  const zh = locale === "zh-CN" || locale === "zh-TW";
  const items = zh ? [["计划匹配", "利率档位锁定"], ["池子路由", "USDC 路径"], ["每日结算", "T+0 累计"], ["到期支付", "定期计划"], ["链上证明", "追踪层"]] : proofItems;
  const localizedMetrics = zh ? [["$64.94B", "24小时交易量"], ["每日", "结算"], ["链上", "证明"]] : metrics;
  const localizedRisk = zh ? [["储备检查", "已同步"], ["路径风险", "低"], ["追踪层", "运行中"]] : riskSignals;
  return (
    <section data-testid="desktop-proof-matrix" className="savings-proof-matrix savings-proof-engine" aria-label="Savings proof engine">
      <div className="savings-proof-path">
        {items.map(([title, detail], index) => (
          <article key={title} data-testid="savings-proof-node" className="savings-proof-node">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <b>{title}</b>
            <small>{detail}</small>
          </article>
        ))}
      </div>
      <div data-testid="savings-proof-terminal" className="savings-proof-terminal">
        <p>{zh ? "实时证明层" : "LIVE PROOF LAYER"}</p>
        <h2>{zh ? "储蓄证明引擎" : "Savings Proof Engine"}</h2>
        <span>{zh ? "匹配计划将根据结算、到期状态和链上追踪信号进行核验。" : "Matched plans are checked against settlement, maturity and on-chain trace signals."}</span>
        <div className="savings-proof-metrics">
          {localizedMetrics.map(([value, label]) => (
            <strong key={label} data-testid="savings-proof-metric"><b>{value}</b><small>{label}</small></strong>
          ))}
        </div>
      </div>
      <div className="savings-proof-risk-panel">
        <div className="savings-proof-radar" aria-hidden="true"><i /><i /><i /></div>
        {localizedRisk.map(([label, value]) => (
          <span key={label} data-testid="savings-proof-risk"><small>{label}</small><b>{value}</b></span>
        ))}
      </div>
    </section>
  );
}
