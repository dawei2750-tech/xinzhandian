import {
  benefits,
  coins,
  featureCards,
  fixedSavingsRates,
  flexibleSavingsRates,
  marketItems,
  mobileNavItems,
  navItems,
  platformStats,
  quickActions,
  summaryTiles,
} from "@/constants/finance";

describe("finance constants", () => {
  it("contains every navigation and market item", () => {
    expect(navItems.map((item) => item.label)).toEqual([
      "首页", "交易", "矿池", "理财", "盲盒", "邀请", "更多",
    ]);
    expect(mobileNavItems).toHaveLength(5);
    expect(marketItems).toHaveLength(7);
  });

  it("contains every dashboard card and coin", () => {
    expect(platformStats).toHaveLength(4);
    expect(featureCards).toHaveLength(4);
    expect(coins.map((coin) => coin.symbol)).toEqual([
      "BTC", "ETH", "BNB", "XRP", "DOGE", "DOT",
    ]);
    expect(benefits).toHaveLength(4);
    expect(summaryTiles).toHaveLength(4);
    expect(quickActions).toHaveLength(4);
  });

  it("contains the complete fixed and flexible savings ranges", () => {
    expect(fixedSavingsRates).toHaveLength(9);
    expect(fixedSavingsRates.at(0)?.annualRate).toBe("620.50%");
    expect(fixedSavingsRates.at(-1)?.annualRate).toBe("4015.00%");
    expect(flexibleSavingsRates).toHaveLength(9);
    expect(flexibleSavingsRates.at(0)?.annualRate).toBe("255.50%");
    expect(flexibleSavingsRates.at(-1)?.annualRate).toBe("985.50%");
  });
});
