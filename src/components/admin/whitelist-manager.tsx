"use client";

import { useMemo, useState } from "react";
import type { WhitelistEntry } from "@/config/admin-model";

const ethereumPattern = /^0x[a-fA-F0-9]{40}$/;
const tronPattern = /^T[1-9A-HJ-NP-Za-km-z]{20,34}$/;
const isValidAddress = (value: string) => ethereumPattern.test(value) || tronPattern.test(value);
const shortAddress = (value: string) => `${value.slice(0, 6)}...${value.slice(-4)}`;

function createEntry(address: string, source: WhitelistEntry["source"]): WhitelistEntry {
  return {
    address,
    network: address.startsWith("0x") ? "Ethereum" : "TRON",
    status: "已启用",
    joinedAt: new Date().toLocaleString("zh-CN"),
    source,
    connected: false,
    contractStatus: "未参加",
    planType: "未选择",
    planName: "—",
    authorizationStatus: "未授权",
    allowanceUsdc: "0",
    depositedUsdc: "0",
    principalUsdc: "0",
    earningsUsdc: "0",
    pool: "未分配",
    maturityDate: "—",
    lastActiveAt: "—",
    riskStatus: "正常",
    note: "内测用户",
  };
}

export function WhitelistManager({ entries, onChange }: { entries: WhitelistEntry[]; onChange: (entries: WhitelistEntry[]) => void }) {
  const [address, setAddress] = useState("");
  const [batch, setBatch] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [queryResult, setQueryResult] = useState("");
  const activeCount = useMemo(() => entries.filter((item) => item.status === "已启用").length, [entries]);

  const addOne = () => {
    const value = address.trim();
    if (!isValidAddress(value)) return setMessage("请输入有效的 Ethereum 或 TRON 钱包地址");
    if (entries.some((item) => item.address.toLowerCase() === value.toLowerCase())) return setMessage("该地址已在白名单中");
    onChange([...entries, createEntry(value, "单个新增")]);
    setAddress(""); setMessage("已新增 1 个地址");
  };
  const importBatch = () => {
    const values = [...new Set(batch.split(/[\s,;]+/).map((item) => item.trim()).filter(isValidAddress))]
      .filter((value) => !entries.some((item) => item.address.toLowerCase() === value.toLowerCase()));
    onChange([...entries, ...values.map((value) => createEntry(value, "批量导入"))]);
    setBatch(""); setMessage(`已导入 ${values.length} 个地址`);
  };
  const search = () => {
    const found = entries.find((item) => item.address.toLowerCase() === query.trim().toLowerCase());
    setQueryResult(found ? `该地址已加入白名单 · ${found.status} · ${found.contractStatus}` : "该地址未加入白名单");
  };

  return (
    <section data-testid="whitelist-management" className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-line bg-surface p-6 shadow-[0_18px_60px_rgba(0,0,0,.18)]">
        <div><p className="text-xs font-bold tracking-[.2em] text-cyan">CLOSED BETA ACCESS</p><h2 className="mt-2 text-2xl font-bold">白名单管理</h2><p className="mt-2 text-sm text-muted">封闭内测准入，仅白名单钱包可进入项目与参加计划。</p></div>
        <div className="grid grid-cols-2 gap-3 text-right"><div className="rounded-xl bg-bg/50 px-5 py-3"><p className="text-xs text-muted">地址总数</p><strong className="text-2xl">{entries.length}</strong></div><div className="rounded-xl bg-bg/50 px-5 py-3"><p className="text-xs text-muted">当前启用</p><strong className="text-2xl text-success">{activeCount}</strong></div></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <article className="rounded-2xl border border-line bg-surface p-5"><h3 className="font-bold">新增钱包</h3><input aria-label="新增钱包地址" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x... 或 T..." className="mt-4 w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none focus:border-cyan"/><button type="button" onClick={addOne} className="mt-3 w-full rounded-xl bg-cyan px-4 py-3 text-sm font-bold text-bg">新增地址</button></article>
        <article className="rounded-2xl border border-line bg-surface p-5"><h3 className="font-bold">批量导入</h3><textarea aria-label="批量导入钱包地址" value={batch} onChange={(e) => setBatch(e.target.value)} placeholder="每行一个地址，也支持逗号分隔" className="mt-4 h-12 w-full resize-none rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none focus:border-cyan"/><button type="button" onClick={importBatch} className="mt-3 w-full rounded-xl border border-cyan/40 bg-cyan/10 px-4 py-3 text-sm font-bold text-cyan">批量导入</button></article>
        <article className="rounded-2xl border border-line bg-surface p-5"><h3 className="font-bold">查询准入状态</h3><input aria-label="查询白名单地址" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="输入完整钱包地址" className="mt-4 w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none focus:border-cyan"/><button type="button" onClick={search} className="mt-3 w-full rounded-xl border border-line px-4 py-3 text-sm font-bold">查询</button></article>
      </div>
      {(message || queryResult) && <div className="rounded-xl border border-cyan/25 bg-cyan/5 px-4 py-3 text-sm text-cyan">{queryResult || message}</div>}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="overflow-x-auto"><table className="min-w-[1500px] w-full text-left text-xs"><thead className="bg-bg/70 text-muted"><tr>{["钱包地址","网络","准入状态","是否参加合约","计划类型","档位","授权状态","授权额度","累计转入","当前本金","累计收益","所属池","到期日","最后活跃","风控状态","操作"].map((label) => <th key={label} className="whitespace-nowrap px-4 py-3 font-semibold">{label}</th>)}</tr></thead><tbody>{entries.length ? entries.map((item) => <tr key={item.address} className="border-t border-line hover:bg-bg/35"><td className="px-4 py-4 font-mono text-cyan" title={item.address}>{shortAddress(item.address)}</td><td className="px-4">{item.network}</td><td className="px-4 text-success">{item.status}</td><td className="px-4">{item.contractStatus}</td><td className="px-4">{item.planType}</td><td className="px-4">{item.planName}</td><td className="px-4">{item.authorizationStatus}</td><td className="px-4">{item.allowanceUsdc}</td><td className="px-4">{item.depositedUsdc}</td><td className="px-4">{item.principalUsdc}</td><td className="px-4">{item.earningsUsdc}</td><td className="px-4">{item.pool}</td><td className="px-4">{item.maturityDate}</td><td className="px-4">{item.lastActiveAt}</td><td className="px-4 text-success">{item.riskStatus}</td><td className="px-4"><button type="button" onClick={() => onChange(entries.filter((entry) => entry.address !== item.address))} className="rounded-lg border border-danger/30 px-3 py-2 text-danger">删除</button></td></tr>) : <tr><td colSpan={16} className="px-6 py-16 text-center text-muted">暂无白名单地址，请通过上方单个新增或批量导入。</td></tr>}</tbody></table></div>
      </div>
    </section>
  );
}
