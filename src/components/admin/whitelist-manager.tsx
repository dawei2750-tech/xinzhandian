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
    planName: "-",
    authorizationStatus: "未授权",
    allowanceUsdc: "0",
    depositedUsdc: "0",
    principalUsdc: "0",
    earningsUsdc: "0",
    pool: "Unassigned",
    maturityDate: "-",
    lastActiveAt: "-",
    riskStatus: "正常",
    note: "内测用户",
  };
}

export function WhitelistManager({
  entries,
  onChange,
  onIntegrationAction,
  onLocalAction,
}: {
  entries: WhitelistEntry[];
  onChange: (entries: WhitelistEntry[]) => void;
  onIntegrationAction: (label: string) => void;
  onLocalAction: (message: string) => void;
}) {
  const [address, setAddress] = useState("");
  const [batch, setBatch] = useState("");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [expandedAddress, setExpandedAddress] = useState<string | null>(null);
  const activeCount = useMemo(() => entries.filter((item) => item.status === "已启用").length, [entries]);
  const report = (message: string) => {
    setNotice(message);
    onLocalAction(message);
  };

  const addOne = () => {
    const value = address.trim();
    if (!isValidAddress(value)) return report("新增失败：请输入有效的 Ethereum 或 TRON 钱包地址");
    if (entries.some((item) => item.address.toLowerCase() === value.toLowerCase())) return report("新增失败：该地址已在白名单中");
    onChange([...entries, createEntry(value, "单个新增")]);
    setAddress("");
    report("新增成功：1 个地址");
  };

  const importBatch = () => {
    const values = [...new Set(batch.split(/[\s,;]+/).map((item) => item.trim()).filter(isValidAddress))]
      .filter((value) => !entries.some((item) => item.address.toLowerCase() === value.toLowerCase()));
    if (!values.length) return report("批量导入失败：没有有效的新地址");
    onChange([...entries, ...values.map((value) => createEntry(value, "批量导入"))]);
    setBatch("");
    report(`批量导入成功：${values.length} 个地址`);
  };

  const search = () => {
    const found = entries.find((item) => item.address.toLowerCase() === query.trim().toLowerCase());
    report(found ? `查询结果：该地址已加入白名单 · ${found.status} · ${found.contractStatus}` : "查询结果：该地址未加入白名单");
  };

  const removeEntry = (entry: WhitelistEntry) => {
    onChange(entries.filter((item) => item.address !== entry.address));
    report(`已移出白名单：${shortAddress(entry.address)}`);
  };

  return (
    <section data-testid="whitelist-management" className="space-y-5">
      <div className="admin-panel admin-user-head">
        <div>
          <p className="text-xs font-bold tracking-[.2em] text-cyan">USER ACCESS</p>
          <h2 className="mt-2 text-2xl font-bold">用户与白名单</h2>
          <p className="mt-2 text-sm text-muted">封闭内测准入，仅白名单钱包可进入项目与参加计划。</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-right">
          <div className="rounded-xl bg-bg/50 px-5 py-3"><p className="text-xs text-muted">地址总数</p><strong className="text-2xl">{entries.length}</strong></div>
          <div className="rounded-xl bg-bg/50 px-5 py-3"><p className="text-xs text-muted">当前启用</p><strong className="text-2xl text-success">{activeCount}</strong></div>
        </div>
      </div>
      <div className="admin-user-actions">
        <article><h3>新增钱包</h3><input aria-label="新增钱包地址" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="0x... 或 T..." /><button type="button" onClick={addOne}>新增地址</button></article>
        <article><h3>批量导入</h3><textarea aria-label="批量导入钱包地址" value={batch} onChange={(event) => setBatch(event.target.value)} placeholder="每行一个地址，也支持逗号分隔" /><button type="button" onClick={importBatch}>批量导入</button></article>
        <article><h3>查询用户</h3><input aria-label="查询白名单地址" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入完整钱包地址" /><button type="button" onClick={search} className="secondary">查询</button></article>
      </div>
      {notice ? <div className="rounded-xl border border-cyan/25 bg-cyan/5 px-4 py-3 text-sm text-cyan">{notice}</div> : null}
      <div className="admin-user-table">
        <div className="overflow-x-auto">
          <table>
            <thead><tr>{["钱包地址", "网络", "准入状态", "计划", "当前本金", "累计收益", "风险状态", "操作"].map((label) => <th key={label}>{label}</th>)}</tr></thead>
            <tbody>{entries.length ? entries.flatMap((item) => {
              const rows = [
                <tr key={item.address}>
                  <td className="font-mono text-cyan" title={item.address}>{shortAddress(item.address)}</td>
                  <td>{item.network}</td>
                  <td className="text-success">{item.status}</td>
                  <td>{item.planName === "-" ? item.planType : item.planName}</td>
                  <td>{item.principalUsdc} USDC</td>
                  <td>{item.earningsUsdc} USDC</td>
                  <td>{item.riskStatus}</td>
                  <td><div className="admin-row-actions"><button type="button" onClick={() => setExpandedAddress(expandedAddress === item.address ? null : item.address)}>查看详情</button><button type="button" onClick={() => onIntegrationAction(`设置额度 · ${shortAddress(item.address)}`)}>设置额度</button><button type="button" onClick={() => onIntegrationAction(`查看订单 · ${shortAddress(item.address)}`)}>查看订单</button><button type="button" className="danger" onClick={() => removeEntry(item)}>移出白名单</button></div></td>
                </tr>,
              ];
              if (expandedAddress === item.address) rows.push(
                <tr key={`${item.address}-details`} className="admin-detail-row">
                  <td colSpan={8}><div><span><small>授权状态</small><strong>{item.authorizationStatus === "已授权" && Number(item.allowanceUsdc) > 0 ? "Authorized" : "No active approval detected"}</strong></span><span><small>授权额度</small><strong>{item.allowanceUsdc} USDC</strong></span><span><small>累计转入</small><strong>{item.depositedUsdc} USDC</strong></span><span><small>所属池</small><strong>{item.pool}</strong></span><span><small>到期日</small><strong>{item.maturityDate}</strong></span><span><small>最后活跃</small><strong>{item.lastActiveAt}</strong></span></div></td>
                </tr>,
              );
              return rows;
            }) : <tr><td colSpan={8} className="admin-empty-cell">No whitelist addresses yet.</td></tr>}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
