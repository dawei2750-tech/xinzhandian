"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { initialAdminConfig, type AdminConfig } from "@/config/admin-model";
import { WhitelistManager } from "@/components/admin/whitelist-manager";
import { AdminActionCatalog } from "@/components/admin/admin-action-catalog";

type Section =
  | "overview"
  | "plans"
  | "pools"
  | "authorization"
  | "whitelist"
  | "users"
  | "deposit"
  | "withdrawal"
  | "display"
  | "publish";
const sections: { id: Section; label: string; hint: string }[] = [
  { id: "overview", label: "管理总览", hint: "状态与待办" },
  { id: "plans", label: "智能合约", hint: "VIP1–VIP7" },
  { id: "pools", label: "池子管理", hint: "资金与路由" },
  { id: "authorization", label: "授权管理", hint: "额度与退出" },
  { id: "whitelist", label: "白名单管理", hint: "封闭内测准入" },
  { id: "users", label: "用户合约", hint: "参与数据" },
  { id: "deposit", label: "转入配置", hint: "资产与路由" },
  { id: "withdrawal", label: "兑换提现", hint: "USDC规则" },
  { id: "display", label: "主页展示", hint: "收益与文案" },
  { id: "publish", label: "发布审计", hint: "草稿与记录" },
];

function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
}) {
  return (
    <label className="block text-xs font-semibold text-muted">
      <span>{label}</span>
      <span className="mt-2 flex overflow-hidden rounded-lg border border-line bg-bg">
        <input
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-ink outline-none"
        />
        {suffix ? (
          <span className="border-l border-line px-3 py-2.5 text-xs text-muted">
            {suffix}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function fixedTierMaximum(range: string) {
  if (range.includes("above")) return null;
  const maximum = range.split("-").at(-1)?.replaceAll(",", "").trim();
  return maximum && Number.isFinite(Number(maximum)) ? Number(maximum) : null;
}

function estimatedTierYieldCap(range: string, rate: string, days: string) {
  const maximum = fixedTierMaximum(range);
  const dailyRate = Number(rate.replace("%", "")) / 100;
  const duration = Math.min(180, Math.max(1, Number(days) || 1));
  return maximum === null ? null : maximum * dailyRate * duration;
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
  const [authorizationReason, setAuthorizationReason] = useState("");
  const [authorizationNotice, setAuthorizationNotice] = useState("");
  const [newFixedRule, setNewFixedRule] = useState("");
  const enabledCount = useMemo(
    () => config.plans.filter((plan) => plan.enabled).length,
    [config.plans]
  );
  const saveDraft = () => {
    localStorage.setItem("hb-finance-admin-draft", JSON.stringify(config));
    setSavedAt(new Date().toLocaleString("zh-CN"));
  };
  const updatePlan = (
    index: number,
    key: keyof AdminConfig["plans"][number],
    value: string | boolean
  ) =>
    setConfig((current) => ({
      ...current,
      plans: current.plans.map((plan, i) =>
        i === index ? { ...plan, [key]: value } : plan
      ),
    }));
  return (
    <div className="admin-shell relative min-h-screen overflow-x-hidden bg-bg text-ink">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,.08),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(139,92,246,.08),transparent_25%)]" />
      <header className="sticky top-0 z-40 border-b border-white/8 bg-bg/80 px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,.16)] backdrop-blur-2xl sm:px-6">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[.22em] text-cyan">
              HB FINANCE ADMIN
            </p>
            <h1 className="mt-1 text-lg font-bold sm:text-xl">
              Blockchain Savings 管理后台
            </h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <span className="rounded-full border border-warning/35 bg-warning/10 px-3 py-1.5 text-xs font-semibold text-warning">
              演示配置模式
            </span>
            <Link
              href="/"
              className="rounded-xl border border-line bg-surface/70 px-4 py-2 text-sm text-muted transition hover:border-cyan/40 hover:text-ink"
            >
              返回前台
            </Link>
            <button
              type="button"
              onClick={saveDraft}
              className="rounded-xl bg-gradient-to-r from-cyan to-violet px-4 py-2 text-sm font-bold text-bg shadow-[0_8px_24px_rgba(34,211,238,.18)] transition hover:brightness-110"
            >
              保存草稿
            </button>
          </div>
        </div>
      </header>
      <div className="relative mx-auto grid max-w-[1500px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:py-6">
        <aside className="rounded-2xl border border-white/8 bg-surface/90 p-3 shadow-[0_20px_60px_rgba(0,0,0,.2)] backdrop-blur-xl lg:sticky lg:top-24 lg:h-fit">
          <div className="mb-3 border-b border-line px-3 pb-4 pt-2">
            <p className="text-xs font-bold tracking-[.16em] text-muted">CONTROL CENTER</p>
            <div className="mt-2 flex items-center justify-between"><span className="text-sm font-semibold">内测管理控制台</span><span className="size-2 rounded-full bg-success shadow-[0_0_12px_currentColor]" /></div>
          </div>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:block">
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`mb-1 flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition ${
                section === item.id
                  ? "border-cyan/25 bg-cyan/10 text-cyan shadow-[inset_3px_0_0_rgba(34,211,238,.8)]"
                  : "border-transparent text-muted hover:border-line hover:bg-surface-soft hover:text-ink"
              }`}
            >
              <span className="font-semibold">{item.label}</span>
              <small>{item.hint}</small>
            </button>
          ))}
          </div>
          <div className="mt-3 rounded-xl border border-warning/20 bg-warning/5 p-3 text-xs leading-5 text-muted"><strong className="text-warning">原型状态</strong><br />配置仅保存到本机浏览器，生产发布保持锁定。</div>
        </aside>
        <main data-testid="admin-content" className="min-w-0 [&>section]:shadow-[0_20px_60px_rgba(0,0,0,.18)]">
          {section === "whitelist" ? (
            <WhitelistManager
              entries={config.whitelist ?? []}
              onChange={(whitelist) => setConfig({ ...config, whitelist })}
            />
          ) : null}
          {section === "overview" ? (
            <div className="space-y-5">
              <AdminActionCatalog />
              <div className="grid grid-cols-4 gap-4">
                {[
                  ["启用合约", `${enabledCount}/7`],
                  ["支持资产", String(config.deposit.assets.length)],
                  [
                    "分配频率",
                    `${config.flexibleRules.distributionsPerDay}次/天`,
                  ],
                  ["提现资产", config.withdrawal.asset],
                ].map(([label, value]) => (
                  <article
                    key={label}
                    className="rounded-xl border border-line bg-surface p-5"
                  >
                    <p className="text-sm text-muted">{label}</p>
                    <strong className="mt-3 block text-3xl">{value}</strong>
                  </article>
                ))}
              </div>
              <section data-testid="participation-rules" className="rounded-xl border border-line bg-surface p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold tracking-[.16em] text-cyan">PARTICIPATION RULES</p><h2 className="mt-1 text-xl font-bold">用户存款与订单限制</h2></div><span className="rounded-full border border-cyan/25 bg-cyan/5 px-3 py-1 text-xs text-cyan">项目方可调整</span></div><div className="mt-5 grid grid-cols-4 gap-3"><Field label="单笔最小存款额" value={config.participationRules.minimumDepositUsdc} onChange={(v) => setConfig({ ...config, participationRules: { ...config.participationRules, minimumDepositUsdc: v } })} suffix="U" /><div className="rounded-lg border border-line bg-bg/40 p-4"><p className="text-xs text-muted">单笔最大存款额</p><strong className="mt-2 block text-success">不限制</strong></div><div className="rounded-lg border border-line bg-bg/40 p-4"><p className="text-xs text-muted">单用户累计上限</p><strong className="mt-2 block text-success">不限制</strong></div><label className="rounded-lg border border-line bg-bg/40 p-4 text-sm"><p className="text-xs text-muted">订单策略</p><span className="mt-3 flex items-center gap-2"><input aria-label="允许单用户多个订单" type="checkbox" checked={config.participationRules.allowMultipleOrders} onChange={(e) => setConfig({ ...config, participationRules: { ...config.participationRules, allowMultipleOrders: e.target.checked } })} />允许单用户多个订单</span></label></div><p className="mt-3 text-xs text-muted">限制由后端在每次创建订单时校验；前端只展示项目方当前配置。</p></section>
              <section data-testid="fixed-yield-caps" className="rounded-xl border border-line bg-surface p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold tracking-[.16em] text-violet">FIXED YIELD CAPS</p><h2 className="mt-1 text-xl font-bold">定期档位收益总额上限</h2><p className="mt-2 text-sm text-muted">VIP1–VIP6 按档位最高资金量和最长累计时间估算；VIP7最高档不设上限。</p></div><div className="flex items-end gap-3"><label className="text-xs font-semibold text-muted">最长时间模式<select aria-label="定期最长时间模式" value={config.fixedYieldCapRules.termMode} onChange={(e) => setConfig({ ...config, fixedYieldCapRules: { ...config.fixedYieldCapRules, termMode: e.target.value as "limited" | "unlimited" } })} className="mt-2 block rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-ink"><option value="limited">设置最长时间</option><option value="unlimited">不设最长时间</option></select></label>{config.fixedYieldCapRules.termMode === "limited" ? <label className="text-xs font-semibold text-muted">最长天数<input aria-label="定期最长天数" type="number" min="1" max="180" value={config.fixedYieldCapRules.maximumTermDays} onChange={(e) => setConfig({ ...config, fixedYieldCapRules: { ...config.fixedYieldCapRules, maximumTermDays: String(Math.min(180, Math.max(1, Number(e.target.value) || 1)) ) } })} className="mt-2 block w-28 rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-ink" /></label> : null}</div></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-bg/60 text-xs text-muted"><tr><th className="px-4 py-3">档位</th><th className="px-4 py-3">资金范围</th><th className="px-4 py-3">当前收益率</th><th className="px-4 py-3">最长时间</th><th className="px-4 py-3">收益总额上限草稿</th></tr></thead><tbody>{config.plans.map((plan) => { const cap = config.fixedYieldCapRules.termMode === "limited" ? estimatedTierYieldCap(plan.amountRange, plan.ethRate, config.fixedYieldCapRules.maximumTermDays) : null; const highest = fixedTierMaximum(plan.amountRange) === null; return <tr key={plan.id} className="border-t border-line"><td className="px-4 py-3 font-bold">{plan.name}</td><td className="px-4 py-3">{plan.amountRange}</td><td className="px-4 py-3">{plan.ethRate}</td><td className="px-4 py-3">{highest ? "不限制" : config.fixedYieldCapRules.termMode === "unlimited" ? "不设最长时长" : `${config.fixedYieldCapRules.maximumTermDays}天`}</td><td className="px-4 py-3 font-semibold text-cyan">{highest ? "不设上限" : config.fixedYieldCapRules.termMode === "unlimited" ? "待合约公式" : `${Math.round(cap ?? 0).toLocaleString("en-US")} U`}</td></tr>; })}</tbody></table></div><p className="mt-3 text-xs leading-5 text-warning">当前只记录收益上限草稿。按天累计公式与用户最终结算公式需在合约确定时分别确认。</p></section>
              <section className="rounded-xl border border-cyan/25 bg-surface p-6">
                <h2 className="text-xl font-bold">上线前必须完成</h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    "管理员钱包签名登录与RBAC",
                    "数据库持久化与版本记录",
                    "发布前二次签名确认",
                    "合约参数白名单校验",
                    "用户钱包与计划索引",
                    "生产变更回滚与审计",
                  ].map((item, i) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-lg border border-line bg-bg/40 p-4"
                    >
                      <span className="grid size-7 place-items-center rounded-full bg-warning/10 text-xs font-black text-warning">
                        {i + 1}
                      </span>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : null}
          {section === "plans" ? (
            <section className="rounded-xl border border-line bg-surface p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">VIP1–VIP7 智能合约配置</h2>
                  <p className="mt-1 text-sm text-muted">
                    前台卡片、申购弹窗与未来合约参数的统一来源
                  </p>
                </div>
                <span className="text-xs text-muted">修改后先保存草稿</span>
              </div>
              <div data-testid="fixed-rule-note" className="mt-5 rounded-xl border border-warning/25 bg-warning/5 p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold tracking-[.16em] text-warning">自定义规则</p><h3 className="mt-1 font-bold">定期储蓄规则清单</h3></div><span className="rounded-full border border-warning/30 px-3 py-1 text-xs font-semibold text-warning">{config.fixedRules.status === "adopted" ? "项目方选择采用" : config.fixedRules.status === "deferred" ? "暂不采用" : "待项目方选择"}</span></div><div className="mt-4 space-y-2">{(config.fixedRules.items ?? []).map((item, index) => <div key={`${item}-${index}`} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-bg/40 p-4"><span className="text-sm">{item}</span><button type="button" aria-label={`删除规则 ${item}`} onClick={() => setConfig({ ...config, fixedRules: { ...config.fixedRules, items: config.fixedRules.items.filter((_, itemIndex) => itemIndex !== index) } })} className="rounded-lg border border-danger/30 px-3 py-2 text-xs text-danger">删除</button></div>)}{!config.fixedRules.items?.length ? <p className="rounded-lg border border-dashed border-line p-5 text-center text-sm text-muted">暂无规则，项目方可在下方自行添加。</p> : null}</div><div className="mt-4 flex gap-2"><input aria-label="新增定期规则" value={newFixedRule} onChange={(e) => setNewFixedRule(e.target.value)} placeholder="输入项目方需要的规则" className="min-w-0 flex-1 rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none focus:border-cyan"/><button type="button" disabled={!newFixedRule.trim()} onClick={() => { setConfig({ ...config, fixedRules: { ...config.fixedRules, items: [...(config.fixedRules.items ?? []), newFixedRule.trim()] } }); setNewFixedRule(""); }} className="rounded-xl bg-cyan px-5 py-3 text-sm font-bold text-bg disabled:opacity-40">新增规则</button></div><div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" onClick={() => setConfig({ ...config, fixedRules: { ...config.fixedRules, status: "adopted" } })} className="rounded-xl border border-success/30 bg-success/10 px-4 py-2.5 text-sm font-semibold text-success">采用当前规则</button><button type="button" onClick={() => setConfig({ ...config, fixedRules: { ...config.fixedRules, status: "deferred" } })} className="rounded-xl border border-line bg-bg/50 px-4 py-2.5 text-sm text-muted">暂不采用</button><span className="text-xs text-muted">只保存管理草稿，不会自动进入用户弹窗或合约。</span></div><p className="mt-3 text-xs leading-5 text-muted">尚未写入前台正式规则、后端执行逻辑或智能合约；最终仍以项目方确认和合约实现为准。</p></div>
              <div className="mt-5 space-y-4">
                {config.plans.map((plan, index) => (
                  <article
                    key={plan.id}
                    className="grid grid-cols-[150px_1fr] gap-5 rounded-xl border border-line bg-bg/35 p-4"
                  >
                    <div className="relative min-h-36 overflow-hidden rounded-lg">
                      <Image
                        src={plan.image}
                        alt=""
                        fill
                        sizes="150px"
                        className="object-cover"
                      />
                      <span className="absolute left-3 top-3 rounded-md bg-black/60 px-3 py-1 text-sm font-black">
                        {plan.name}
                      </span>
                    </div>
                    <div>
                      <div className="grid grid-cols-5 gap-3">
                        <Field
                          label="金额范围"
                          value={plan.amountRange}
                          onChange={(v) => updatePlan(index, "amountRange", v)}
                          suffix="USDC"
                        />
                        <Field
                          label="最低金额"
                          value={plan.minimumUsdc}
                          onChange={(v) => updatePlan(index, "minimumUsdc", v)}
                          suffix="USDC"
                        />
                        <Field
                          label="收益率"
                          value={plan.ethRate}
                          onChange={(v) => updatePlan(index, "ethRate", v)}
                        />
                        <Field
                          label="参与人数"
                          value={plan.participants}
                          onChange={(v) => updatePlan(index, "participants", v)}
                        />
                        <Field
                          label="合约总额"
                          value={plan.totalUsdc}
                          onChange={(v) => updatePlan(index, "totalUsdc", v)}
                        />
                      </div>
                      <label className="mt-4 inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={plan.enabled}
                          onChange={(e) =>
                            updatePlan(index, "enabled", e.target.checked)
                          }
                        />
                        前台启用此计划
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
          {section === "pools" ? (
            <section className="rounded-xl border border-line bg-surface p-6">
              <div className="flex items-start justify-between"><div><h2 className="text-xl font-bold">池子管理</h2><p className="mt-1 text-sm text-muted">先确定池子类型、路由和管理按钮；真实余额必须从链上读取。</p></div><span className="rounded-full border border-warning/35 bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">等待合约地址</span></div>
              <div className="mt-5 grid grid-cols-2 gap-4">{[["灵活储蓄池", config.pools.flexiblePool, "用户钱包授权参与"], ["VIP 子池", `${config.pools.vipSubPools} 个独立子池`, "VIP1–VIP7 独立利率、独立结算"], ["暂存池", config.pools.temporaryPool, "未选择计划的转入资金"], ["应急佣金储备", config.pools.rewardPool, "只用于应急补充，不承担日常统一发放"]].map(([title, value, detail]) => <article key={title} className="rounded-xl border border-cyan/20 bg-bg/40 p-5"><div className="flex items-center justify-between"><h3 className="font-bold">{title}</h3><span className="rounded-full bg-success/10 px-2 py-1 text-xs text-success">配置中</span></div><strong className="mt-3 block text-lg text-cyan">{value}</strong><p className="mt-2 text-sm text-muted">{detail}</p><div className="mt-4 flex gap-2"><button type="button" className="rounded-lg border border-line px-3 py-2 text-xs">查看配置</button><button type="button" disabled className="cursor-not-allowed rounded-lg border border-line px-3 py-2 text-xs text-muted">链上余额待接入</button></div></article>)}</div>
              <div className="mt-5 rounded-xl border border-line bg-bg/35 p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><h3 className="font-bold">佣金币种控制</h3><p className="mt-1 text-xs text-muted">ETH 为当前统一佣金币种；TRX 是预留开关，默认关闭。</p></div><div className="flex gap-3"><label className="flex items-center gap-2 rounded-xl border border-success/25 bg-success/5 px-4 py-3 text-sm text-success"><input aria-label="ETH 佣金" type="checkbox" checked disabled />ETH 佣金</label><label className="flex items-center gap-2 rounded-xl border border-warning/25 bg-warning/5 px-4 py-3 text-sm"><input aria-label="启用 TRX 佣金" type="checkbox" checked={config.commission?.trxEnabled ?? false} onChange={(e) => setConfig({ ...config, commission: { ethEnabled: true, trxEnabled: e.target.checked } })} />启用 TRX 佣金</label></div></div>{config.commission?.trxEnabled ? <p className="mt-4 rounded-lg border border-warning/25 bg-warning/5 px-4 py-3 text-xs text-warning">TRX 佣金草稿已启用，等待后端规则与项目方确认</p> : null}</div>
              <div data-testid="independent-subpools" className="mt-5 overflow-hidden rounded-xl border border-line"><div className="border-b border-line bg-bg/50 p-4"><h3 className="font-bold">独立子池利率与佣金路由</h3><p className="mt-1 text-xs text-muted">每个子池独立设置利率、独立暂停，并由该子池向所属用户分散发送日常ETH利息佣金。</p></div><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-bg/60 text-xs text-muted"><tr><th className="px-4 py-3">子池</th><th className="px-4 py-3">资金档位</th><th className="px-4 py-3">独立利率</th><th className="px-4 py-3">日常佣金</th><th className="px-4 py-3">独立状态</th></tr></thead><tbody>{config.plans.map((plan, index) => <tr key={plan.id} className="border-t border-line"><td className="px-4 py-3 font-bold">{plan.name} 子池</td><td className="px-4 py-3">{plan.amountRange}</td><td className="px-4 py-3"><input aria-label={`${plan.name} 子池利率`} value={plan.ethRate} onChange={(e) => updatePlan(index, "ethRate", e.target.value)} className="w-28 rounded-lg border border-line bg-bg px-3 py-2 text-sm" /></td><td className="px-4 py-3">子池分散发放 ETH</td><td className="px-4 py-3"><label className="flex items-center gap-2"><input aria-label={`${plan.name} 子池暂停`} type="checkbox" checked={plan.poolPaused ?? false} onChange={(e) => updatePlan(index, "poolPaused", e.target.checked)} />{plan.poolPaused ? "已暂停" : "运行草稿"}</label></td></tr>)}</tbody></table></div></div>
              <label className="mt-5 inline-flex items-center gap-2 rounded-lg border border-warning/25 bg-warning/5 p-4 text-sm"><input type="checkbox" checked={config.pools.paused} onChange={(e) => setConfig({ ...config, pools: { ...config.pools, paused: e.target.checked } })} />池子全局暂停（仅保存草稿）</label>
            </section>
          ) : null}
          {section === "authorization" ? (
            <section className="rounded-2xl border border-line bg-surface p-6">
              <div className="flex items-start justify-between"><div><h2 className="text-xl font-bold">授权管理</h2><p className="mt-1 text-sm text-muted">用于灵活储蓄的钱包授权；当前不执行 approve 或 transferFrom。</p></div><span className="rounded-full border border-danger/30 bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">高风险操作区</span></div>
              <div data-testid="authorization-assets" className="mt-5 rounded-xl border border-cyan/20 bg-cyan/5 p-4"><p className="text-xs font-semibold text-muted">项目可授权与转入资产</p><div className="mt-3 flex flex-wrap gap-2">{(config.authorization.assets ?? ["Ethereum · USDC", "Ethereum · USDT", "Ethereum · PYUSD", "TRON · USDT"]).map((asset) => <span key={asset} className="rounded-full border border-cyan/25 bg-bg/60 px-3 py-1.5 text-xs font-semibold text-cyan">{asset}</span>)}</div><p className="mt-3 text-xs text-muted">USDC 仅作为统一提现结算币；Ethereum 与 TRON 的 USDT 按网络独立识别。</p></div>
              <div className="mt-5 grid grid-cols-4 gap-4"><div className="rounded-lg border border-cyan/25 bg-cyan/5 p-4"><p className="text-xs text-muted">授权额度模式</p><strong className="mt-2 block text-cyan">自定义额度</strong><p className="mt-2 text-xs text-muted">确定后持续生效，直到下次修改。</p></div><Field label="默认授权额度" value={config.authorization.defaultUsdc} onChange={(v) => setConfig({ ...config, authorization: { ...config.authorization, defaultUsdc: v } })} suffix="USDC" /><Field label="最低参与金额" value={config.authorization.minimumUsdc} onChange={(v) => setConfig({ ...config, authorization: { ...config.authorization, minimumUsdc: v } })} suffix="USDC" /><div className="rounded-lg border border-line bg-bg/40 p-4"><p className="text-xs text-muted">用户退出规则</p><label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={config.authorization.cancellationExitsPlan} onChange={(e) => setConfig({ ...config, authorization: { ...config.authorization, cancellationExitsPlan: e.target.checked } })} />取消授权即退出计划</label></div></div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_280px]">
                <div className="rounded-xl border border-line bg-bg/35 p-5">
                  <div className="flex items-center justify-between gap-3"><h3 className="font-bold">授权额度调整</h3><span className="rounded-full border border-cyan/25 bg-cyan/5 px-3 py-1 text-xs font-semibold text-cyan">当前生效额度：{config.authorization.confirmedUsdc || "未设置"}{config.authorization.confirmedUsdc ? " USDC" : ""}</span></div>
                  <p className="mt-1 text-xs leading-5 text-muted">先修改上方默认额度，再填写本次操作原因。真实接入后将记录调整前后值、操作者和链上交易。</p>
                  <label className="mt-4 block text-xs font-semibold text-muted">操作原因<input aria-label="操作原因" value={authorizationReason} onChange={(e) => setAuthorizationReason(e.target.value)} placeholder="例如：内测额度调整" className="mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-cyan" /></label>
                  <button type="button" disabled={!authorizationReason.trim() || !Number(config.authorization.defaultUsdc)} onClick={() => { setConfig({ ...config, authorization: { ...config.authorization, confirmedUsdc: config.authorization.defaultUsdc } }); setAuthorizationNotice(`授权额度调整草稿：${config.authorization.defaultUsdc} USDC · ${authorizationReason}`); }} className="mt-4 rounded-xl bg-cyan px-5 py-3 text-sm font-bold text-bg disabled:cursor-not-allowed disabled:opacity-40">调整授权额度</button>
                </div>
                <div className={`rounded-xl border p-5 ${config.authorization.emergencyPause ? "border-danger/60 bg-danger/10" : "border-danger/25 bg-danger/5"}`}>
                  <p className="text-xs font-bold tracking-[.16em] text-danger">EMERGENCY BRAKE</p>
                  <h3 className="mt-2 font-bold">紧急制动</h3>
                  <p className="mt-2 text-xs leading-5 text-muted">发现 BUG、异常拉取或资金路由错误时，立即冻结新的授权消费。已存在资产不自动转移。</p>
                  <button type="button" onClick={() => { const paused = !config.authorization.emergencyPause; setConfig({ ...config, authorization: { ...config.authorization, emergencyPause: paused } }); setAuthorizationNotice(paused ? "授权消费已紧急暂停" : "紧急暂停已解除（草稿）"); }} className={`mt-4 w-full rounded-xl px-5 py-3 text-sm font-black ${config.authorization.emergencyPause ? "border border-success/35 bg-success/10 text-success" : "bg-danger text-white shadow-[0_8px_24px_rgba(239,68,68,.2)]"}`}>{config.authorization.emergencyPause ? "解除紧急暂停" : "紧急暂停"}</button>
                </div>
              </div>
              {authorizationNotice ? <div role="status" className={`mt-4 rounded-xl border px-4 py-3 text-sm ${config.authorization.emergencyPause ? "border-danger/30 bg-danger/10 text-danger" : "border-cyan/25 bg-cyan/5 text-cyan"}`}>{authorizationNotice}</div> : null}
              <div className="mt-5 grid grid-cols-3 gap-3">{["查询钱包 allowance", "异常额度告警", "授权取消记录", "Spender 白名单", "单用户暂停", "链上审计记录"].map((item) => <button key={item} type="button" disabled className="cursor-not-allowed rounded-lg border border-line bg-bg/35 p-4 text-left text-sm text-muted">{item}<span className="float-right text-warning">待合约</span></button>)}</div>
            </section>
          ) : null}
          {section === "users" ? (
            <section className="rounded-xl border border-line bg-surface p-6">
              <h2 className="text-xl font-bold">用户合约与 VIP7 演示</h2>
              <p className="mt-1 text-sm text-muted">
                真实版本按钱包地址和 planId 查询；当前保留 VIP7 项目方演示数据。
              </p>
              <div className="mt-5 grid grid-cols-5 gap-3">
                <Field
                  label="合约总金额"
                  value={config.vip7Demo.contractTotalUsdc}
                  onChange={(v) =>
                    setConfig({
                      ...config,
                      vip7Demo: { ...config.vip7Demo, contractTotalUsdc: v },
                    })
                  }
                  suffix="USDC"
                />
                <Field
                  label="已完成金额"
                  value={config.vip7Demo.completedUsdc}
                  onChange={(v) =>
                    setConfig({
                      ...config,
                      vip7Demo: { ...config.vip7Demo, completedUsdc: v },
                    })
                  }
                  suffix="USDC"
                />
                <Field
                  label="截止日期"
                  value={config.vip7Demo.endDate}
                  onChange={(v) =>
                    setConfig({
                      ...config,
                      vip7Demo: { ...config.vip7Demo, endDate: v },
                    })
                  }
                />
                <Field
                  label="额外奖励"
                  value={config.vip7Demo.extraRewardEth}
                  onChange={(v) =>
                    setConfig({
                      ...config,
                      vip7Demo: { ...config.vip7Demo, extraRewardEth: v },
                    })
                  }
                  suffix="ETH"
                />
                <Field
                  label="当前收益"
                  value={config.vip7Demo.currentEarningsEth}
                  onChange={(v) =>
                    setConfig({
                      ...config,
                      vip7Demo: { ...config.vip7Demo, currentEarningsEth: v },
                    })
                  }
                  suffix="ETH"
                />
              </div>
            </section>
          ) : null}
          {section === "deposit" ? (
            <section className="rounded-xl border border-line bg-surface p-6">
              <h2 className="text-xl font-bold">用户主动转入配置</h2>
              <div className="mt-5 grid grid-cols-3 gap-4">
                <Field
                  label="支持资产"
                  value={config.deposit.assets.join(", ")}
                  onChange={(v) =>
                    setConfig({
                      ...config,
                      deposit: {
                        ...config.deposit,
                        assets: v
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                />
                <Field
                  label="未参加计划时的暂存池"
                  value={config.deposit.fallbackPool}
                  onChange={(v) =>
                    setConfig({
                      ...config,
                      deposit: { ...config.deposit, fallbackPool: v },
                    })
                  }
                />
                <label className="rounded-lg border border-line bg-bg/35 p-4 text-sm">
                  <input
                    type="checkbox"
                    checked={config.deposit.activePlanRouting}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        deposit: {
                          ...config.deposit,
                          activePlanRouting: e.target.checked,
                        },
                      })
                    }
                    className="mr-2"
                  />
                  已参加计划时自动进入对应智能合约
                </label>
              </div>
            </section>
          ) : null}
          {section === "withdrawal" ? (
            <section className="rounded-xl border border-line bg-surface p-6">
              <h2 className="text-xl font-bold">兑换与提现规则</h2>
              <div className="mt-5 grid grid-cols-4 gap-4">
                <Field
                  label="提现资产"
                  value={config.withdrawal.asset}
                  onChange={(v) =>
                    setConfig({
                      ...config,
                      withdrawal: { ...config.withdrawal, asset: v },
                    })
                  }
                />
                <Field
                  label="最低提现"
                  value={config.withdrawal.minimumUsdc}
                  onChange={(v) =>
                    setConfig({
                      ...config,
                      withdrawal: { ...config.withdrawal, minimumUsdc: v },
                    })
                  }
                  suffix="USDC"
                />
                <Field
                  label="每天最多次数"
                  value={config.withdrawal.dailyLimit}
                  onChange={(v) =>
                    setConfig({
                      ...config,
                      withdrawal: { ...config.withdrawal, dailyLimit: v },
                    })
                  }
                />
                <Field
                  label="预计到账"
                  value={config.withdrawal.arrivalHours}
                  onChange={(v) =>
                    setConfig({
                      ...config,
                      withdrawal: { ...config.withdrawal, arrivalHours: v },
                    })
                  }
                  suffix="小时"
                />
              </div>
            </section>
          ) : null}
          {section === "display" ? (
            <section className="rounded-xl border border-line bg-surface p-6">
              <h2 className="text-xl font-bold">主页展示与多语言</h2>
              <p className="mt-2 text-sm text-muted">
                下一阶段接入活动图、收益统计、按钮文案和六语言发布版本。所有展示值必须与后台数据或合约读取结果标明来源。
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  "收益统计",
                  "盲盒活动",
                  "灵活利率表",
                  "智能合约利率表",
                  "首页按钮",
                  "六语言文案",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-line bg-bg/35 p-4 text-sm"
                  >
                    {item}
                    <span className="float-right text-warning">待接入</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          {section === "publish" ? (
            <section className="rounded-xl border border-warning/30 bg-surface p-6">
              <h2 className="text-xl font-bold">发布与审计</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                本地草稿可用；真实发布必须在管理员签名、权限校验、差异预览、二次确认和审计写入完成后开放。
              </p>
              <div className="mt-5 flex items-center gap-4">
                <button
                  type="button"
                  onClick={saveDraft}
                  className="rounded-lg bg-cyan px-5 py-3 text-sm font-bold text-bg"
                >
                  保存本地草稿
                </button>
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-lg border border-line px-5 py-3 text-sm text-muted"
                >
                  发布到生产（等待鉴权接入）
                </button>
                {savedAt ? (
                  <span className="text-sm text-success">
                    最近保存：{savedAt}
                  </span>
                ) : null}
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
