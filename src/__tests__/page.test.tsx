import { fireEvent, render, screen, within } from "@testing-library/react";
import Home from "@/app/page";

describe("finance home", () => {
  it("renders separate desktop and mobile compositions from shared content", () => {
    render(<Home />);

    const desktop = screen.getByTestId("desktop-home");
    const mobile = screen.getByTestId("mobile-home");

    expect(desktop).toHaveClass("hidden", "lg:block");
    expect(mobile).toHaveClass("lg:hidden");
    expect(screen.getAllByRole("heading", { name: "Blockchain Savings" })).toHaveLength(2);
    expect(screen.getByRole("button", { name: /ReceiveVoucher/ })).toBeInTheDocument();
    expect(within(mobile).getByLabelText("移动端导航")).toHaveClass("fixed");
    expect(within(desktop).queryByLabelText("移动端导航")).not.toBeInTheDocument();
    expect(document.querySelectorAll("#home")).toHaveLength(1);
  });

  it("removes realtime statistics, summary cards, annual rates, and the duplicate savings card", () => {
    render(<Home />);

    expect(screen.queryByText("平台实时数据")).not.toBeInTheDocument();
    expect(screen.queryByText("总交易量")).not.toBeInTheDocument();
    expect(screen.queryByText("未平仓合约")).not.toBeInTheDocument();
    expect(screen.queryByText("用户总数")).not.toBeInTheDocument();
    expect(screen.queryByText("24H交易量")).not.toBeInTheDocument();
    expect(screen.queryByText("定期储蓄计划")).not.toBeInTheDocument();
    expect(screen.queryByText(/年化利率|Annual Rate|APR|年化收益/)).not.toBeInTheDocument();
    expect(screen.queryByText("4015.00%")).not.toBeInTheDocument();
    expect(screen.queryByText("985.50%")).not.toBeInTheDocument();
  });

  it("orders flexible rates before fixed rates in both layouts and keeps two columns only", () => {
    render(<Home />);

    for (const layout of [screen.getByTestId("desktop-home"), screen.getByTestId("mobile-home")]) {
      const tables = within(layout).getAllByTestId("rate-table");
      expect(tables).toHaveLength(2);
      expect(within(tables[0]).getByRole("heading", { name: /灵活储蓄利率表/ })).toBeInTheDocument();
      expect(within(tables[1]).getByRole("heading", { name: /定期储蓄利率表/ })).toBeInTheDocument();
      expect(within(tables[0]).getAllByRole("columnheader")).toHaveLength(2);
      expect(within(tables[1]).getAllByRole("columnheader")).toHaveLength(2);
    }
  });

  it("replaces reserved statistic placeholders without adding mobile gaps", () => {
    render(<Home />);

    expect(screen.queryByTestId("reserved-stats-slot")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("feature-grid")[0]).toHaveClass("lg:grid-cols-3");
  });

  it("renders an accessible duplicated track for continuous ticker motion", () => {
    render(<Home />);

    const tracks = screen.getAllByTestId("market-ticker-track");
    expect(tracks).toHaveLength(2);
    expect(tracks[0]).toHaveClass("market-ticker-track");
    expect(tracks[0]).not.toHaveAttribute("aria-hidden");
    expect(tracks[1]).toHaveAttribute("aria-hidden", "true");
    expect(within(tracks[0]).getByText("✓ 链上公开透明")).toBeInTheDocument();
    expect(within(tracks[0]).getByText("✓ 智能合约自动执行")).toBeInTheDocument();
  });

  it("opens and closes the H5 navigation drawer", () => {
    render(<Home />);

    expect(screen.queryByTestId("mobile-drawer")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "打开移动端菜单" }));
    const drawer = screen.getByTestId("mobile-drawer");
    expect(drawer).toBeInTheDocument();
    expect(within(drawer).getByText("矿池数据")).toBeInTheDocument();
    expect(within(drawer).getByText("简体中文")).toBeInTheDocument();
    fireEvent.click(within(drawer).getByRole("button", { name: "关闭移动端菜单" }));
    expect(screen.queryByTestId("mobile-drawer")).not.toBeInTheDocument();
  });

  it("renders three themed banners and complete advantages in both layouts", () => {
    render(<Home />);

    expect(screen.getAllByTestId("promo-banner-slide")).toHaveLength(4);
    expect(screen.getByRole("img", { name: "Savings Plan Reward · 3 million ETH" })).toBeInTheDocument();
    for (const layout of [screen.getByTestId("desktop-home"), screen.getByTestId("mobile-home")]) {
      const advantagesPanel = within(layout).getByTestId("advantages-panel");
      expect(within(advantagesPanel).getAllByRole("button")).toHaveLength(11);
      fireEvent.click(within(advantagesPanel).getByRole("button", { name: /01.*福利活动/ }));
      expect(within(advantagesPanel).getByText(/感谢您一直以来/)).toBeInTheDocument();
      fireEvent.click(within(advantagesPanel).getByRole("button", { name: /03.*如何在钱包中质押 USDC/ }));
      expect(within(advantagesPanel).getByText(/选择您想要质押的期限和金额/)).toBeInTheDocument();
      expect(within(advantagesPanel).queryByText(/感谢您一直以来/)).not.toBeInTheDocument();
    }
  });
});
