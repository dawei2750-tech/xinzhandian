import {
  advantages,
  benefits,
  brand,
  coins,
  featureCards,
  fixedSavingsRates,
  flexibleSavingsRates,
  heroContent,
  marketItems,
  mobileDrawerItems,
  mobileNavItems,
  navItems,
  promoBanners,
  quickActions,
} from "@/constants/finance";

describe("finance constants", () => {
  it("contains every navigation and market item", () => {
    expect(navItems.map((item) => item.label)).toEqual([
      "首页", "交易", "矿池", "理财", "盲盒", "邀请", "更多",
    ]);
    expect(mobileNavItems).toHaveLength(5);
    expect(marketItems.map((item) => item.label)).toEqual(expect.arrayContaining([
      "✓ 链上公开透明",
      "✓ 多重签名资产管理",
      "✓ 实时链上数据",
      "✓ 多链支持",
      "✓ 智能合约自动执行",
    ]));
  });

  it("contains the revised shared homepage content", () => {
    expect(brand.name).toBe("Blockchain Savings");
    expect(brand.wallet).toBe("ReceiveVoucher");
    expect(heroContent.title).toBe("Blockchain Savings");
    expect(featureCards.map((card) => card.title)).not.toContain("定期储蓄计划");
    expect(featureCards).toHaveLength(3);
    expect(coins.map((coin) => coin.symbol)).toEqual([
      "BTC", "ETH", "BNB", "XRP", "DOGE", "DOT",
    ]);
    expect(benefits).toHaveLength(4);
    expect(quickActions).toHaveLength(4);
  });

  it("contains daily-only fixed and flexible savings ranges", () => {
    expect(fixedSavingsRates).toHaveLength(9);
    expect(flexibleSavingsRates).toHaveLength(9);
    expect(fixedSavingsRates.at(0)).toEqual({ amount: "1 - 49,999", dailyRate: "1.70%" });
    expect(flexibleSavingsRates.at(-1)).toEqual({ amount: "OVER 5,000,000", dailyRate: "2.70%" });
    expect(fixedSavingsRates.every((rate) => !("annualRate" in rate))).toBe(true);
    expect(flexibleSavingsRates.every((rate) => !("annualRate" in rate))).toBe(true);
  });

  it("contains complete shared mobile, banner, and advantages content", () => {
    expect(mobileDrawerItems.map((item) => item.label)).toEqual([
      "首页", "矿池数据", "贷款", "文档", "语言",
    ]);
    expect(mobileDrawerItems.map((item) => item.href)).toEqual([
      "/", "/pool", "/loan", "/docs", "#language",
    ]);
    expect(promoBanners).toHaveLength(4);
    expect(promoBanners.at(-1)?.image).toBe("/images/blockchain-savings-reward.png");
    expect(promoBanners.every((banner) => banner.title && banner.description)).toBe(true);
    expect(advantages).toHaveLength(11);
    expect(advantages.map((item) => item.id)).toEqual([
      "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11",
    ]);
    expect(advantages.find((item) => item.id === "03")?.title).toBe("如何在钱包中质押 USDC？");
    expect(advantages.every((item) => item.body.length > 0 && item.body.every(Boolean))).toBe(true);
    expect(mobileNavItems.map((item) => item.href)).toEqual([
      "/", "/", "/pool", "/loan", "/pool?tab=account",
    ]);
  });
});
