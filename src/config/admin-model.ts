import { savingsPoolPlans, savingsPlanParticipations } from "@/config/savings-pool-plans";

export type AdminPlan = (typeof savingsPoolPlans)[number];
export type WhitelistEntry = {
  address: string;
  network: "Ethereum" | "TRON";
  status: "已启用" | "已暂停";
  joinedAt: string;
  source: "单个新增" | "批量导入";
  connected: boolean;
  contractStatus: "未参加" | "已参加" | "已退出";
  planType: "未选择" | "灵活" | "定期";
  planName: string;
  authorizationStatus: "未授权" | "已授权" | "已取消";
  allowanceUsdc: string;
  depositedUsdc: string;
  principalUsdc: string;
  earningsUsdc: string;
  pool: string;
  maturityDate: string;
  lastActiveAt: string;
  riskStatus: "正常" | "观察" | "已暂停";
  note: string;
};
export type AdminConfig = {
  plans: AdminPlan[];
  flexibleRules: { minimumUsdc: string; distributionHours: string; distributionsPerDay: string; interestCapUsdc: string };
  participationRules: { minimumDepositUsdc: string; perOrderMaximumEnabled: false; perUserMaximumEnabled: false; allowMultipleOrders: boolean };
  fixedYieldCapRules: { termMode: "limited" | "unlimited"; maximumTermDays: string };
  fixedRules: { status: "pending" | "adopted" | "deferred"; items: string[] };
  deposit: { assets: string[]; fallbackPool: string; activePlanRouting: boolean };
  withdrawal: { asset: string; minimumUsdc: string; dailyLimit: string; arrivalHours: string };
  pools: { flexiblePool: string; temporaryPool: string; rewardPool: string; vipSubPools: string; paused: boolean };
  commission: { ethEnabled: true; trxEnabled: boolean };
  authorization: { assets: string[]; defaultUsdc: string; confirmedUsdc: string; minimumUsdc: string; cancellationExitsPlan: boolean; spenderStatus: string; emergencyPause: boolean };
  vip7Demo: (typeof savingsPlanParticipations)[number];
  whitelist: WhitelistEntry[];
};

export const initialAdminConfig: AdminConfig = {
  plans: savingsPoolPlans,
  flexibleRules: { minimumUsdc: "1000", distributionHours: "4", distributionsPerDay: "6", interestCapUsdc: "1000" },
  participationRules: { minimumDepositUsdc: "1000", perOrderMaximumEnabled: false, perUserMaximumEnabled: false, allowMultipleOrders: true },
  fixedYieldCapRules: { termMode: "limited", maximumTermDays: "180" },
  fixedRules: { status: "pending", items: ["到期前不允许退出", "到期后奖励不销毁，暂无逾期惩罚"] },
  deposit: { assets: ["Ethereum · USDC", "Ethereum · USDT", "Ethereum · PYUSD", "TRON · USDT"], fallbackPool: "Temporary Holding Pool", activePlanRouting: true },
  withdrawal: { asset: "USDC", minimumUsdc: "1", dailyLimit: "5", arrivalHours: "24" },
  pools: { flexiblePool: "Flexible Savings Pool", temporaryPool: "Temporary Holding Pool", rewardPool: "Emergency ETH Commission Reserve", vipSubPools: "7", paused: false },
  commission: { ethEnabled: true, trxEnabled: false },
  authorization: { assets: ["Ethereum · USDC", "Ethereum · USDT", "Ethereum · PYUSD", "TRON · USDT"], defaultUsdc: "", confirmedUsdc: "", minimumUsdc: "1000", cancellationExitsPlan: true, spenderStatus: "待合约确认", emergencyPause: false },
  vip7Demo: savingsPlanParticipations[0],
  whitelist: [],
};
