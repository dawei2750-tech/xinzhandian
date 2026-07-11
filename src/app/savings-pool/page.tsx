"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  savingsPlanParticipations,
  savingsPoolDepositConfig,
  savingsPoolPlans,
  savingsPoolPresentationConfig,
  type SavingsPlanParticipation,
  type SavingsPoolPlan,
} from "@/config/savings-pool-plans";
import { useLocale } from "@/i18n/locale-provider";
import type { Locale } from "@/i18n/locales";
import { Header } from "@/components/layout/header";
import { MarketTicker } from "@/components/layout/market-ticker";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

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
  tabs: ["Pool Data", "Plan", "Account", "Deposit"],
  planTabs: ["Interest", "Record"],
  accountTabs: ["Exchange", "Withdraw", "Record"],
  recordTabs: ["Exchange", "Withdraw", "Interest", "Rebate"],
  fromOptions: ["Account Balance", "Wallet Address"],
  poolData: [
    ["Total dividend data", "0", "ETH"],
    ["Participants", "0", ""],
    ["User earnings", "0", "USD"],
  ],
  accountData: [
    ["Total output", "0", "ETH"],
    ["Wallet balance", "0", "USDC"],
    ["Exchangeable", "0", "ETH"],
  ],
  labels: {
    brand: "blockchain Savings",
    voucher: "Receive voucher",
    smartContract: "Smart Contract",
    contractOrder: "Order",
    contractStatus: "Contract Status",
    contractTotal: "Contract total amount",
    contractCompleted: "Contract completed amount",
    contractEndDate: "Contract end date",
    contractExtraReward: "Contract extra reward",
    contractCurrentEarnings: "Contract current earnings",
    participant: "Participants",
    totalUsd: "Total amount USDC",
    rate: "Rate (ETH)",
    amountUsd: "Amount (USDC)",
    noRecord: "No content at the moment",
    treasury: "USDC",
    convertAll: "Convert all",
    exchange: "Exchange",
    exchangeAsset: "Exchange Asset",
    exchangeHelp: "Convert ETH commission rewards into USDC",
    withdrawalOnly: "Withdrawals are available in USDC only",
    totalBalance: "Total balance",
    confirm: "Confirm",
    cancel: "Cancel",
    withdrawNotice:
      "Your withdrawal will need to wait for 24 hours to arrive in your wallet. The minimum withdrawal amount is $1, and withdrawals cannot exceed 5 times a day.",
    time: "Time",
    quantity: "Amount",
    recordQuantity: "Quantity",
    status: "Status",
    from: "From",
    connectedWallet: "Connected wallet",
    walletNotConnected: "Connect wallet first",
    to: "To",
    all: "All",
    depositAsset: "Deposit Asset",
    deposit: "Deposit",
    depositRouting:
      "Funds go directly to an active smart contract. If no smart contract is active, funds are held temporarily until you choose a plan.",
    enterAmount: "Please enter amount",
    zeroUsd: "0 USDC",
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
    walletRetention:
      "Assets remain in your wallet. No transfer to the platform is required; you can withdraw or transfer anytime after meeting the minimum interest distribution time.",
    flexibleRule:
      "Interest accrues in real time and is distributed every 4 hours, 6 times per day. Same-day deposit and withdrawal can still earn interest after the minimum distribution time is met.",
    flexibleFormula: "Formula: 50000 * 1.1% / ETH price / 6",
    adminManaged:
      "Rates follow the smart contract rate table and can later be managed from the admin settings.",
  },
};

const zh: Copy = {
  ...en,
  tabs: ["池数据", "计划", "账户", "转入"],
  planTabs: ["利息", "记录"],
  accountTabs: ["交换", "提取", "记录"],
  recordTabs: ["交换", "提取", "利息", "返佣"],
  fromOptions: ["账户余额", "钱包地址"],
  poolData: [
    ["总分红数据", "0", "以太坊"],
    ["参与者", "0", ""],
    ["用户收入", "0", "美元"],
  ],
  accountData: [
    ["总产出", "0", "以太坊"],
    ["钱包余额", "0", "美元"],
    ["可兑换", "0", "以太坊"],
  ],
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
    withdrawNotice:
      "您的提款需要等待 24 小时才能到账，请注意，最低提款金额为 1 美元，且每日提款次数不得超过 5 次。",
    time: "时间",
    quantity: "数量",
    status: "状态",
    from: "从",
    connectedWallet: "转入钱包",
    walletNotConnected: "请先连接钱包",
    to: "到",
    all: "全部",
    transfer: "转移",
    depositAsset: "转入资产",
    deposit: "确认转入",
    depositRouting:
      "资金将直接进入当前参加的智能合约；如果尚未参加智能合约，资金会暂存在待分配池中，直到您选择计划。",
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
    walletRetention:
      "资产始终保留在用户钱包，不需要转入平台；满足最低利息分配时间后，资金可随时提取或转移。",
    flexibleRule:
      "利息按实时累计，每 4 小时分配一次，一天 6 次；当天存当天取，满足最低利息分配时间也给利息。",
    flexibleFormula: "计算公式：50000 * 1.1% / ETH 时价 / 6",
    adminManaged:
      "利率按照智能合约利率表展示，后续可由管理后台设置按钮统一配置。",
  },
};

const poolCopy: Record<Locale, Copy> = {
  en,
  "zh-CN": zh,
  "zh-TW": {
    ...zh,
    tabs: ["池資料", "計劃", "帳戶", "轉入"],
    labels: { ...zh.labels, language: "語言", myAccount: "我的帳戶" },
  },
  ja: {
    ...en,
    tabs: ["プールデータ", "プラン", "アカウント", "入金"],
    labels: { ...en.labels, language: "言語", myAccount: "マイアカウント" },
  },
  ko: {
    ...en,
    tabs: ["풀 데이터", "플랜", "계정", "입금"],
    labels: { ...en.labels, language: "언어", myAccount: "내 계정" },
  },
  th: {
    ...en,
    tabs: ["ข้อมูลพูล", "แผน", "บัญชี", "ฝาก"],
    labels: { ...en.labels, language: "ภาษา", myAccount: "บัญชีของฉัน" },
  },
};

function usePoolCopy() {
  const { locale } = useLocale();
  return { c: poolCopy[locale] };
}

function MainTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex-1 border px-2 py-2.5 text-xs font-semibold first:rounded-l-md last:rounded-r-md sm:text-sm ${
        active
          ? "border-accent bg-accent text-bg"
          : "border-line bg-surface text-muted"
      }`}
    >
      {label}
    </button>
  );
}

function InnerTabs({
  items,
  active,
  onChange,
}: {
  items: string[];
  active: number;
  onChange: (index: number) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-md border border-line bg-surface">
      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={active === index}
          onClick={() => onChange(index)}
          className={`flex-1 px-4 py-2 text-sm font-semibold ${
            active === index ? "bg-accent text-bg" : "text-muted"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function Cell({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-1 py-3 last:border-b-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-right text-sm font-semibold text-ink">
        {value}
        {unit ? (
          <>
            {" "}
            <span className="text-muted">{unit}</span>
          </>
        ) : null}
      </span>
    </div>
  );
}

function PageFooter() {
  const { c } = usePoolCopy();
  return (
    <footer className="space-y-3 pt-2 text-center">
      <p className="text-sm font-semibold text-muted">{c.labels.brand}</p>
      <button
        type="button"
        className="w-full rounded-md border border-line bg-surface px-4 py-3 text-sm font-semibold text-muted"
      >
        {c.labels.voucher}
      </button>
    </footer>
  );
}

function PoolDataPanel() {
  const { c } = usePoolCopy();
  return (
    <section className="space-y-4" data-testid="pool-data-panel">
      <h2 className="text-lg font-semibold">{c.tabs[0]}</h2>
      <div className="rounded-md border border-line bg-surface-soft px-4">
        {c.poolData.map(([label, value, unit]) => (
          <Cell key={label} label={label} value={value} unit={unit} />
        ))}
      </div>
    </section>
  );
}

function TierRulesTable({
  tiers,
  onOrder,
}: {
  tiers: SavingsPoolPlan[];
  onOrder: (tier: SavingsPoolPlan) => void;
}) {
  const { c } = usePoolCopy();
  return (
    <div className="space-y-5">
      {tiers.map((tier) => (
        <article
          key={tier.id}
          className="group overflow-hidden rounded-xl border border-violet/35 bg-surface-soft shadow-[0_16px_45px_rgba(36,20,92,0.32)]"
        >
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={tier.image}
              alt=""
              fill
              sizes="(max-width: 540px) 100vw, 508px"
              className="object-cover transition duration-500 group-hover:scale-[1.025]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-soft via-transparent to-black/10" />
            <div className="absolute left-4 top-4">
              <span className="rounded-lg border border-cyan/40 bg-black/55 px-4 py-2 text-base font-black tracking-[0.2em] text-white shadow-[0_0_22px_rgba(34,211,238,0.24)] backdrop-blur-md">
                {tier.name}
              </span>
            </div>
          </div>
          <div className="relative -mt-7 p-5 pt-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet">
              {savingsPoolPresentationConfig.fixedSavingsTitle}
            </p>
            <h3 className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-lg font-bold text-ink">
              <span>
                {tier.amountRange}{" "}
                <span className="text-sm text-muted">USDC</span>
              </span>
              <span className="text-lg font-black text-cyan drop-shadow-[0_0_10px_rgba(34,211,238,0.75)]">
                {tier.ethRate}
              </span>
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-line/70 bg-bg/35 p-3">
                <p className="text-xs text-muted">{c.labels.participant}</p>
                <p className="mt-1 font-semibold text-ink">
                  {tier.participants}
                </p>
              </div>
              <div className="rounded-lg border border-line/70 bg-bg/35 p-3">
                <p className="text-xs text-muted">{c.labels.totalUsd}</p>
                <p className="mt-1 break-all font-semibold text-ink">
                  {tier.totalUsdc}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOrder(tier)}
              className="mt-4 w-full rounded-lg border border-cyan/50 bg-gradient-to-r from-cyan via-accent to-violet px-4 py-3.5 text-sm font-extrabold tracking-wide text-bg shadow-[0_0_26px_rgba(61,214,255,0.35)] transition hover:brightness-110 active:scale-[0.99]"
            >
              {c.labels.smartContract}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function PlanPanel() {
  const [tab, setTab] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<SavingsPoolPlan | null>(
    null
  );
  const { c } = usePoolCopy();
  const enabledPlans = savingsPoolPlans
    .filter((plan) => plan.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const participation = selectedPlan
    ? savingsPlanParticipations.find((item) => item.planId === selectedPlan.id)
    : null;
  return (
    <section className="space-y-4" data-testid="contract-plan-panel">
      <InnerTabs items={c.planTabs} active={tab} onChange={setTab} />
      {tab === 0 ? (
        <TierRulesTable tiers={enabledPlans} onOrder={setSelectedPlan} />
      ) : (
        <EmptyState />
      )}
      {selectedPlan && participation ? (
        <ContractStatusModal
          plan={selectedPlan}
          participation={participation}
          onClose={() => setSelectedPlan(null)}
        />
      ) : null}
      {selectedPlan && !participation ? (
        <OrderModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      ) : null}
    </section>
  );
}

function ContractStatusModal({
  plan,
  participation,
  onClose,
}: {
  plan: SavingsPoolPlan;
  participation: SavingsPlanParticipation;
  onClose: () => void;
}) {
  const { c } = usePoolCopy();
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-label={c.labels.contractStatus}
        className="w-full max-w-md overflow-hidden rounded-xl border border-cyan/60 bg-gradient-to-b from-[#10213b] to-surface shadow-[0_0_60px_rgba(34,211,238,0.3)]"
      >
        <header className="relative flex min-h-40 items-end justify-between overflow-hidden border-b border-cyan/30 px-5 py-5">
          <Image src={plan.image} alt="" fill sizes="448px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10213b] via-[#10213b]/45 to-black/10" />
          <div className="relative">
            <p className="text-base font-black tracking-[0.2em] text-cyan drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]">
              {plan.name}
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              {c.labels.contractStatus}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close contract status"
            onClick={onClose}
            className="relative grid size-10 place-items-center rounded-full border border-white/30 bg-black/40 text-xl text-white backdrop-blur-md"
          >
            ×
          </button>
        </header>
        <div className="p-5">
          <div className="overflow-hidden rounded-lg border border-cyan/25 bg-bg/45 px-4 shadow-[inset_0_0_24px_rgba(34,211,238,0.05)]">
            <Cell
              label={c.labels.contractTotal}
              value={participation.contractTotalUsdc}
              unit="USDC"
            />
            <Cell
              label={c.labels.contractCompleted}
              value={participation.completedUsdc}
              unit="USDC"
            />
            <Cell
              label={c.labels.contractEndDate}
              value={participation.endDate}
            />
            <Cell
              label={c.labels.contractExtraReward}
              value={participation.extraRewardEth}
              unit="ETH"
            />
            <Cell
              label={c.labels.contractCurrentEarnings}
              value={participation.currentEarningsEth}
              unit="ETH"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function OrderModal({
  plan,
  onClose,
}: {
  plan: SavingsPoolPlan;
  onClose: () => void;
}) {
  const { c } = usePoolCopy();
  const [amount, setAmount] = useState("");
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-label={c.labels.contractOrder}
        className="w-full max-w-md overflow-hidden rounded-xl border border-cyan/60 bg-gradient-to-b from-[#10213b] to-surface shadow-[0_0_60px_rgba(34,211,238,0.3)]"
      >
        <header className="relative flex min-h-44 items-end justify-between overflow-hidden border-b border-cyan/30 px-5 py-5">
          <Image src={plan.image} alt="" fill sizes="448px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10213b] via-[#10213b]/40 to-black/10" />
          <div className="relative">
            <p className="text-base font-black tracking-[0.2em] text-white drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]">
              {plan.name}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">
              {c.labels.contractOrder}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close order"
            onClick={onClose}
            className="relative grid size-10 place-items-center rounded-full border border-white/30 bg-black/40 text-xl text-white backdrop-blur-md"
          >
            ×
          </button>
        </header>
        <div className="space-y-4 p-5">
          <div className="overflow-hidden rounded-lg border border-cyan/25 bg-bg/45 px-4 shadow-[inset_0_0_24px_rgba(34,211,238,0.05)]">
            <Cell label={c.labels.participant} value={plan.participants} />
            <Cell label={c.labels.totalUsd} value={plan.totalUsdc} />
            <Cell
              label={c.labels.amountRequirement}
              value={plan.amountRange}
              unit="USDC"
            />
            <Cell label={c.labels.rate} value={plan.ethRate} />
          </div>
          <label className="block text-sm text-muted">
            <span className="flex items-center justify-between">
              <span>{c.labels.amountUsd.replace(" (USDC)", "")}</span>
              <span>{c.labels.availableZero}</span>
            </span>
            <span className="mt-2 flex overflow-hidden rounded-lg border border-cyan/35 bg-bg shadow-[0_0_18px_rgba(34,211,238,0.08)]">
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                inputMode="decimal"
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-ink outline-none"
                placeholder={`Not less than ${plan.minimumUsdc} USDC`}
              />
              <button
                type="button"
                className="border-l border-line px-4 text-sm font-semibold text-accent"
              >
                {c.labels.all}
              </button>
            </span>
          </label>
          <button
            type="button"
            className="w-full rounded-lg border border-cyan/50 bg-gradient-to-r from-cyan via-accent to-violet px-4 py-3.5 text-sm font-extrabold text-bg shadow-[0_0_28px_rgba(61,214,255,0.38)] transition hover:brightness-110"
          >
            {c.labels.confirm}
          </button>
        </div>
      </section>
    </div>
  );
}

function AccountPanel() {
  const [tab, setTab] = useState(0);
  const { c } = usePoolCopy();
  return (
    <section className="space-y-4" data-testid="contract-account-panel">
      <h2 className="text-lg font-semibold">{c.labels.myAccount}</h2>
      <div className="rounded-md border border-line bg-surface-soft px-4">
        {c.accountData.map(([label, value, unit]) => (
          <Cell key={label} label={label} value={value} unit={unit} />
        ))}
      </div>
      <InnerTabs items={c.accountTabs} active={tab} onChange={setTab} />
      {tab === 0 ? <ExchangePanel /> : null}
      {tab === 1 ? <WithdrawPanel /> : null}
      {tab === 2 ? <RecordPanel /> : null}
    </section>
  );
}

function ExchangePanel() {
  const { c } = usePoolCopy();
  return (
    <div className="space-y-3 rounded-md border border-line bg-surface-soft p-4">
      <label className="block text-sm text-muted">
        {c.labels.exchangeAsset}
        <select
          aria-label={c.labels.exchangeAsset}
          className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-3 text-ink"
        >
          <option>ETH</option>
        </select>
      </label>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">{c.labels.treasury}</span>
        <button type="button" className="text-accent">
          {c.labels.convertAll}
        </button>
      </div>
      <label className="block text-sm text-muted">
        {c.labels.exchange}
        <input
          className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-3 text-ink outline-none"
          placeholder="0.0"
        />
      </label>
      <p className="text-sm text-muted">{c.labels.exchangeHelp}</p>
      <button
        type="button"
        className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-bg"
      >
        {c.labels.exchange}
      </button>
    </div>
  );
}

function WithdrawPanel() {
  const { c } = usePoolCopy();
  return (
    <div className="space-y-3 rounded-md border border-line bg-surface-soft p-4">
      <div className="font-semibold">{c.labels.treasury}</div>
      <p className="text-sm font-medium text-warning">
        {c.labels.withdrawalOnly}
      </p>
      <label className="block text-sm text-muted">
        {c.labels.totalBalance}
        <input
          className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-3 text-ink outline-none"
          placeholder="0.0"
        />
      </label>
      <button
        type="button"
        className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-bg"
      >
        {c.labels.confirm}
      </button>
      <p className="text-sm leading-6 text-muted">{c.labels.withdrawNotice}</p>
    </div>
  );
}

function RecordPanel() {
  const [tab, setTab] = useState(0);
  const { c } = usePoolCopy();
  return (
    <div className="space-y-3" data-testid="account-record-panel">
      <InnerTabs items={c.recordTabs} active={tab} onChange={setTab} />
      <div className="rounded-md border border-line bg-surface-soft">
        <div className="grid grid-cols-3 border-b border-line px-4 py-3 text-sm font-semibold text-muted">
          <span>{c.labels.time}</span>
          <span>{c.labels.recordQuantity}</span>
          <span>{c.labels.status}</span>
        </div>
        <div className="px-4 py-8 text-center text-sm text-muted">
          {c.labels.noRecord}
        </div>
      </div>
    </div>
  );
}

function DepositPanel() {
  const { c } = usePoolCopy();
  const [fromOpen, setFromOpen] = useState(false);
  const [fromValue, setFromValue] = useState(c.fromOptions[0]);
  const [draftValue, setDraftValue] = useState(c.fromOptions[0]);
  const [asset, setAsset] = useState(savingsPoolDepositConfig.assets[0].label);
  const activePlan = savingsPoolPlans.find(
    (plan) => plan.id === savingsPoolDepositConfig.activePlanId
  );
  const destination = activePlan
    ? `${activePlan.name} Smart Contract`
    : savingsPoolDepositConfig.temporaryPoolLabel;
  return (
    <section className="space-y-4" data-testid="contract-deposit-panel">
      <div className="rounded-lg border border-line bg-surface-soft p-4">
        <div className="block text-sm text-muted">
          {c.labels.from}
          <div className="mt-2 rounded-md border border-cyan/25 bg-bg px-3 py-3">
            <p className="font-semibold text-ink">{c.labels.connectedWallet}</p>
            <p className="mt-1 text-xs text-muted">{c.labels.walletNotConnected}</p>
          </div>
        </div>
        <label className="mt-4 block text-sm text-muted">
          {c.labels.depositAsset}
          <select
            aria-label={c.labels.depositAsset}
            value={asset}
            onChange={(event) => setAsset(event.target.value)}
            className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-3 text-ink"
          >
            {savingsPoolDepositConfig.assets.map((item) => (
              <option key={item.id}>{item.label}</option>
            ))}
          </select>
        </label>
        <label htmlFor="deposit-to" className="mt-4 block text-sm text-muted">
          {c.labels.to}
          <input
            id="deposit-to"
            aria-label={c.labels.to}
            value={destination}
            readOnly
            className="mt-2 w-full rounded-md border border-line bg-bg px-3 py-3 text-muted"
          />
        </label>
        <label
          htmlFor="deposit-amount"
          className="mt-4 block text-sm text-muted"
        >
          {c.labels.quantity}
          <span className="mt-2 flex overflow-hidden rounded-md border border-line bg-surface">
            <input
              id="deposit-amount"
              inputMode="decimal"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-ink outline-none"
              placeholder={c.labels.enterAmount}
            />
            <button
              type="button"
              className="border-l border-line px-4 text-sm font-semibold text-accent"
            >
              {c.labels.all}
            </button>
          </span>
        </label>
        <p className="mt-3 text-sm text-muted">0 {asset}</p>
      </div>
      <p className="rounded-md border border-accent/20 bg-accent/5 p-3 text-sm leading-6 text-muted">
        {c.labels.depositRouting}
      </p>
      <button
        type="button"
        className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-bg"
      >
        {c.labels.deposit}
      </button>
    </section>
  );
  return (
    <section className="space-y-4" data-testid="contract-transfer-panel">
      <div className="rounded-lg border border-line bg-surface-soft p-4">
        <label className="block text-sm text-muted">
          {c.labels.from}
          <button
            type="button"
            aria-label={`${c.labels.from}: ${fromValue}`}
            onClick={() => {
              setDraftValue(fromValue);
              setFromOpen(true);
            }}
            className="mt-2 flex w-full items-center justify-between rounded-md border border-line bg-surface px-3 py-3 text-left text-ink"
          >
            <span>{fromValue}</span>
            <span className="text-muted">⌄</span>
          </button>
        </label>
        <label htmlFor="transfer-to" className="mt-4 block text-sm text-muted">
          {c.labels.to}
          <input
            id="transfer-to"
            className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-3 text-ink outline-none"
          />
        </label>
        <label
          htmlFor="transfer-amount"
          className="mt-4 block text-sm text-muted"
        >
          {c.labels.quantity}
          <span className="mt-2 flex overflow-hidden rounded-md border border-line bg-surface">
            <input
              id="transfer-amount"
              inputMode="decimal"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-ink outline-none"
              placeholder={c.labels.enterAmount}
            />
            <button
              type="button"
              className="border-l border-line px-4 text-sm font-semibold text-accent"
            >
              {c.labels.all}
            </button>
          </span>
        </label>
        <p className="mt-3 text-sm text-muted">{c.labels.zeroUsd}</p>
      </div>
      <button
        type="button"
        className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-bg"
      >
        {c.labels.transfer}
      </button>
      {fromOpen ? (
        <PickerModal
          title={c.labels.from}
          value={draftValue}
          options={c.fromOptions}
          onChange={setDraftValue}
          onCancel={() => setFromOpen(false)}
          onConfirm={() => {
            setFromValue(draftValue);
            setFromOpen(false);
          }}
        />
      ) : null}
    </section>
  );
}

function PickerModal({
  title,
  value,
  options,
  onChange,
  onCancel,
  onConfirm,
}: {
  title: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { c } = usePoolCopy();
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/65">
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full rounded-t-lg border border-line bg-surface p-4 shadow-glow sm:mx-auto sm:mb-6 sm:max-w-md sm:rounded-lg"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 text-sm font-semibold text-muted"
          >
            {c.labels.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-3 py-2 text-sm font-semibold text-accent"
          >
            {c.labels.confirm}
          </button>
        </div>
        <div className="mt-3 overflow-hidden rounded-md border border-line">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`block w-full border-b border-line px-4 py-4 text-center text-sm font-semibold last:border-b-0 ${
                value === option ? "bg-surface-soft text-accent" : "text-ink"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function EmptyState() {
  const { c } = usePoolCopy();
  return (
    <div className="rounded-md border border-line bg-surface-soft px-4 py-8 text-center text-sm text-muted">
      {c.labels.noRecord}
    </div>
  );
}

export default function SavingsPoolPage() {
  const { c } = usePoolCopy();
  const [mainTab, setMainTab] = useState(0);
  return (
    <div className="page-grid min-h-screen bg-bg pb-mobile-nav text-ink lg:pb-0">
      <Header />
      <MarketTicker />
      <main className="relative z-10 px-4 py-5">
        <div className="mx-auto w-full max-w-[540px] space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent"
            aria-label="Back to Home"
          >
            ← <span>Back to Home</span>
          </Link>
          <section
            className="rounded-lg border border-line bg-surface p-4 shadow-glow"
            data-testid="smart-contract-pool"
          >
            <div
              role="tablist"
              aria-label={c.labels.smartContract}
              className="flex"
            >
              {c.tabs.map((tab, index) => (
                <MainTab
                  key={tab}
                  label={tab}
                  active={mainTab === index}
                  onClick={() => setMainTab(index)}
                />
              ))}
            </div>
            <div className="mt-4">
              {mainTab === 0 ? <PoolDataPanel /> : null}
              {mainTab === 1 ? <PlanPanel /> : null}
              {mainTab === 2 ? <AccountPanel /> : null}
              {mainTab === 3 ? <DepositPanel /> : null}
            </div>
          </section>
          <PageFooter />
        </div>
      </main>
      <div className="lg:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}
