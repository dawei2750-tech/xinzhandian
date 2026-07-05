import type {
  AdvantageItem,
  Benefit,
  Coin,
  FeatureCard,
  MarketItem,
  MobileDrawerItem,
  NavItem,
  PromoBanner,
  QuickAction,
  SavingsRate,
} from "@/types/finance";

export const brand = { name: "HB Chain", mark: "HB", language: "简体中文", wallet: "ReceiveVoucher" } as const;
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
  { label: "✓ 链上公开透明" }, { label: "✓ 多重签名资产管理" },
  { label: "✓ 实时链上数据" }, { label: "✓ 多链支持" },
  { label: "✓ 智能合约自动执行" },
];

export const mobileDrawerItems: MobileDrawerItem[] = [
  { label: "首页", href: "/", icon: "home" },
  { label: "矿池数据", href: "/pool", icon: "mining" },
  { label: "贷款", href: "/loan", icon: "coins" },
  { label: "文档", href: "/docs", icon: "contract" },
  { label: "语言", href: "#language", icon: "globe" },
];

export const promoBanners: PromoBanner[] = [
  { eyebrow: "BLOCKCHAIN SAVINGS", title: "数字资产新方式", description: "多链储蓄与链上透明数据", icon: "ethereum", tone: "purple" },
  { eyebrow: "LIQUIDITY SAVINGS", title: "灵活储蓄赚取 USDC", description: "随存随取，收益清晰可见", icon: "usdc", tone: "cyan" },
  { eyebrow: "SMART CONTRACT", title: "自动执行链上计划", description: "合约驱动，多重签名资产管理", icon: "contract", tone: "orange" },
];

export const heroContent = {
  eyebrow: "安全 · 高效 · 透明", title: "Blockchain Savings",
  description: "多链支持 · 智能合约保障 · 资产安全可追溯",
  primaryAction: "立即体验", secondaryAction: "了解更多",
  carouselDots: 5,
  coins: [
    { label: "BTC", icon: "bitcoin", tone: "orange" },
    { label: "USDT", icon: "usdt", tone: "green" },
    { label: "USDC", icon: "usdc", tone: "blue" },
  ],
} as const;

export const quickActions: QuickAction[] = [
  { title: "盲盒抽奖", description: "100%中奖", icon: "gift", tone: "orange" },
  { title: "邀请好友", description: "最高返佣 15%", icon: "users", tone: "blue" },
  { title: "流动性挖矿", description: "赚取平台通证", icon: "chart", tone: "green" },
  { title: "定期储蓄", description: "最高年化 11%", icon: "shield", tone: "purple" },
];

export const featureCards: FeatureCard[] = [
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

export const tableColumns = ["存款金额（USDC）", "每日利率（Daily Interest）"] as const;
export const savingsTables = {
  fixed: { title: "定期储蓄利率表", note: "固定期限" },
  flexible: { title: "灵活储蓄利率表", note: "随存随取" },
} as const;
export const fixedSavingsRates: SavingsRate[] = [
  ["1 - 49,999", "1.70%"], ["50,000 - 99,999", "2.20%"],
  ["100,000 - 299,999", "2.60%"], ["300,000 - 499,999", "3.00%"],
  ["500,000 - 999,999", "3.40%"], ["1,000,000 - 2,999,999", "3.80%"],
  ["3,000,000 - 4,999,999", "4.50%"], ["5,000,000 - 9,999,999", "5.80%"],
  ["OVER 10,000,000", "11.00%"],
].map(([amount, dailyRate]) => ({ amount, dailyRate }));

export const flexibleSavingsRates: SavingsRate[] = [
  ["1 - 9,999", "0.70%"], ["10,000 - 49,999", "0.90%"],
  ["50,000 - 99,999", "1.10%"], ["100,000 - 299,999", "1.30%"],
  ["300,000 - 499,999", "1.50%"], ["500,000 - 999,999", "1.70%"],
  ["1,000,000 - 2,999,999", "1.90%"], ["3,000,000 - 4,999,999", "2.10%"],
  ["OVER 5,000,000", "2.70%"],
].map(([amount, dailyRate]) => ({ amount, dailyRate }));

export const benefits: Benefit[] = [
  { title: "安全可靠", description: "多重审计，资金安全保障", icon: "shield", tone: "blue" },
  { title: "智能合约", description: "公开透明，链上可验证", icon: "contract", tone: "purple" },
  { title: "多链支持", description: "支持 12+ 主流公链", icon: "chain", tone: "purple" },
  { title: "全球合规", description: "合规运营，全球服务", icon: "globe", tone: "green" },
];

export const advantages: AdvantageItem[] = [
  {
    id: "01",
    title: "福利活动",
    body: [
      "尊贵的客户，感谢您一直以来对 HB Chain 的信任与支持。为了回馈用户，我们将持续推出专属福利和奖励计划。",
      "每位成功参与区块链储蓄计划的新用户都可获得专属奖励，并可通过在线支持了解主流加密货币兑换为 USDC 的流程，以便存入个人钱包并继续参与储蓄。",
      "如需了解更多详情，请联系在线支持。",
    ],
  },
  {
    id: "02",
    title: "HB Chain 现金服务",
    body: ["鉴于不同地区的货币兑换限制，平台可提供无佣金的现金与加密货币兑换咨询，包括现金兑换及通过银行电汇购买加密货币的流程支持。"],
  },
  {
    id: "03",
    title: "如何在钱包中质押 USDC？",
    body: [
      "1. 点击“质押”进入质押页面，选择您想要质押的期限和金额。",
      "2. 使用计算器图标预估对应利息。",
      "3. 提交质押申请后，在 10 分钟内联系在线支持确认申请状态。",
      "4. 活动奖励规则以页面最新说明及在线支持确认为准。",
    ],
  },
  {
    id: "04",
    title: "如何邀请朋友加入 HB Chain？",
    body: ["从页面菜单获取专属邀请链接。朋友通过该链接进入后，邀请奖励将按当前活动规则计算，具体比例以页面展示为准。"],
  },
  {
    id: "05",
    title: "什么是 HB Chain？",
    body: ["存款者可为链上流动性市场提供资产，并根据对应计划获得收益。系统基于公开区块链运行，相关操作可追踪、可验证并可审计。"],
  },
  {
    id: "06",
    title: "HB Chain 的工作原理是什么？",
    body: ["HB Chain 通过部署在区块链上的智能合约管理储蓄与流动性计划。参与者可将支持的资产存入对应池中，合约按照公开规则执行并记录链上结果。"],
  },
  {
    id: "07",
    title: "HB Chain 安全可靠吗？",
    body: ["平台通过合约审查、多重签名资产管理和持续安全检查降低风险。区块链与智能合约仍存在技术和市场风险，参与前应阅读规则并独立判断。"],
  },
  {
    id: "08",
    title: "HB Chain 的发展历程",
    body: ["HB Chain 聚焦于建立透明、开放的链上金融体验，并持续完善多链支持、数据验证、储蓄产品和用户操作流程。"],
  },
  {
    id: "09",
    title: "HB Chain 储蓄计划",
    body: ["参与储蓄计划前，钱包需准备计划要求的资产与必要网络费用。具体资产、期限、收益与退出规则以当前页面和合约信息为准。"],
  },
  {
    id: "10",
    title: "参与者须知",
    body: [
      "灵活计划允许资产保留较高流动性；固定期限计划需要选择对应期限，并可能提供不同的收益规则。",
      "资产进入计划后，收益计算、申购和退出条件以页面及智能合约展示为准。",
      "参与者应核对钱包网络、资产类型、授权内容和链上交易状态。",
    ],
  },
  {
    id: "11",
    title: "如何加入？",
    body: ["通过钱包访问页面，点击 ReceiveVoucher 进入授权流程。确认钱包网络和授权内容后，根据页面提示完成链上操作，即可参与对应储蓄计划。"],
  },
];
