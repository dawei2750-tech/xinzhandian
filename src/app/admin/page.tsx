"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { WhitelistManager } from "@/components/admin/whitelist-manager";
import { initialAdminConfig, type AdminConfig } from "@/config/admin-model";
import { getAssetManagerConfig, type AssetManagerConfig } from "@/lib/asset-manager-client";

type Section = "overview" | "users" | "plans" | "funds" | "withdrawal" | "publish";

const sections: { id: Section; label: string; hint: string; icon: string }[] = [
  { id: "overview", label: "管理总览", hint: "", icon: "*" },
  { id: "users", label: "用户管理", hint: "", icon: "*" },
  { id: "plans", label: "计划配置", hint: "VIP1-VIP7", icon: "*" },
  { id: "funds", label: "资金配置", hint: "", icon: "*" },
  { id: "withdrawal", label: "提现设置", hint: "", icon: "*" },
  { id: "publish", label: "发布记录", hint: "", icon: "*" },
];

function Field({ label, value, onChange, suffix }: { label: string; value: string; onChange: (value: string) => void; suffix?: string }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <span className="admin-input-wrap">
        <input aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} />
        {suffix ? <small>{suffix}</small> : null}
      </span>
    </label>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="admin-section-heading"><p>{eyebrow}</p><h2>{title}</h2><span>{description}</span></div>;
}

type AdminAction = { label: string; tone?: "primary" | "secondary" | "warning" | "danger" };

function ActionStrip({ actions, onAction }: { actions: AdminAction[]; onAction: (label: string) => void }) {
  return (
    <div className="admin-action-strip" aria-label="当前板块操作">
      {actions.map((action) => (
        <button key={action.label} type="button" className={`admin-action-button ${action.tone ?? "secondary"}`} onClick={() => onAction(action.label)}>
          {action.label}
        </button>
      ))}
    </div>
  );
}

function readChainConfig(): AssetManagerConfig | null {
  try {
    return getAssetManagerConfig();
  } catch {
    return null;
  }
}

function ChainRuntimePanel({ config }: { config: AssetManagerConfig | null }) {
  if (!config) return null;
  return (
    <section className="admin-panel" data-testid="admin-chain-runtime">
      <SectionHeading eyebrow="WEB3 RUNTIME" title="Chain runtime" description="Frontend and admin share this public runtime config." />
      <div className="admin-status-grid">
        <div><span>Environment</span><strong>{config.environment}</strong></div>
        <div><span>Chain ID</span><strong>{config.chainId}</strong></div>
        <div><span>RPC</span><strong>{config.rpcUrl}</strong></div>
        <div><span>TestAssetManager</span><strong>{config.spender}</strong></div>
        <div><span>USDT</span><strong>{config.tokens.USDT.address}</strong></div>
        <div><span>USDC</span><strong>{config.tokens.USDC.address}</strong></div>
        <div><span>pYUSD</span><strong>{config.tokens.PYUSD.address}</strong></div>
        <div><span>USDT approval</span><strong>{config.tokens.USDT.requiresZeroApproval ? "approve(0) first" : "direct approval"}</strong></div>
      </div>
    </section>
  );
}

export default function AdminPage() {
  const [section, setSection] = useState<Section>("overview");
  const [config, setConfig] = useState<AdminConfig>(() => {
    if (typeof window === "undefined") return initialAdminConfig;
    const saved = localStorage.getItem("hb-finance-admin-draft");
    if (!saved) return initialAdminConfig;
    try { return JSON.parse(saved) as AdminConfig; } catch { return initialAdminConfig; }
  });
  const [savedAt, setSavedAt] = useState("");
  const [pendingAction, setPendingAction] = useState("");
  const [newRule, setNewRule] = useState("");
  const activePlans = useMemo(() => config.plans.filter((plan) => plan.enabled).length, [config.plans]);
  const chainConfig = useMemo(() => readChainConfig(), []);
  const activeUsers = useMemo(() => (config.whitelist ?? []).filter((entry) => entry.status === "已启用").length, [config.whitelist]);
  const saveDraft = () => {
    localStorage.setItem("hb-finance-admin-draft", JSON.stringify(config));
    setSavedAt(new Date().toLocaleString("zh-CN"));
    setPendingAction("");
  };
  const awaitIntegration = (label: string) => setPendingAction(`等待接口：${label}`);
  const switchSection = (id: Section) => {
    setSection(id);
    setPendingAction("");
  };
  const updatePlan = (index: number, key: keyof AdminConfig["plans"][number], value: string | boolean) =>
    setConfig((current) => ({ ...current, plans: current.plans.map((plan, planIndex) => planIndex === index ? { ...plan, [key]: value } : plan) }));
  const current = sections.find((item) => item.id === section) ?? sections[0];

  return <div data-admin-theme="wealth-console" className="admin-shell min-h-screen overflow-x-hidden text-ink">
    <aside className="admin-sidebar">
      <div className="admin-brand"><span className="admin-brand-mark">HB</span><div><strong>HB FINANCE</strong><small>理财管理后台</small></div></div>
      <nav aria-label="后台栏目">{sections.map((item) => <button key={item.id} type="button" onClick={() => switchSection(item.id)} className={section === item.id ? "is-active" : ""}><span className="admin-nav-icon">{item.icon}</span><span><strong>{item.label}</strong><small>{item.hint}</small></span></button>)}</nav>
      <div className="admin-account"><span>A</span><div><strong>Admin</strong><small>Project admin</small></div></div>
    </aside>

    <div className="admin-workspace">
      <header className="admin-topbar"><div><p>CONTROL CENTER</p><h1>HB Finance 管理后台</h1></div><div className="admin-top-actions"><Link href="/">预览前台</Link><button type="button" onClick={saveDraft}>保存草稿</button><button type="button" className="is-primary" onClick={() => awaitIntegration("发布配置")}>发布配置</button></div></header>
      <main data-testid="admin-content" className="admin-main">
        <div className="admin-page-title"><div><p>{current.hint}</p><h2>{current.label}</h2></div>{savedAt ? <span>Last saved: {savedAt}</span> : <span>Local draft not saved</span>}</div>
        {pendingAction ? <div role="status" className="admin-integration-notice"><span>API status</span><strong>{pendingAction}</strong><button type="button" aria-label="Close API status" onClick={() => setPendingAction("")}>x</button></div> : null}

        {section === "overview" ? <div className="space-y-5">
          <ActionStrip actions={[{ label: "刷新状态", tone: "primary" }, { label: "紧急暂停", tone: "danger" }]} onAction={awaitIntegration} />
          <div className="admin-stat-grid">{[
            ["Whitelist users", String(config.whitelist?.length ?? 0), `Enabled ${activeUsers}`],
            ["启用计划", `${activePlans}/${config.plans.length}`, "VIP1-VIP7"],
            ["支持资产", String(config.deposit.assets.length), "跨链资产配置"],
            ["提现资产", config.withdrawal.asset, `最低 ${config.withdrawal.minimumUsdc} USDC`],
          ].map(([label, value, detail], index) => <article key={label} className={`admin-stat-card tone-${index + 1}`}><p>{label}</p><strong>{value}</strong><span>{detail}</span></article>)}</div>
          <ChainRuntimePanel config={chainConfig} />
          <section className="admin-panel"><SectionHeading eyebrow="OPERATING STATUS" title="Current configuration" description="Shows existing project configuration only." /><div className="admin-status-grid"><div><span>Order policy</span><strong>{config.participationRules.allowMultipleOrders ? "Multiple orders" : "Single order"}</strong></div><div><span>Plan routing</span><strong>{config.deposit.activePlanRouting ? "Auto route to plan" : "Temporary pool"}</strong></div><div><span>Commission asset</span><strong>ETH</strong></div><div><span>Publish authority</span><strong>Waiting for wallet auth</strong></div></div></section>
          <section className="admin-panel"><SectionHeading eyebrow="PARTICIPATION" title="Participation rules" description="Backend validates these rules when creating orders." /><div className="admin-form-grid cols-3"><Field label="单笔最小存款额" value={config.participationRules.minimumDepositUsdc} suffix="USDC" onChange={(value) => setConfig({ ...config, participationRules: { ...config.participationRules, minimumDepositUsdc: value } })} /><div className="admin-readonly"><span>Maximum deposit</span><strong>No limit</strong></div><label className="admin-switch-card"><input aria-label="Allow multiple orders" type="checkbox" checked={config.participationRules.allowMultipleOrders} onChange={(event) => setConfig({ ...config, participationRules: { ...config.participationRules, allowMultipleOrders: event.target.checked } })} /><span><strong>Allow multiple orders</strong><small>When disabled, each user can have only one active order.</small></span></label></div></section>
        </div> : null}

        {section === "users" ? <WhitelistManager entries={config.whitelist ?? []} onChange={(whitelist) => setConfig({ ...config, whitelist })} onIntegrationAction={awaitIntegration} onLocalAction={setPendingAction} /> : null}

        {section === "plans" ? <div className="space-y-5">
          <ActionStrip actions={[{ label: "保存计划", tone: "primary" }]} onAction={awaitIntegration} />
          <section className="admin-panel"><SectionHeading eyebrow="PLAN SETTINGS" title="VIP1-VIP7 计划配置" description="Maintain amount ranges, yield rates, and pause state." /><div className="admin-plan-list">{config.plans.map((plan, index) => <article key={plan.id}><div className="admin-plan-name"><strong>{plan.name}</strong><div className="admin-plan-controls"><label><input aria-label={`${plan.name} 启用`} type="checkbox" checked={plan.enabled} onChange={(event) => updatePlan(index, "enabled", event.target.checked)} /><span>{plan.enabled ? "Enabled" : "Disabled"}</span></label><button type="button" className={plan.enabled ? "pause" : "resume"} onClick={() => awaitIntegration(`${plan.enabled ? "暂停" : "恢复"}${plan.name}池`)}>{plan.enabled ? `暂停${plan.name}池` : `恢复${plan.name}池`}</button></div></div><Field label={`${plan.name} amount range`} value={plan.amountRange} onChange={(value) => updatePlan(index, "amountRange", value)} /><Field label={`${plan.name} minimum`} value={plan.minimumUsdc} suffix="USDC" onChange={(value) => updatePlan(index, "minimumUsdc", value)} /><Field label={`${plan.name} yield rate`} value={plan.ethRate} onChange={(value) => updatePlan(index, "ethRate", value)} /></article>)}</div></section>
          <section className="admin-panel"><SectionHeading eyebrow="RULES" title="定期储蓄规则" description="维护对用户可见的正式规则条目。" /><div className="admin-rule-list">{(config.fixedRules.items ?? []).map((rule, index) => <div key={`${rule}-${index}`}><span>{rule}</span><button type="button" aria-label={`删除规则 ${rule}`} onClick={() => setConfig({ ...config, fixedRules: { ...config.fixedRules, items: config.fixedRules.items.filter((_, itemIndex) => itemIndex !== index) } })}>删除规则</button></div>)}</div><div className="admin-inline-action"><input aria-label="新增定期规则" value={newRule} onChange={(event) => setNewRule(event.target.value)} placeholder="输入规则内容" /><button type="button" disabled={!newRule.trim()} onClick={() => { setConfig({ ...config, fixedRules: { ...config.fixedRules, status: "adopted", items: [...config.fixedRules.items, newRule.trim()] } }); setNewRule(""); }}>新增规则</button></div></section>
        </div> : null}

        {section === "funds" ? <div className="space-y-5">
          <ActionStrip actions={[{ label: "查看子池余额", tone: "primary" }, { label: "补充资金" }, { label: "待结算列表" }, { label: "批量结算", tone: "warning" }]} onAction={awaitIntegration} />
          <section className="admin-panel"><SectionHeading eyebrow="ASSET ROUTING" title="Asset routing" description="Manage supported assets and destination pools." /><div className="admin-form-grid cols-2"><Field label="支持资产" value={config.deposit.assets.join(", ")} onChange={(value) => setConfig({ ...config, deposit: { ...config.deposit, assets: value.split(",").map((item) => item.trim()).filter(Boolean) } })} /><Field label="Fallback pool" value={config.deposit.fallbackPool} onChange={(value) => setConfig({ ...config, deposit: { ...config.deposit, fallbackPool: value } })} /><label className="admin-switch-card"><input aria-label="Auto route active plans" type="checkbox" checked={config.deposit.activePlanRouting} onChange={(event) => setConfig({ ...config, deposit: { ...config.deposit, activePlanRouting: event.target.checked } })} /><span><strong>Auto route to plan</strong><small>Enabled when the user already has an active plan.</small></span></label><div className="admin-readonly"><span>日常佣金币种</span><strong>ETH</strong><small>6 claim batches per day</small></div></div></section>
          <section className="admin-panel"><SectionHeading eyebrow="POOL MAP" title="Pool structure" description="Pool names are for configuration identity; real balances come from chain reads." /><div className="admin-pool-grid">{[["Flexible pool", config.pools.flexiblePool], ["VIP subpools", `${config.pools.vipSubPools} pools`], ["Temporary pool", config.pools.temporaryPool], ["Reward reserve", config.pools.rewardPool]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
        </div> : null}

        {section === "withdrawal" ? <div className="space-y-5"><ActionStrip actions={[{ label: "保存报价设置", tone: "primary" }, { label: "提现审核", tone: "warning" }, { label: "兑换记录" }]} onAction={awaitIntegration} /><section className="admin-panel"><SectionHeading eyebrow="WITHDRAWAL" title="Exchange and withdrawal settings" description="Users exchange ETH into USDC before USDC withdrawal or transfer." /><div className="admin-form-grid cols-3"><label className="admin-field"><span>Quote mode</span><select aria-label="Quote mode" value={config.withdrawal.priceMode} onChange={(event) => setConfig({ ...config, withdrawal: { ...config.withdrawal, priceMode: event.target.value as "realtime" | "custom" } })}><option value="realtime">Realtime API quote</option><option value="custom">Custom quote</option></select></label>{config.withdrawal.priceMode === "custom" ? <Field label="Custom USDC rate" value={config.withdrawal.customUsdcRate} suffix="USDC" onChange={(value) => setConfig({ ...config, withdrawal: { ...config.withdrawal, customUsdcRate: value } })} /> : <div className="admin-readonly"><span>Realtime quote</span><strong>Waiting for API</strong><small>Production exchange is not open before integration.</small></div>}<Field label="Withdrawal asset" value={config.withdrawal.asset} onChange={(value) => setConfig({ ...config, withdrawal: { ...config.withdrawal, asset: value } })} /><Field label="最低提现" value={config.withdrawal.minimumUsdc} suffix="USDC" onChange={(value) => setConfig({ ...config, withdrawal: { ...config.withdrawal, minimumUsdc: value } })} /><Field label="Daily limit" value={config.withdrawal.dailyLimit} onChange={(value) => setConfig({ ...config, withdrawal: { ...config.withdrawal, dailyLimit: value } })} /><Field label="Arrival estimate" value={config.withdrawal.arrivalHours} suffix="hours" onChange={(value) => setConfig({ ...config, withdrawal: { ...config.withdrawal, arrivalHours: value } })} /></div></section></div> : null}

        {section === "publish" ? <div className="space-y-5"><ActionStrip actions={[{ label: "预览变更", tone: "primary" }, { label: "创建多签任务", tone: "warning" }, { label: "升级管理" }, { label: "查看审计记录" }]} onAction={awaitIntegration} /><section className="admin-panel"><SectionHeading eyebrow="AUDIT LOG" title="Publish and change log" description="Production publish requires admin auth, diff preview, second confirmation, and audit write." /><div className="admin-publish-state"><div><span>Current status</span><strong>Local draft</strong></div><button type="button" disabled>发布更新</button></div><div className="admin-empty"><strong>暂无发布记录</strong><span>Saving a draft does not create production publish records.</span></div></section></div> : null}
      </main>
    </div>
  </div>;
}
