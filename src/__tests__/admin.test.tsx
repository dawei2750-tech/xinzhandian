import { fireEvent, render, screen, within } from "@testing-library/react";
import AdminPage from "@/app/admin/page";

describe("admin whitelist management", () => {
  beforeEach(() => localStorage.clear());

  it("reserves every confirmed backend control module", () => {
    render(<AdminPage />);
    expect(screen.getByText("Blockchain Savings 管理后台").closest(".admin-shell")).toBeInTheDocument();
    const catalog = screen.getByTestId("admin-action-catalog");
    expect(within(catalog).getByRole("button", { name: /EVM网络管理/ })).toBeInTheDocument();
    fireEvent.click(within(catalog).getByRole("button", { name: /用户与订单/ }));
    expect(within(catalog).getByRole("button", { name: /取消授权处理/ })).toBeInTheDocument();
    fireEvent.click(within(catalog).getByRole("button", { name: /池子与收益/ }));
    expect(within(catalog).getByRole("button", { name: /VIP1–VIP7子池/ })).toBeInTheDocument();
    fireEvent.click(within(catalog).getByRole("button", { name: /资金与审批/ }));
    expect(within(catalog).getByRole("button", { name: /运维池多签/ })).toBeInTheDocument();
    fireEvent.click(within(catalog).getByRole("button", { name: /系统控制/ }));
    expect(within(catalog).getByRole("button", { name: /整体紧急暂停/ })).toBeInTheDocument();
    expect(catalog).toHaveTextContent("TRON提现");
    expect(catalog).toHaveTextContent("自动公式匹配");
  });

  it("adds, searches, imports, and removes internal-test wallets", () => {
    render(<AdminPage />);
    fireEvent.click(screen.getByRole("button", { name: "白名单管理封闭内测准入" }));

    const panel = screen.getByTestId("whitelist-management");
    expect(panel).toHaveTextContent("封闭内测准入");
    expect(panel).toHaveTextContent("是否参加合约");
    expect(panel).toHaveTextContent("计划类型");
    expect(panel).toHaveTextContent("授权状态");
    expect(panel).toHaveTextContent("所属池");
    expect(panel).toHaveTextContent("风控状态");

    fireEvent.change(within(panel).getByLabelText("新增钱包地址"), {
      target: { value: "0x1111111111111111111111111111111111111111" },
    });
    fireEvent.click(within(panel).getByRole("button", { name: "新增地址" }));
    expect(panel).toHaveTextContent("0x1111...1111");

    fireEvent.change(within(panel).getByLabelText("批量导入钱包地址"), {
      target: {
        value:
          "0x2222222222222222222222222222222222222222\nTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      },
    });
    fireEvent.click(within(panel).getByRole("button", { name: "批量导入" }));
    expect(panel).toHaveTextContent("已导入 2 个地址");

    fireEvent.change(within(panel).getByLabelText("查询白名单地址"), {
      target: { value: "0x1111111111111111111111111111111111111111" },
    });
    fireEvent.click(within(panel).getByRole("button", { name: "查询" }));
    expect(panel).toHaveTextContent("该地址已加入白名单");

    fireEvent.click(within(panel).getAllByRole("button", { name: "删除" })[0]);
    expect(panel).not.toHaveTextContent("0x1111...1111");
  });

  it("creates allowance adjustment drafts and controls the emergency brake", () => {
    render(<AdminPage />);
    fireEvent.click(screen.getByRole("button", { name: "授权管理额度与退出" }));
    for (const asset of ["Ethereum · USDC", "Ethereum · USDT", "Ethereum · PYUSD", "TRON · USDT"])
      expect(screen.getByTestId("authorization-assets")).toHaveTextContent(asset);

    fireEvent.change(screen.getByLabelText("默认授权额度"), {
      target: { value: "5000" },
    });
    fireEvent.change(screen.getByLabelText("操作原因"), {
      target: { value: "内测额度调整" },
    });
    fireEvent.click(screen.getByRole("button", { name: "调整授权额度" }));
    expect(screen.getByText(/授权额度调整草稿：5000 USDC/)).toBeInTheDocument();
    expect(screen.getByText("当前生效额度：5000 USDC")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "紧急暂停" }));
    expect(screen.getByText("授权消费已紧急暂停" )).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "解除紧急暂停" })).toBeInTheDocument();
  });

  it("keeps ETH commission enabled and TRX commission optional", () => {
    render(<AdminPage />);
    fireEvent.click(screen.getByRole("button", { name: "池子管理资金与路由" }));
    expect(screen.getByLabelText("ETH 佣金")).toBeChecked();
    expect(screen.getByLabelText("启用 TRX 佣金")).not.toBeChecked();
    fireEvent.click(screen.getByLabelText("启用 TRX 佣金"));
    expect(screen.getByText("TRX 佣金草稿已启用，等待后端规则与项目方确认")).toBeInTheDocument();
    const pools = screen.getByTestId("independent-subpools");
    expect(within(pools).getAllByText("子池分散发放 ETH")).toHaveLength(7);
    expect(within(pools).getByLabelText("VIP1 子池利率")).toHaveValue("0.2666%");
    fireEvent.change(within(pools).getByLabelText("VIP1 子池利率"), { target: { value: "0.3%" } });
    expect(within(pools).getByLabelText("VIP1 子池利率")).toHaveValue("0.3%");
    fireEvent.click(within(pools).getByLabelText("VIP1 子池暂停"));
    expect(pools).toHaveTextContent("已暂停");
  });

  it("shows fixed savings as locked until maturity without reward expiry", () => {
    render(<AdminPage />);
    fireEvent.click(screen.getByRole("button", { name: "智能合约VIP1–VIP7" }));
    const note = screen.getByTestId("fixed-rule-note");
    expect(note).toHaveTextContent("待项目方选择");
    expect(note).toHaveTextContent("到期前不允许退出");
    expect(note).toHaveTextContent("奖励不销毁，暂无逾期惩罚");
    expect(note).toHaveTextContent("尚未写入前台正式规则");
    fireEvent.change(within(note).getByLabelText("新增定期规则"), { target: { value: "项目方自定义规则" } });
    fireEvent.click(within(note).getByRole("button", { name: "新增规则" }));
    expect(note).toHaveTextContent("项目方自定义规则");
    fireEvent.click(within(note).getByRole("button", { name: "删除规则 到期前不允许退出" }));
    expect(note).not.toHaveTextContent("到期前不允许退出");
    fireEvent.click(within(note).getByRole("button", { name: "采用当前规则" }));
    expect(note).toHaveTextContent("项目方选择采用");
  });

  it("records the confirmed deposit and multi-order limits", () => {
    render(<AdminPage />);
    const rules = screen.getByTestId("participation-rules");
    expect(within(rules).getByLabelText("单笔最小存款额")).toHaveValue("1000");
    expect(rules).toHaveTextContent("单笔最大存款额不限制");
    expect(rules).toHaveTextContent("单用户累计上限不限制");
    expect(within(rules).getByLabelText("允许单用户多个订单")).toBeChecked();
  });

  it("caps fixed-tier yield by tier maximum and a configurable 180-day term", () => {
    render(<AdminPage />);
    const caps = screen.getByTestId("fixed-yield-caps");
    expect(within(caps).getByLabelText("定期最长天数")).toHaveValue(180);
    expect(caps).toHaveTextContent("VIP7");
    expect(caps).toHaveTextContent("3,000,000 and above");
    expect(caps).toHaveTextContent("不设上限");
    fireEvent.change(within(caps).getByLabelText("定期最长天数"), { target: { value: "365" } });
    expect(within(caps).getByLabelText("定期最长天数")).toHaveValue(180);
    fireEvent.change(within(caps).getByLabelText("定期最长时间模式"), { target: { value: "unlimited" } });
    expect(caps).toHaveTextContent("不设最长时长");
  });
});
