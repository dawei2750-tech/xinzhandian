import { fireEvent, render, screen, within } from "@testing-library/react";
import { vi } from "vitest";
import AdminPage from "@/app/admin/page";

describe("admin whitelist management", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllEnvs();
  });

  it("renders the simplified business console navigation and global actions", () => {
    render(<AdminPage />);
    const shell = screen.getByText("HB Finance 管理后台").closest(".admin-shell");
    expect(shell).toBeInTheDocument();
    expect(shell).toHaveAttribute("data-admin-theme", "wealth-console");
    expect(screen.queryByTestId("admin-action-catalog")).not.toBeInTheDocument();
    expect(document.querySelectorAll("aside button")).toHaveLength(6);
    for (const label of ["管理总览", "用户管理", "计划配置", "资金配置", "提现设置", "发布记录"])
      expect(screen.getByRole("button", { name: new RegExp(label) })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "预览前台" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存草稿" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "发布配置" })).toBeInTheDocument();
    expect(screen.queryByText("原型状态")).not.toBeInTheDocument();
    expect(screen.queryByText("上线前必须完成")).not.toBeInTheDocument();
    expect(screen.getByTestId("admin-content")).toBeInTheDocument();
  });

  it("groups backend-ready actions by business section and reports pending integration honestly", () => {
    render(<AdminPage />);

    expect(screen.getByRole("button", { name: "刷新状态" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "紧急暂停" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "刷新状态" }));
    expect(screen.getByRole("status")).toHaveTextContent("等待接口：刷新状态");

    fireEvent.click(screen.getByRole("button", { name: /用户管理/ }));
    expect(screen.getByText("用户与白名单")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /计划配置/ }));
    expect(screen.getByRole("button", { name: "保存计划" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /暂停.*池/ })).toHaveLength(7);

    fireEvent.click(screen.getByRole("button", { name: /资金配置/ }));
    for (const label of ["查看子池余额", "补充资金", "待结算列表", "批量结算"])
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /提现设置/ }));
    for (const label of ["保存报价设置", "提现审核", "兑换记录"])
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /发布记录/ }));
    for (const label of ["预览变更", "创建多签任务", "升级管理", "查看审计记录"])
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
  });

  it("clears stale integration status when switching business sections", () => {
    render(<AdminPage />);

    fireEvent.click(screen.getByRole("button", { name: /发布记录/ }));
    fireEvent.click(screen.getByRole("button", { name: "查看审计记录" }));
    expect(screen.getByRole("status")).toHaveTextContent("等待接口：查看审计记录");

    fireEvent.click(screen.getByRole("button", { name: /用户管理/ }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("adds, searches, imports, and removes internal-test wallets", () => {
    render(<AdminPage />);
    fireEvent.click(screen.getByRole("button", { name: /用户管理/ }));

    const panel = screen.getByTestId("whitelist-management");
    expect(panel).toHaveTextContent("封闭内测准入");
    for (const heading of ["钱包地址", "网络", "准入状态", "计划", "当前本金", "累计收益", "风险状态", "操作"])
      expect(within(panel).getByRole("columnheader", { name: heading })).toBeInTheDocument();
    expect(within(panel).queryByRole("columnheader", { name: "授权额度" })).not.toBeInTheDocument();

    fireEvent.change(within(panel).getByLabelText("新增钱包地址"), {
      target: { value: "0x1111111111111111111111111111111111111111" },
    });
    fireEvent.click(within(panel).getByRole("button", { name: "新增地址" }));
    expect(panel).toHaveTextContent("0x1111...1111");
    expect(screen.getByRole("status")).toHaveTextContent("新增成功：1 个地址");

    fireEvent.change(within(panel).getByLabelText("批量导入钱包地址"), {
      target: {
        value:
          "0x2222222222222222222222222222222222222222\nTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      },
    });
    fireEvent.click(within(panel).getByRole("button", { name: "批量导入" }));
    expect(panel).toHaveTextContent("批量导入成功：2 个地址");
    expect(screen.getByRole("status")).toHaveTextContent("批量导入成功：2 个地址");

    fireEvent.change(within(panel).getByLabelText("查询白名单地址"), {
      target: { value: "0x1111111111111111111111111111111111111111" },
    });
    fireEvent.click(within(panel).getByRole("button", { name: "查询" }));
    expect(panel).toHaveTextContent("查询结果：该地址已加入白名单");
    expect(screen.getByRole("status")).toHaveTextContent("查询结果：该地址已加入白名单");

    fireEvent.change(within(panel).getByLabelText("批量导入钱包地址"), {
      target: { value: "0x3333333333333333333333333333333333333333" },
    });
    fireEvent.click(within(panel).getByRole("button", { name: "批量导入" }));
    expect(panel).toHaveTextContent("批量导入成功：1 个地址");

    fireEvent.click(within(panel).getAllByRole("button", { name: "查看详情" })[0]);
    expect(panel).toHaveTextContent("授权额度");
    expect(panel).toHaveTextContent("所属池");
    expect(within(panel).getAllByRole("button", { name: "设置额度" })[0]).toBeInTheDocument();
    expect(within(panel).getAllByRole("button", { name: "查看订单" })[0]).toBeInTheDocument();
    fireEvent.click(within(panel).getAllByRole("button", { name: "移出白名单" })[0]);
    expect(panel).toHaveTextContent("已移出白名单：0x1111...1111");
    expect(screen.getByRole("status")).toHaveTextContent("已移出白名单：0x1111...1111");
    expect(within(panel).queryByTitle("0x1111111111111111111111111111111111111111")).not.toBeInTheDocument();
  });

  it("keeps plan rules editable without the removed adoption buttons", () => {
    render(<AdminPage />);
    fireEvent.click(screen.getByRole("button", { name: /计划配置/ }));
    expect(screen.getByLabelText("VIP1 启用")).toBeChecked();
    fireEvent.change(screen.getByLabelText("新增定期规则"), { target: { value: "项目方自定义规则" } });
    fireEvent.click(screen.getByRole("button", { name: "新增规则" }));
    expect(screen.getByText("项目方自定义规则")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "采用当前规则" })).not.toBeInTheDocument();
  });

  it("keeps real fund and withdrawal configuration without placeholder controls", () => {
    render(<AdminPage />);
    fireEvent.click(screen.getByRole("button", { name: /资金配置/ }));
    expect(screen.getByLabelText("支持资产")).toHaveValue("Ethereum · USDC, Ethereum · USDT, Ethereum · PYUSD, TRON · USDT");
    expect(screen.getByText("日常佣金币种").parentElement).toHaveTextContent("ETH");
    expect(screen.queryByLabelText("启用 TRX 佣金")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /提现设置/ }));
    expect(screen.getByLabelText("最低提现")).toHaveValue("1");
  });

  it("shows the active local Ganache contract wiring in the admin console", () => {
    vi.stubEnv("NEXT_PUBLIC_WEB3_ENV", "local");
    vi.stubEnv("NEXT_PUBLIC_EVM_CHAIN_ID", "31337");
    vi.stubEnv("NEXT_PUBLIC_EVM_CHAIN_NAME", "HB Finance Local Ganache");
    vi.stubEnv("NEXT_PUBLIC_EVM_RPC_URL", "http://127.0.0.1:8545");
    vi.stubEnv("NEXT_PUBLIC_ASSET_MANAGER_ADDRESS", "0x1111111111111111111111111111111111111111");
    vi.stubEnv("NEXT_PUBLIC_LEDGER_ADDRESS", "0x5555555555555555555555555555555555555555");
    vi.stubEnv("NEXT_PUBLIC_USDT_ADDRESS", "0x2222222222222222222222222222222222222222");
    vi.stubEnv("NEXT_PUBLIC_USDC_ADDRESS", "0x3333333333333333333333333333333333333333");
    vi.stubEnv("NEXT_PUBLIC_PYUSD_ADDRESS", "0x4444444444444444444444444444444444444444");
    for (const symbol of ["USDT", "USDC", "PYUSD"]) {
      for (let vip = 1; vip <= 7; vip += 1) {
        vi.stubEnv(`NEXT_PUBLIC_${symbol}_VIP${vip}_POOL_ADDRESS`, `0x${String(vip).repeat(40)}`);
      }
    }

    render(<AdminPage />);

    const panel = screen.getByTestId("admin-chain-runtime");
    expect(panel).toHaveTextContent("local");
    expect(panel).toHaveTextContent("31337");
    expect(panel).toHaveTextContent("http://127.0.0.1:8545");
    expect(panel).toHaveTextContent("0x1111111111111111111111111111111111111111");
    expect(panel).toHaveTextContent("0x2222222222222222222222222222222222222222");
    expect(panel).toHaveTextContent("0x3333333333333333333333333333333333333333");
    expect(panel).toHaveTextContent("0x4444444444444444444444444444444444444444");
  });

  it("keeps production publishing visibly locked", () => {
    render(<AdminPage />);
    fireEvent.click(screen.getByRole("button", { name: /发布记录/ }));
    expect(screen.getByRole("button", { name: "发布更新" })).toBeDisabled();
    expect(screen.getByText("暂无发布记录")).toBeInTheDocument();
  });
});
