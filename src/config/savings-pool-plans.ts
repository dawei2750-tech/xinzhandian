export type SavingsPoolPlan = {
  id: string;
  name: string;
  participants: string;
  totalUsdc: string;
  amountRange: string;
  minimumUsdc: string;
  ethRate: string;
  image: string;
  enabled: boolean;
  poolPaused?: boolean;
  sortOrder: number;
};

// Temporary frontend seed. The admin API can replace this array without changing the page components.
export const savingsPoolPlans: SavingsPoolPlan[] = [
  {
    id: "vip-1",
    name: "VIP1",
    participants: "273485",
    totalUsdc: "1369619240",
    amountRange: "1 - 29,999",
    minimumUsdc: "1",
    ethRate: "0.2666%",
    image: "/images/vip-plans/vip-1.png",
    enabled: true,
    sortOrder: 1,
  },
  {
    id: "vip-2",
    name: "VIP2",
    participants: "251770",
    totalUsdc: "2388143123",
    amountRange: "30,000 - 99,999",
    minimumUsdc: "30000",
    ethRate: "0.3666%",
    image: "/images/vip-plans/vip-2.png",
    enabled: true,
    sortOrder: 2,
  },
  {
    id: "vip-3",
    name: "VIP3",
    participants: "143819",
    totalUsdc: "5228899770",
    amountRange: "100,000 - 299,999",
    minimumUsdc: "100000",
    ethRate: "0.4666%",
    image: "/images/vip-plans/vip-3.png",
    enabled: true,
    sortOrder: 3,
  },
  {
    id: "vip-4",
    name: "VIP4",
    participants: "77804",
    totalUsdc: "13005791398",
    amountRange: "300,000 - 499,999",
    minimumUsdc: "300000",
    ethRate: "0.5333%",
    image: "/images/vip-plans/vip-4.png",
    enabled: true,
    sortOrder: 4,
  },
  {
    id: "vip-5",
    name: "VIP5",
    participants: "84665",
    totalUsdc: "8333710199",
    amountRange: "500,000 - 999,999",
    minimumUsdc: "500000",
    ethRate: "0.6%",
    image: "/images/vip-plans/vip-5.png",
    enabled: true,
    sortOrder: 5,
  },
  {
    id: "vip-6",
    name: "VIP6",
    participants: "78943",
    totalUsdc: "10374346685",
    amountRange: "1,000,000 - 2,999,999",
    minimumUsdc: "1000000",
    ethRate: "0.6666%",
    image: "/images/vip-plans/vip-6.png",
    enabled: true,
    sortOrder: 6,
  },
  {
    id: "vip-7",
    name: "VIP7",
    participants: "75483",
    totalUsdc: "25782492627",
    amountRange: "3,000,000 and above",
    minimumUsdc: "3000000",
    ethRate: "0.7333%",
    image: "/images/vip-plans/vip-7.png",
    enabled: true,
    sortOrder: 7,
  },
];

export const savingsPoolDepositConfig = {
  assets: [
    { id: "ethereum-usdc", label: "Ethereum · USDC" },
    { id: "ethereum-usdt", label: "Ethereum · USDT" },
    { id: "ethereum-pyusd", label: "Ethereum · PYUSD" },
    { id: "tron-usdt", label: "TRON · USDT" },
  ],
  activePlanId: null as string | null,
  temporaryPoolLabel: "Temporary Holding Pool",
};

// Admin-managed presentation copy shared by all fixed savings plans.
export const savingsPoolPresentationConfig = {
  fixedSavingsTitle: "Fixed Savings Smart Contract",
};

export type SavingsPlanParticipation = {
  planId: string;
  contractTotalUsdc: string;
  completedUsdc: string;
  endDate: string;
  extraRewardEth: string;
  currentEarningsEth: string;
};

// Temporary frontend seed. The admin API can replace these values per wallet and plan.
export const savingsPlanParticipations: SavingsPlanParticipation[] = [
  {
    planId: "vip-7",
    contractTotalUsdc: "3,000,000",
    completedUsdc: "1,260,000",
    endDate: "2027-07-11",
    extraRewardEth: "0.000000",
    currentEarningsEth: "0.000000",
  },
];
