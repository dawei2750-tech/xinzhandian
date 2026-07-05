import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("finance home", () => {
  it("renders the core finance sections", () => {
    render(<Home />);

    expect(screen.getByText("HB Chain")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "开启你的 Web3 时代" })).toBeInTheDocument();
    expect(screen.getByText("平台实时数据")).toBeInTheDocument();
    expect(screen.getByText("热门币种")).toBeInTheDocument();
    expect(screen.getByText("定期储蓄利率表")).toBeInTheDocument();
    expect(screen.getByText("灵活储蓄利率表")).toBeInTheDocument();
    expect(screen.getByText("定期储蓄计划")).toBeInTheDocument();
    expect(screen.getAllByText("盲盒抽奖")).toHaveLength(2);
    expect(screen.getAllByText("邀请好友")).toHaveLength(2);
    expect(screen.getAllByText("流动性挖矿")).toHaveLength(2);
    expect(screen.getByText("安全可靠")).toBeInTheDocument();
    expect(screen.getByText("全球合规")).toBeInTheDocument();
    expect(screen.getByLabelText("移动端导航")).toBeInTheDocument();
    expect(screen.getAllByText("BTC").length).toBeGreaterThan(0);
    expect(screen.getAllByText("4015.00%").length).toBeGreaterThan(0);
    expect(screen.getAllByText("985.50%").length).toBeGreaterThan(0);
    expect(screen.getByTestId("coin-grid")).toHaveClass("lg:min-w-0");
    expect(
      Array.from(document.querySelectorAll("[data-section]")).map((element) =>
        element.getAttribute("data-section"),
      ),
    ).toEqual(["hero", "stats", "features", "rates", "benefits", "summary", "coins", "quick"]);
    expect(document.querySelector('[data-column="primary"]')).toHaveClass("lg:col-span-9");
    expect(document.querySelector('[data-column="secondary"]')).toHaveClass("lg:col-span-3");
    expect(screen.getByText("$3.59B")).toBeInTheDocument();
    expect(screen.getByText("赚取平台通证")).toBeInTheDocument();
    expect(screen.getByLabelText("移动端导航")).toHaveClass("fixed", "lg:hidden");
    expect(document.querySelectorAll(".overflow-x-auto").length).toBeGreaterThanOrEqual(4);
    expect(screen.getByTestId("hero-dots")).toBeInTheDocument();
    expect(screen.getAllByTestId("rate-illustration")).toHaveLength(2);
  });
});
