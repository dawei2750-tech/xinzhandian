"use client";

import { useEffect, useState } from "react";
import { GlowIcon } from "@/components/ui/glow-icon";

const tabs = ["矿池数据", "计划", "账户", "转移"] as const;
type PoolTab = (typeof tabs)[number];

export function PoolDashboard() {
  const [activeTab, setActiveTab] = useState<PoolTab>("矿池数据");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tab") !== "account") return;
    const timer = window.setTimeout(() => setActiveTab("账户"), 0);
    return () => window.clearTimeout(timer);
  }, []);
  return <section className="panel overflow-hidden">
    <div role="tablist" aria-label="矿池功能" className="scrollbar-none flex overflow-x-auto border-b border-line p-2">
      {tabs.map((tab) => <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`min-w-24 flex-1 rounded-control px-4 py-3 text-sm font-medium ${activeTab === tab ? "bg-brand-gradient text-ink shadow-glow" : "text-muted"}`}>{tab}</button>)}
    </div>
    <div className="p-4 sm:p-6">
      {activeTab === "矿池数据" && <div><h2 className="text-xl font-semibold">链上池概览</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{[
        ["总分红数据", "ETH", "chart", "purple"], ["参与者", "地址", "users", "cyan"], ["用户收益", "USDC", "usdc", "orange"],
      ].map(([label, unit, icon, tone]) => <article key={label} className="panel relative min-h-44 overflow-hidden p-5"><p className="text-sm text-muted">{label}</p><p className="mt-3 text-3xl font-semibold">—</p><p className="mt-1 text-xs text-muted">{unit} · 尚未连接数据源</p><GlowIcon name={icon as "chart"} tone={tone as "purple"} label={label} className="absolute bottom-3 right-3 opacity-55" /></article>)}</div></div>}
      {activeTab === "计划" && <div><h2 className="text-xl font-semibold">储蓄计划</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><article className="panel relative min-h-44 overflow-hidden p-5"><h3 className="font-semibold">灵活储蓄</h3><p className="mt-2 max-w-sm text-sm leading-6 text-muted">随存随取，具体利率与可用额度以首页和链上合约为准。</p><GlowIcon name="coins" tone="cyan" label="灵活储蓄" size="lg" className="absolute bottom-3 right-4 opacity-60" /></article><article className="panel relative min-h-44 overflow-hidden p-5"><h3 className="font-semibold">定期储蓄</h3><p className="mt-2 max-w-sm text-sm leading-6 text-muted">选择固定期限前，请核对资产、网络费用与退出规则。</p><GlowIcon name="vault" tone="purple" label="定期储蓄" size="lg" className="absolute bottom-3 right-4 opacity-60" /></article></div></div>}
      {activeTab === "账户" && <div className="relative min-h-52 overflow-hidden rounded-panel border border-line bg-surface-soft p-6"><h2 className="text-xl font-semibold">账户</h2><p className="mt-3 text-muted">连接钱包后显示账户信息</p><button className="primary-button mt-6 rounded-control px-5 py-2.5 font-medium">ReceiveVoucher</button><GlowIcon name="wallet" tone="purple" label="账户" size="xl" className="absolute bottom-4 right-5 opacity-55" /></div>}
      {activeTab === "转移" && <div className="relative min-h-52 overflow-hidden rounded-panel border border-line bg-surface-soft p-6"><h2 className="text-xl font-semibold">资产转移</h2><p className="mt-3 text-muted">连接钱包后可使用转移功能</p><button disabled className="mt-6 cursor-not-allowed rounded-control border border-line px-5 py-2.5 text-muted">暂不可用</button><GlowIcon name="swap" tone="cyan" label="资产转移" size="xl" className="absolute bottom-4 right-5 opacity-55" /></div>}
    </div>
  </section>;
}
