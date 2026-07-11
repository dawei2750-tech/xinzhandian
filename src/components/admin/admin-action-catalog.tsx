"use client";

import { useState } from "react";

const groups = [
  {
    title: "网络与资产",
    tone: "cyan",
    actions: ["EVM网络管理", "参与币种管理", "价格源与缓存", "备用节点", "EVM同网络USDC提现"],
  },
  {
    title: "用户与订单",
    tone: "violet",
    actions: ["白名单管理", "用户订单", "灵活储蓄计时", "定期订单", "授权状态", "取消授权处理"],
  },
  {
    title: "池子与收益",
    tone: "success",
    actions: ["VIP1–VIP7子池", "灵活储蓄池", "闲置池", "运维池", "奖励池", "预留池1", "预留池2", "利率公式", "收益上限"],
  },
  {
    title: "资金与审批",
    tone: "warning",
    actions: ["ETH佣金", "佣金领取模式", "用户兑换", "提现审核", "服务费", "奖励发放", "闲置归档", "运维池多签"],
  },
  {
    title: "系统控制",
    tone: "danger",
    actions: ["角色权限", "整体紧急暂停", "恢复运行", "价格故障暂停", "操作记录", "后端接口状态"],
  },
] as const;

const toneClass: Record<string, string> = {
  cyan: "border-cyan/25 bg-cyan/5 text-cyan",
  violet: "border-violet/25 bg-violet/5 text-violet",
  success: "border-success/25 bg-success/5 text-success",
  warning: "border-warning/25 bg-warning/5 text-warning",
  danger: "border-danger/25 bg-danger/5 text-danger",
};

export function AdminActionCatalog() {
  const [activeGroup, setActiveGroup] = useState<(typeof groups)[number]["title"]>(groups[0].title);
  const selectedGroup = groups.find((group) => group.title === activeGroup) ?? groups[0];
  return (
    <section data-testid="admin-action-catalog" className="rounded-2xl border border-line bg-surface p-6 shadow-[0_20px_60px_rgba(0,0,0,.18)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[.18em] text-cyan">ADMIN MODULES</p>
          <h2 className="mt-1 text-xl font-bold">后台功能控制台</h2>
          <p className="mt-2 text-sm text-muted">按钮已预留；后端接口接入前只展示模块状态，不执行生产资金操作。</p>
        </div>
        <span className="rounded-full border border-warning/30 bg-warning/5 px-3 py-1.5 text-xs font-semibold text-warning">本地原型 · 未发布</span>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {groups.map((group) => <button key={group.title} type="button" onClick={() => setActiveGroup(group.title)} className={`rounded-xl border p-4 text-left transition ${activeGroup === group.title ? toneClass[group.tone] : "border-line bg-bg/35 text-muted hover:bg-bg/60"}`}><span className="text-sm font-bold">{group.title}</span><span className="mt-1 block text-xs opacity-70">{group.actions.length} 个模块</span></button>)}
      </div>
      <div className="mt-4 rounded-xl border border-line bg-bg/30 p-4">
        <div className="mb-3 flex items-center gap-2"><span className={`size-2 rounded-full ${toneClass[selectedGroup.tone].split(" ")[1]}`} /><h3 className="text-sm font-bold">{selectedGroup.title}</h3></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {selectedGroup.actions.map((action) => (
            <button key={action} type="button" className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 hover:brightness-110 ${toneClass[selectedGroup.tone]}`}>
              {action}<span className="mt-1 block text-[10px] font-normal opacity-65">模块入口已预留</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 border-t border-line pt-5">
        <p className="text-xs font-bold tracking-[.16em] text-muted">后续新增项目</p>
        <div className="mt-3 flex flex-wrap gap-2">{["高级升级治理", "自定义升级时间锁", "TRX佣金", "TRON提现", "更多预留池", "自动公式匹配"].map((item) => <span key={item} className="rounded-full border border-line bg-bg/50 px-3 py-1.5 text-xs text-muted">{item}</span>)}</div>
      </div>
    </section>
  );
}
