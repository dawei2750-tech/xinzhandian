import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { vi } from "vitest";
import PoolPage from "@/app/pool/page";
import SavingsPoolPage from "@/app/savings-pool/page";
import LoanPage from "@/app/loan/page";
import DocsPage from "@/app/docs/page";
import { LocaleProvider } from "@/i18n/locale-provider";
const view = (node: React.ReactNode) =>
  render(<LocaleProvider>{node}</LocaleProvider>);
function stubWeb3Env() {
  vi.stubEnv("NEXT_PUBLIC_WEB3_ENV", "local");
  vi.stubEnv("NEXT_PUBLIC_EVM_CHAIN_ID", "31337");
  vi.stubEnv("NEXT_PUBLIC_EVM_RPC_URL", "http://127.0.0.1:8545");
  vi.stubEnv("NEXT_PUBLIC_ASSET_MANAGER_ADDRESS", "0x1111111111111111111111111111111111111111");
  vi.stubEnv("NEXT_PUBLIC_LEDGER_ADDRESS", "0x5555555555555555555555555555555555555555");
  vi.stubEnv("NEXT_PUBLIC_USDT_ADDRESS", "0x2222222222222222222222222222222222222222");
  vi.stubEnv("NEXT_PUBLIC_USDC_ADDRESS", "0x3333333333333333333333333333333333333333");
  vi.stubEnv("NEXT_PUBLIC_PYUSD_ADDRESS", "0x4444444444444444444444444444444444444444");
  vi.stubEnv("NEXT_PUBLIC_USDT_REQUIRES_ZERO_APPROVAL", "true");
  vi.stubEnv("NEXT_PUBLIC_ACCEPTANCE_WHITELIST", "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
  for (const symbol of ["USDT", "USDC", "PYUSD"]) {
    for (let vip = 1; vip <= 7; vip++) {
      vi.stubEnv(`NEXT_PUBLIC_${symbol}_VIP${vip}_POOL_ADDRESS`, `0x${String(vip).repeat(40)}`);
    }
  }
}
describe("localized destination pages", () => {
  it("renders the pool workflow in English", () => {
    view(<PoolPage />);
    expect(
      screen.getByRole("heading", { name: "Savings Dashboard" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    fireEvent.click(screen.getByRole("tab", { name: "Plans" }));
    expect(
      screen.getByRole("heading", { name: "Savings Dashboard" })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Account" }));
    expect(
      screen.getByText("Connect your wallet to view account information.")
    ).toBeInTheDocument();
  });
  it("keeps savings plan panel icons behind content and localizes the account action", () => {
    view(<PoolPage />);
    expect(screen.getByTestId("pool-dashboard")).toBeInTheDocument();
    expect(
      screen.getAllByTestId("pool-decorative-icon").length
    ).toBeGreaterThan(0);
    for (const icon of screen.getAllByTestId("pool-decorative-icon")) {
      expect(icon).toHaveClass("pointer-events-none", "z-0");
    }
    fireEvent.click(screen.getByRole("tab", { name: "Plans" }));
    expect(screen.getAllByTestId("pool-decorative-icon")).toHaveLength(2);
    fireEvent.click(screen.getByRole("tab", { name: "Account" }));
    expect(
      screen.getByRole("button", { name: "Connect Wallet" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Start Savings" })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("pool-account-content")).toHaveClass(
      "relative",
      "z-10"
    );
    expect(screen.getByTestId("pool-decorative-icon")).toHaveClass(
      "pointer-events-none",
      "z-0"
    );
    fireEvent.click(screen.getByRole("tab", { name: "Transfer" }));
    expect(screen.getByTestId("pool-transfer-content")).toHaveClass(
      "relative",
      "z-10"
    );
    expect(
      screen.getByRole("button", { name: "Data source not connected" })
    ).toBeDisabled();
    expect(screen.getByTestId("pool-decorative-icon")).toHaveClass(
      "pointer-events-none",
      "z-0"
    );
  });
  it("keeps all savings plan cards bright while making the rewards gift stand out", () => {
    view(<PoolPage />);
    const gift = screen.getByTestId("pool-overview-gift-card");
    expect(gift).toHaveClass(
      "pool-gift-card-bright",
      "border-warning/60",
      "bg-warning/10"
    );
    const overviewIcons = screen.getAllByTestId("pool-decorative-icon");
    expect(overviewIcons[0]).toHaveClass("opacity-60");
    expect(
      overviewIcons
        .slice(1)
        .every((icon) => icon.className.includes("opacity-40"))
    ).toBe(true);
    fireEvent.click(screen.getByRole("tab", { name: "Plans" }));
    for (const icon of screen.getAllByTestId("pool-decorative-icon"))
      expect(icon).toHaveClass("opacity-40");
    fireEvent.click(screen.getByRole("tab", { name: "Account" }));
    expect(screen.getByTestId("pool-decorative-icon")).toHaveClass(
      "opacity-40"
    );
    fireEvent.click(screen.getByRole("tab", { name: "Transfer" }));
    expect(screen.getByTestId("pool-decorative-icon")).toHaveClass(
      "opacity-40"
    );
  });
  it("copies the seven configurable smart-contract plans and multi-asset deposit workflow", () => {
    view(<SavingsPoolPage />);
    expect(screen.getByRole("link", { name: "Back to Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByLabelText("Open mobile menu")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    fireEvent.click(screen.getByRole("tab", { name: "Plan" }));
    const plan = screen.getByTestId("contract-plan-panel");
    expect(
      within(plan).getAllByRole("button", { name: "Smart Contract" })
    ).toHaveLength(7);
    for (let vip = 1; vip <= 7; vip++)
      expect(plan).toHaveTextContent(`VIP${vip}`);
    expect(plan).not.toHaveTextContent("VIP8");
    fireEvent.click(
      within(plan).getAllByRole("button", { name: "Smart Contract" })[0]
    );
    const order = screen.getByRole("dialog", { name: "Order" });
    expect(order).toHaveTextContent("Participants");
    expect(order).toHaveTextContent("Total amount USDC");
    expect(order).toHaveTextContent("Amount Requirement");
    expect(order).toHaveTextContent("1 - 49,999 USDC");
    expect(order).toHaveTextContent("Rate (ETH)");
    expect(order).not.toHaveTextContent("Fixed savings cannot exit before maturity");
    expect(
      within(order).getByPlaceholderText("Not less than 1 USDC")
    ).toBeInTheDocument();
    fireEvent.click(within(order).getByRole("button", { name: "Close order" }));
    fireEvent.click(screen.getByRole("tab", { name: "Deposit" }));
    const deposit = screen.getByTestId("contract-deposit-panel");
    expect(deposit).toHaveTextContent("Connected wallet");
    expect(deposit).toHaveTextContent("Connect wallet first");
    expect(
      within(deposit).queryByRole("button", { name: /Account Balance/ })
    ).not.toBeInTheDocument();
    expect(within(deposit).getByLabelText("Deposit Asset")).toHaveTextContent(
      "Ethereum · USDC"
    );
    expect(within(deposit).getByLabelText("Deposit Asset")).toHaveTextContent(
      "Ethereum · USDT"
    );
    expect(within(deposit).getByLabelText("Deposit Asset")).toHaveTextContent(
      "Ethereum · PYUSD"
    );
    expect(within(deposit).getByLabelText("Deposit Asset")).toHaveTextContent(
      "TRON · USDT"
    );
    expect(within(deposit).getByLabelText("To")).toHaveValue(
      "Temporary Holding Pool"
    );
    expect(
      within(deposit).getByPlaceholderText("Please enter amount")
    ).toBeInTheDocument();
    expect(
      within(deposit).getByRole("button", { name: "Deposit" })
    ).toBeInTheDocument();
    expect(deposit).toHaveTextContent(
      "Funds go directly to an active smart contract"
    );
    expect(deposit).toHaveTextContent(
      "held temporarily until you choose a plan"
    );
    expect(screen.queryByRole("dialog", { name: "From" })).not.toBeInTheDocument();
  });
  it("copies the account exchange withdraw and record details", () => {
    view(<SavingsPoolPage />);
    fireEvent.click(screen.getByRole("tab", { name: "Account" }));
    const account = screen.getByTestId("contract-account-panel");
    expect(account).toHaveTextContent("My Account");
    expect(account).toHaveTextContent("Total output");
    expect(account).toHaveTextContent("Wallet balance");
    expect(account).toHaveTextContent("Exchangeable");
    fireEvent.click(within(account).getByRole("tab", { name: "Exchange" }));
    expect(within(account).getByLabelText("Exchange Asset")).toHaveTextContent(
      "ETH"
    );
    expect(account).toHaveTextContent("Convert all");
    expect(account).toHaveTextContent("Convert ETH commission rewards into USDC");
    fireEvent.click(within(account).getByRole("tab", { name: "Withdraw" }));
    expect(account).toHaveTextContent("Withdrawals are available in USDC only");
    expect(account).toHaveTextContent("Total balance");
    expect(account).toHaveTextContent("minimum withdrawal amount is $1");
    expect(account).toHaveTextContent("cannot exceed 5 times a day");
    fireEvent.click(within(account).getByRole("tab", { name: "Record" }));
    const record = within(account).getByTestId("account-record-panel");
    for (const label of ["Exchange", "Withdraw", "Interest", "Rebate"])
      expect(
        within(record).getByRole("tab", { name: label })
      ).toBeInTheDocument();
    expect(record).toHaveTextContent("Time");
    expect(record).toHaveTextContent("Quantity");
    expect(record).toHaveTextContent("Status");
    expect(record).toHaveTextContent("No content at the moment");
  });
  it("runs local asset approval from the savings deposit button", async () => {
    stubWeb3Env();
    const calls: unknown[] = [];
    Object.defineProperty(window, "ethereum", {
      configurable: true,
      value: {
        request: vi.fn(async (payload: unknown) => {
          calls.push(payload);
          if ((payload as { method: string }).method === "eth_requestAccounts")
            return ["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"];
          if ((payload as { method: string }).method === "eth_sendTransaction")
            return "0xhash";
          return null;
        }),
      },
    });

    view(<SavingsPoolPage />);
    fireEvent.click(screen.getByRole("tab", { name: "Deposit" }));
    const deposit = screen.getByTestId("contract-deposit-panel");
    fireEvent.change(within(deposit).getByLabelText("Deposit Asset"), {
      target: { value: "ethereum-usdt" },
    });
    fireEvent.change(within(deposit).getByLabelText("Amount"), {
      target: { value: "2" },
    });
    fireEvent.click(within(deposit).getByRole("button", { name: "Deposit" }));

    await waitFor(() =>
      expect(calls.map((call) => (call as { method: string }).method)).toEqual([
        "eth_requestAccounts",
        "wallet_switchEthereumChain",
        "eth_sendTransaction",
        "eth_sendTransaction",
      ]),
    );
  });
  it("shows a direct wallet error when the injected provider is not ready", async () => {
    Object.defineProperty(window, "ethereum", {
      configurable: true,
      value: {},
    });

    view(<SavingsPoolPage />);
    fireEvent.click(screen.getByRole("tab", { name: "Deposit" }));
    const deposit = screen.getByTestId("contract-deposit-panel");
    fireEvent.change(within(deposit).getByLabelText("Amount"), {
      target: { value: "10" },
    });
    fireEvent.click(within(deposit).getByRole("button", { name: "Deposit" }));

    expect(screen.getByTestId("deposit-wallet-status")).toHaveTextContent(
      "MetaMask not found",
    );
  });
  it("blocks savings deposits when the connected wallet is not whitelisted", async () => {
    stubWeb3Env();
    vi.stubEnv("NEXT_PUBLIC_ACCEPTANCE_WHITELIST", "");
    const calls: unknown[] = [];
    Object.defineProperty(window, "ethereum", {
      configurable: true,
      value: {
        request: vi.fn(async (payload: unknown) => {
          calls.push(payload);
          if ((payload as { method: string }).method === "eth_requestAccounts")
            return ["0xf39fd6e51aad88f6f4ce6ab8827279cffFb92266"];
          if ((payload as { method: string }).method === "eth_sendTransaction")
            return "0xhash";
          return null;
        }),
      },
    });

    view(<SavingsPoolPage />);
    fireEvent.click(screen.getByRole("tab", { name: "Deposit" }));
    const deposit = screen.getByTestId("contract-deposit-panel");
    fireEvent.change(within(deposit).getByLabelText("Amount"), {
      target: { value: "10" },
    });
    fireEvent.click(within(deposit).getByRole("button", { name: "Deposit" }));

    await waitFor(() =>
      expect(screen.getByTestId("deposit-wallet-status")).toHaveTextContent(
        "Wallet address is not whitelisted",
      ),
    );
    expect(
      calls.some((call) => (call as { method: string }).method === "eth_sendTransaction"),
    ).toBe(false);
  });
  it("renders honest unavailable loan states", () => {
    view(<LoanPage />);
    expect(
      screen.getByRole("heading", { name: "Loan Service" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Download Form" })
    ).toBeDisabled();
    expect(
      screen.getByText("Available after backend integration")
    ).toBeInTheDocument();
  });
  it("shows the retained VIP7 participant demo status", () => {
    view(<SavingsPoolPage />);
    fireEvent.click(screen.getByRole("tab", { name: "Plan" }));
    const plan = screen.getByTestId("contract-plan-panel");
    fireEvent.click(
      within(plan).getAllByRole("button", { name: "Smart Contract" })[6]
    );
    const status = screen.getByRole("dialog", { name: "Contract Status" });
    for (const label of [
      "Contract total amount",
      "Contract completed amount",
      "Contract end date",
      "Contract extra reward",
      "Contract current earnings",
    ])
      expect(status).toHaveTextContent(label);
    expect(status).toHaveTextContent("3,000,000 USDC");
    expect(status).toHaveTextContent("2027-07-11");
    expect(status).toHaveTextContent("0.000000 ETH");
  });
  it("renders verified-document placeholders", () => {
    view(<DocsPage />);
    expect(
      screen.getByRole("heading", { name: "Document Center" })
    ).toBeInTheDocument();
    expect(screen.getByText("Ethereum White Paper")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Pending verification" })
    ).toHaveLength(2);
  });
});
