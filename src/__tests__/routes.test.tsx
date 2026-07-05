import { fireEvent, render, screen } from "@testing-library/react";
import PoolPage from "@/app/pool/page";
import LoanPage from "@/app/loan/page";
import DocsPage from "@/app/docs/page";

describe("mobile drawer destination pages", () => {
  it("renders pool data with four local tabs and no fabricated values", () => {
    render(<PoolPage />);

    expect(screen.getByRole("heading", { name: "矿池数据" })).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    expect(screen.getByText("总分红数据")).toBeInTheDocument();
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(3);
    fireEvent.click(screen.getByRole("tab", { name: "计划" }));
    expect(screen.getByRole("heading", { name: "储蓄计划" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "账户" }));
    expect(screen.getByText("连接钱包后显示账户信息")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "转移" }));
    expect(screen.getByText("连接钱包后可使用转移功能")).toBeInTheDocument();
  });

  it("renders the loan workflow as an honest unavailable state", () => {
    render(<LoanPage />);

    expect(screen.getByRole("heading", { name: "贷款服务" })).toBeInTheDocument();
    expect(screen.getByText("贷款金额")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "下载申请表" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "上传申请表" })).toBeDisabled();
    expect(screen.getByText("后台接入后开放")).toBeInTheDocument();
  });

  it("renders two whitepaper cards without fake document links", () => {
    render(<DocsPage />);

    expect(screen.getByRole("heading", { name: "文档中心" })).toBeInTheDocument();
    expect(screen.getByText("美国财政部白皮书")).toBeInTheDocument();
    expect(screen.getByText("以太坊白皮书")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "待配置" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "待配置" })[0]).toBeDisabled();
  });
});
