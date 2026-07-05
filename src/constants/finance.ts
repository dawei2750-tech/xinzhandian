import type {
  Benefit,
  Coin,
  FeatureCard,
  MarketItem,
  NavItem,
  PlatformStat,
  QuickAction,
  SavingsRate,
  SummaryTile,
} from "@/types/finance";

export const brand = { name: "HB Chain", mark: "HB", language: "简体中文", wallet: "连接钱包" } as const;
export const uiText = {
  mainNavigation: "主导航",
  mobileNavigation: "移动端导航",
  upwardTrend: "上涨趋势",
  more: "更多",
  pageTitle: "HB Chain Finance",
  pageDescription: "HB Chain Web3 financial platform",
} as const;

export const navItems: NavItem[] = [
  { label: "首页", href: "#home" }, { label: "交易", href: "#trade" },
  { label: "矿池", href: "#pool" }, { label: "理财", href: "#finance" },
  { label: "盲盒", href: "#box" }, { label: "邀请", href: "#invite" },
  { label: "更多", href: "#more" },
];

export const mobileNavItems: NavItem[] = [
  { label: "首页", href: "#home", icon: "home" }, { label: "交易", href: "#trade", icon: "swap" },
  { label: "矿池", href: "#pool", icon: "mining" }, { label: "理财", href: "#finance", icon: "finance" },
  { label: "我的", href: "#account", icon: "user" },
];

export const marketItems: MarketItem[] = [
  { label: "© 2026 CoinMarketCap. 版权所有。" },
  { label: "加密货币", value: "5327万美元" }, { label: "交易所", value: "952" },
  { label: "市值", value: "2.16万亿美元", change: "1.49%", trend: "up" },
  { label: "24小时卷", value: "649.4亿美元", change: "30.59%", trend: "down" },
  { label: "市场主导", value: "BTC: 60.1%  ETH: 11.4%" }, { label: "Gas", value: "1.24 Gwei" },
];

export const heroContent = {
  eyebrow: "安全 · 高效 · 透明", titlePrefix: "开启你的", titleAccent: "Web3", titleSuffix: "时代",
  description: "多链支持 · 智能合约保障 · 资产安全可追溯",
  primaryAction: "立即体验", secondaryAction: "了解更多",
  carouselDots: 5,
  coins: [
    { label: "BTC", icon: "bitcoin", tone: "orange" },
    { label: "USDT", icon: "usdt", tone: "green" },
    { label: "USDC", icon: "usdc", tone: "blue" },
  ],
} as const;

export const platformHeading = "平台实时数据";
export const platformPeriod = "24H";
export const platformStats: PlatformStat[] = [
  { label: "总交易量", value: "$3,592,466,059", change: "+8.24%", icon: "volume", tone: "blue" },
  { label: "未平仓合约", value: "$2,508,807,087", change: "+6.37%", icon: "briefcase", tone: "green" },
  { label: "用户总数", value: "708,692", change: "+5.21%", icon: "users", tone: "purple" },
  { label: "24H交易量", value: "$126,890,420", change: "+9.18%", icon: "chart", tone: "blue" },
];

export const summaryTiles: SummaryTile[] = [
  { label: "总交易量", value: "$3.59B", icon: "briefcase", tone: "green" },
  { label: "未平仓合约", value: "$2.51B", icon: "vault", tone: "orange" },
  { label: "用户总数", value: "708,692", icon: "users", tone: "purple" },
  { label: "24H交易量", value: "$126.89M", icon: "chart", tone: "blue" },
];

export const quickActions: QuickAction[] = [
  { title: "盲盒抽奖", description: "100%中奖", icon: "gift", tone: "orange" },
  { title: "邀请好友", description: "最高返佣 15%", icon: "users", tone: "blue" },
  { title: "流动性挖矿", description: "赚取平台通证", icon: "chart", tone: "green" },
  { title: "定期储蓄", description: "最高年化 11%", icon: "shield", tone: "purple" },
];

export const featureCards: FeatureCard[] = [
  { title: "定期储蓄计划", subtitle: "最高年化", value: "11.00%", button: "立即存入", icon: "vault", tone: "orange" },
  { title: "盲盒抽奖", subtitle: "100%中奖", valueLabel: "最高奖励", value: "8888 USDC", button: "去抽奖", icon: "gift", tone: "purple" },
  { title: "邀请好友", subtitle: "享高额返佣", valueLabel: "最高返佣", value: "15%", button: "立即邀请", icon: "users", tone: "blue" },
  { title: "流动性挖矿", subtitle: "提供流动性", valueLabel: "赚取", value: "平台通证", button: "立即参与", icon: "coins", tone: "orange" },
];

export const coinListHeading = "热门币种";
export const coinColumns = ["币种", "价格", "24H涨跌", "24H成交额", "趋势"] as const;
export const coins: Coin[] = [
  { symbol: "BTC", name: "比特币", price: "$61,949.60", change: "+0.56%", volume: "$619.49M", icon: "bitcoin", tone: "orange", trend: [7,12,9,18,14,24,21,29] },
  { symbol: "ETH", name: "以太坊", price: "$1,735.43", change: "+2.25%", volume: "$173.54M", icon: "ethereum", tone: "blue", trend: [8,11,7,16,13,22,18,27] },
  { symbol: "BNB", name: "币安币", price: "$592.31", change: "+1.18%", volume: "$59.23M", icon: "bnb", tone: "orange", trend: [6,10,8,13,11,18,17,23] },
  { symbol: "XRP", name: "瑞波币", price: "$1.1101", change: "+1.46%", volume: "$111.01M", icon: "xrp", tone: "cyan", trend: [9,6,12,10,17,15,22,25] },
  { symbol: "DOGE", name: "狗狗币", price: "$0.07633", change: "+2.40%", volume: "$76.33M", icon: "doge", tone: "orange", trend: [5,9,7,13,10,19,16,24] },
  { symbol: "DOT", name: "波卡币", price: "$0.8734", change: "+2.70%", volume: "$8.73M", icon: "dot", tone: "purple", trend: [7,5,10,8,15,13,20,26] },
];

export const tableColumns = ["存款金额（USDC）", "每日利率", "年化利率"] as const;
export const savingsTables = {
  fixed: { title: "定期储蓄利率表", note: "固定期限" },
  flexible: { title: "灵活储蓄利率表", note: "随存随取" },
} as const;
export const fixedSavingsRates: SavingsRate[] = [
  ["1 - 49,999", "1.70%", "620.50%"], ["50,000 - 99,999", "2.20%", "803.00%"],
  ["100,000 - 299,999", "2.60%", "949.00%"], ["300,000 - 499,999", "3.00%", "1095.00%"],
  ["500,000 - 999,999", "3.40%", "1241.00%"], ["1,000,000 - 2,999,999", "3.80%", "1387.00%"],
  ["3,000,000 - 4,999,999", "4.50%", "1642.50%"], ["5,000,000 - 9,999,999", "5.80%", "2117.00%"],
  ["OVER 10,000,000", "11.00%", "4015.00%"],
].map(([amount, dailyRate, annualRate]) => ({ amount, dailyRate, annualRate }));

export const flexibleSavingsRates: SavingsRate[] = [
  ["1 - 9,999", "0.70%", "255.50%"], ["10,000 - 49,999", "0.90%", "328.50%"],
  ["50,000 - 99,999", "1.10%", "401.50%"], ["100,000 - 299,999", "1.30%", "474.50%"],
  ["300,000 - 499,999", "1.50%", "547.50%"], ["500,000 - 999,999", "1.70%", "620.50%"],
  ["1,000,000 - 2,999,999", "1.90%", "693.50%"], ["3,000,000 - 4,999,999", "2.10%", "766.50%"],
  ["OVER 5,000,000", "2.70%", "985.50%"],
].map(([amount, dailyRate, annualRate]) => ({ amount, dailyRate, annualRate }));

export const benefits: Benefit[] = [
  { title: "安全可靠", description: "多重审计，资金安全保障", icon: "shield", tone: "blue" },
  { title: "智能合约", description: "公开透明，链上可验证", icon: "contract", tone: "purple" },
  { title: "多链支持", description: "支持 12+ 主流公链", icon: "chain", tone: "purple" },
  { title: "全球合规", description: "合规运营，全球服务", icon: "globe", tone: "green" },
];
