"use client";

import { useState } from "react";
import { fixedSavingsRates } from "@/constants/finance";
import { useLocale } from "@/i18n/locale-provider";
import type { Locale } from "@/i18n/locales";

type SmartTier = { participants: string; totalUsd: string; amount: string; rate: string };

const smartContractTiers: SmartTier[] = fixedSavingsRates.map((rate, index) => ({
  amount: rate.amount,
  rate: rate.dailyRate,
  participants: ["272668", "251026", "143500", "77696", "84181", "78528", "75276", "75176", "68120"][index] ?? "0",
  totalUsd: ["1369481805", "2388085350", "5228852706", "13005640244", "8333539520", "10374180001", "25781598010", "3780348117", "3000000000"][index] ?? "0",
}));

type Copy = {
  tabs: string[];
  planTabs: string[];
  accountTabs: string[];
  recordTabs: string[];
  fromOptions: string[];
  poolData: string[][];
  accountData: string[][];
  labels: Record<string, string>;
};

const en: Copy = {
  tabs: ["Pool Data", "Plan", "Account", "Transfer"],
  planTabs: ["Interest", "Record"],
  accountTabs: ["Exchange", "Withdraw", "Record"],
  recordTabs: ["Exchange", "Withdraw", "Interest", "Rebate"],
  fromOptions: ["Account Balance", "Wallet Address"],
  poolData: [["Total dividend data", "0", "ETH"], ["Participants", "0", ""], ["User earnings", "0", "USD"]],
  accountData: [["Total Output", "0", "ETH"], ["Wallet Balance", "0", "USD"], ["Convertible", "0", "ETH"]],
  labels: {
    brand: "blockchain Savings",
    voucher: "Receive voucher",
    smartContract: "Smart Contract",
    contractOrder: "Smart Contract Order",
    participant: "Participants",
    totalUsd: "Total Amount (USD)",
    rate: "Rate",
    amountUsd: "Amount (USD)",
    noRecord: "No content yet",
    treasury: "U.S. Treasury",
    convertAll: "Convert All",
    exchange: "Exchange",
    exchangeHelp: "Convert Ethereum (ETH) to USDC",
    totalBalance: "Total Balance",
    confirm: "Confirm",
    cancel: "Cancel",
    withdrawNotice: "Your withdrawal requires 24 hours to arrive. The minimum withdrawal amount is 1 USD, and withdrawals are limited to 5 times per day.",
    time: "Time",
    quantity: "Quantity",
    status: "Status",
    from: "From",
    to: "To",
    all: "All",
    transfer: "Transfer",
    enterAmount: "Enter amount",
    zeroUsd: "0 USD",
    amountRequirement: "Amount Requirement",
    availableZero: "Available: 0",
    usdc: "USDC",
    language: "Language",
    myAccount: "My Account",
    yieldStats: "Yield Stats",
    totalYieldCap: "Total yield cap",
    paidEth: "Paid ETH",
    paidUsdcValue: "Paid USDC value",
    remainingRewards: "Remaining rewards",
    currentParticipants: "Current participants",
    autoMatchedTier: "Auto matched tier",
    walletRetention: "Assets remain in your wallet. No transfer to the platform is required; you can withdraw or transfer anytime after meeting the minimum interest distribution time.",
    flexibleRule: "Interest accrues in real time and is distributed every 4 hours, 6 times per day. Same-day deposit and withdrawal can still earn interest after the minimum distribution time is met.",
    flexibleFormula: "Formula: 50000 * 1.1% / ETH price / 6",
    adminManaged: "Rates follow the smart contract rate table and can later be managed from the admin settings.",
  },
};

const zh: Copy = {
  ...en,
  tabs: ["池数据", "计划", "账户", "转移"],
  planTabs: ["利息", "记录"],
  accountTabs: ["交换", "提取", "记录"],
  recordTabs: ["交换", "提取", "利息", "返佣"],
  fromOptions: ["账户余额", "钱包地址"],
  poolData: [["总分红数据", "0", "以太坊"], ["参与者", "0", ""], ["用户收入", "0", "美元"]],
  accountData: [["总产出", "0", "以太坊"], ["钱包余额", "0", "美元"], ["可兑换", "0", "以太坊"]],
  labels: {
    ...en.labels,
    smartContract: "智能合约",
    contractOrder: "智能合约订单",
    participant: "参与者",
    totalUsd: "总金额（美元）",
    rate: "利率",
    amountUsd: "金额（美元）",
    noRecord: "目前暂无内容",
    treasury: "美国财政部",
    convertAll: "全部转换",
    exchange: "交换",
    exchangeHelp: "将以太坊 (ETH) 兑换成 USDC",
    totalBalance: "总余额",
    confirm: "确认",
    cancel: "取消",
    withdrawNotice: "您的提款需要等待 24 小时才能到账，请注意，最低提款金额为 1 美元，且每日提款次数不得超过 5 次。",
    time: "时间",
    quantity: "数量",
    status: "状态",
    from: "从",
    to: "到",
    all: "全部",
    transfer: "转移",
    enterAmount: "请输入金额",
    zeroUsd: "0 美元",
    amountRequirement: "金额要求",
    availableZero: "可用：0",
    language: "语言",
    myAccount: "我的账户",
    yieldStats: "收益统计",
    totalYieldCap: "总收益上限",
    paidEth: "已发放ETH数量",
    paidUsdcValue: "已发放USDC价值",
    remainingRewards: "剩余可发放数量",
    currentParticipants: "当前参与人数",
    autoMatchedTier: "自动匹配档位",
    walletRetention: "资产始终保留在用户钱包，不需要转入平台；满足最低利息分配时间后，资金可随时提取或转移。",
    flexibleRule: "利息按实时累计，每 4 小时分配一次，一天 6 次；当天存当天取，满足最低利息分配时间也给利息。",
    flexibleFormula: "计算公式：50000 * 1.1% / ETH 时价 / 6",
    adminManaged: "利率按照智能合约利率表展示，后续可由管理后台设置按钮统一配置。",
  },
};

const poolCopy: Record<Locale, Copy> = {
  en,
  "zh-CN": zh,
  "zh-TW": { ...zh, tabs: ["池資料", "計劃", "帳戶", "轉移"], labels: { ...zh.labels, language: "語言", myAccount: "我的帳戶" } },
  ja: { ...en, tabs: ["プールデータ", "プラン", "アカウント", "転送"], labels: { ...en.labels, language: "言語", myAccount: "マイアカウント" } },
  ko: { ...en, tabs: ["풀 데이터", "플랜", "계정", "이체"], labels: { ...en.labels, language: "언어", myAccount: "내 계정" } },
  th: { ...en, tabs: ["ข้อมูลพูล", "แผน", "บัญชี", "โอน"], labels: { ...en.labels, language: "ภาษา", myAccount: "บัญชีของฉัน" } },
};

function usePoolCopy() {
  const { locale } = useLocale();
  return { c: poolCopy[locale] };
}

function MainTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`flex-1 border px-2 py-2.5 text-xs font-semibold first:rounded-l-md last:rounded-r-md sm:text-sm ${active ? "border-accent bg-accent text-bg" : "border-line bg-surface text-muted"}`}>{label}</button>;
}

function InnerTabs({ items, active, onChange }: { items: string[]; active: number; onChange: (index: number) => void }) {
  return <div className="flex overflow-hidden rounded-md border border-line bg-surface">{items.map((item, index) => <button key={item} type="button" role="tab" aria-selected={active === index} onClick={() => onChange(index)} className={`flex-1 px-4 py-2 text-sm font-semibold ${active === index ? "bg-accent text-bg" : "text-muted"}`}>{item}</button>)}</div>;
}

function Cell({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return <div className="flex items-center justify-between gap-4 border-b border-line px-1 py-3 last:border-b-0"><span className="text-sm text-muted">{label}</span><span className="text-right text-sm font-semibold text-ink">{value}{unit ? <span className="ml-1 text-muted">{unit}</span> : null}</span></div>;
}

function PageFooter() {
  const { c } = usePoolCopy();
  return <footer className="space-y-3 pt-2 text-center"><p className="text-sm font-semibold text-muted">{c.labels.brand}</p><button type="button" className="w-full rounded-md border border-line bg-surface px-4 py-3 text-sm font-semibold text-muted">{c.labels.voucher}</button></footer>;
}

function PoolDataPanel() {
  const { c } = usePoolCopy();
  return <section className="space-y-4" data-testid="pool-data-panel"><h2 className="text-lg font-semibold">{c.tabs[0]}</h2><div className="rounded-md border border-line bg-surface-soft px-4">{c.poolData.map(([label, value, unit]) => <Cell key={label} label={label} value={value} unit={unit} />)}</div></section>;
}

function TierRulesTable({ tiers }: { tiers: SmartTier[] }) {
  const { c } = usePoolCopy();
  return <div className="space-y-2">{tiers.map((tier) => <article key={tier.amount} className="rounded-md border border-line bg-surface-soft p-4"><div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm"><div><p className="text-muted">{c.labels.participant}</p><p className="mt-1 font-semibold">{tier.participants}</p></div><div><p className="text-muted">{c.labels.totalUsd}</p><p className="mt-1 font-semibold">{tier.totalUsd}</p></div><div><p className="text-muted">{c.labels.rate}</p><p className="mt-1 font-semibold text-accent">{tier.rate}</p></div><div><p className="text-muted">{c.labels.amountUsd}</p><p className="mt-1 font-semibold">{tier.amount}</p></div></div></article>)}</div>;
}

function PlanPanel() {
  const [tab, setTab] = useState(0);
  const { c } = usePoolCopy();
  return <section className="space-y-4" data-testid="contract-plan-panel"><InnerTabs items={c.planTabs} active={tab} onChange={setTab} />{tab === 0 ? <div className="space-y-4"><div className="rounded-md border border-accent/40 bg-surface-soft p-4"><p className="text-sm leading-6 text-muted">{c.labels.adminManaged}</p><button type="button" className="mt-4 w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-bg">{c.labels.smartContract}</button></div><h3 className="text-sm font-semibold text-muted">{c.labels.smartContract}</h3><TierRulesTable tiers={smartContractTiers} /></div> : <EmptyState />}</section>;
}

function AccountPanel() {
  const [tab, setTab] = useState(0);
  const { c } = usePoolCopy();
  return <section className="space-y-4" data-testid="contract-account-panel"><h2 className="text-lg font-semibold">{c.labels.myAccount}</h2><div className="rounded-md border border-line bg-surface-soft px-4">{c.accountData.map(([label, value, unit]) => <Cell key={label} label={label} value={value} unit={unit} />)}</div><InnerTabs items={c.accountTabs} active={tab} onChange={setTab} />{tab === 0 ? <ExchangePanel /> : null}{tab === 1 ? <WithdrawPanel /> : null}{tab === 2 ? <RecordPanel /> : null}</section>;
}

function ExchangePanel() {
  const { c } = usePoolCopy();
  return <div className="space-y-3 rounded-md border border-line bg-surface-soft p-4"><div className="flex items-center justify-between text-sm"><span className="font-semibold">{c.labels.treasury}</span><button type="button" className="text-accent">{c.labels.convertAll}</button></div><label className="block text-sm text-muted">{c.labels.exchange}<input className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-3 text-ink outline-none" placeholder="0.0" /></label><p className="text-sm text-muted">{c.labels.exchangeHelp}</p><button type="button" className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-bg">{c.labels.exchange}</button></div>;
}

function WithdrawPanel() {
  const { c } = usePoolCopy();
  return <div className="space-y-3 rounded-md border border-line bg-surface-soft p-4"><div className="font-semibold">{c.labels.treasury}</div><label className="block text-sm text-muted">{c.labels.totalBalance}<input className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-3 text-ink outline-none" placeholder="0.0" /></label><button type="button" className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-bg">{c.labels.confirm}</button><p className="text-sm leading-6 text-muted">{c.labels.withdrawNotice}</p></div>;
}

function RecordPanel() {
  const [tab, setTab] = useState(0);
  const { c } = usePoolCopy();
  return <div className="space-y-3"><InnerTabs items={c.recordTabs} active={tab} onChange={setTab} /><div className="rounded-md border border-line bg-surface-soft"><div className="grid grid-cols-3 border-b border-line px-4 py-3 text-sm font-semibold text-muted"><span>{c.labels.time}</span><span>{c.labels.quantity}</span><span>{c.labels.status}</span></div><div className="px-4 py-8 text-center text-sm text-muted">{c.labels.noRecord}</div></div></div>;
}

function TransferPanel() {
  const { c } = usePoolCopy();
  const [fromOpen, setFromOpen] = useState(false);
  const [fromValue, setFromValue] = useState(c.fromOptions[0]);
  const [draftValue, setDraftValue] = useState(c.fromOptions[0]);
  return <section className="space-y-4" data-testid="contract-transfer-panel"><label className="block text-sm text-muted">{c.labels.from}<button type="button" onClick={() => { setDraftValue(fromValue); setFromOpen(true); }} className="mt-2 flex w-full items-center justify-between rounded-md border border-line bg-surface px-3 py-3 text-left text-ink"><span>{fromValue}</span><span className="text-muted">v</span></button></label><label className="block text-sm text-muted">{c.labels.to}<input className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-3 text-ink outline-none" /></label><label className="block text-sm text-muted">{c.labels.quantity}<div className="mt-2 flex overflow-hidden rounded-md border border-line bg-surface"><input className="w-full bg-transparent px-3 py-3 text-ink outline-none" placeholder={c.labels.enterAmount} /><button type="button" className="border-l border-line px-4 text-sm font-semibold text-accent">{c.labels.all}</button></div></label><p className="text-sm text-muted">{c.labels.zeroUsd}</p><button type="button" className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-bg">{c.labels.transfer}</button>{fromOpen ? <PickerModal title={c.labels.from} value={draftValue} options={c.fromOptions} onChange={setDraftValue} onCancel={() => setFromOpen(false)} onConfirm={() => { setFromValue(draftValue); setFromOpen(false); }} /> : null}</section>;
}

function PickerModal({ title, value, options, onChange, onCancel, onConfirm }: { title: string; value: string; options: string[]; onChange: (value: string) => void; onCancel: () => void; onConfirm: () => void }) {
  const { c } = usePoolCopy();
  return <div className="fixed inset-0 z-50 grid place-items-end bg-black/65"><section role="dialog" aria-modal="true" aria-label={title} className="w-full rounded-t-lg border border-line bg-surface p-4 shadow-glow sm:mx-auto sm:mb-6 sm:max-w-md sm:rounded-lg"><div className="flex items-center justify-between"><button type="button" onClick={onCancel} className="px-3 py-2 text-sm font-semibold text-muted">{c.labels.cancel}</button><button type="button" onClick={onConfirm} className="px-3 py-2 text-sm font-semibold text-accent">{c.labels.confirm}</button></div><div className="mt-3 overflow-hidden rounded-md border border-line">{options.map((option) => <button key={option} type="button" onClick={() => onChange(option)} className={`block w-full border-b border-line px-4 py-4 text-center text-sm font-semibold last:border-b-0 ${value === option ? "bg-surface-soft text-accent" : "text-ink"}`}>{option}</button>)}</div></section></div>;
}

function EmptyState() {
  const { c } = usePoolCopy();
  return <div className="rounded-md border border-line bg-surface-soft px-4 py-8 text-center text-sm text-muted">{c.labels.noRecord}</div>;
}

export default function SavingsPoolPage() {
  const { c } = usePoolCopy();
  const [mainTab, setMainTab] = useState(0);
  return <main className="min-h-screen bg-bg px-4 py-5 text-ink"><div className="mx-auto w-full max-w-[430px] space-y-4"><section className="rounded-lg border border-line bg-surface p-4 shadow-glow" data-testid="smart-contract-pool"><div role="tablist" aria-label={c.labels.smartContract} className="flex">{c.tabs.map((tab, index) => <MainTab key={tab} label={tab} active={mainTab === index} onClick={() => setMainTab(index)} />)}</div><div className="mt-4">{mainTab === 0 ? <PoolDataPanel /> : null}{mainTab === 1 ? <PlanPanel /> : null}{mainTab === 2 ? <AccountPanel /> : null}{mainTab === 3 ? <TransferPanel /> : null}</div></section><PageFooter /></div></main>;
}
