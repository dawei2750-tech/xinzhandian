import { describe, expect, it, vi } from "vitest";
import {
  approveAssetTransfer,
  encodeApprove,
  encodeOpenFixed,
  getAssetManagerConfig,
  parseTokenAmount,
} from "@/lib/asset-manager-client";

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

describe("asset manager frontend client", () => {
  it("reads local Ganache environment from NEXT_PUBLIC variables", () => {
    stubWeb3Env();

    const config = getAssetManagerConfig();

    expect(config.environment).toBe("local");
    expect(config.chainId).toBe(31337);
    expect(config.chainIdHex).toBe("0x7a69");
    expect(config.rpcUrl).toBe("http://127.0.0.1:8545");
    expect(config.tokens.USDT.requiresZeroApproval).toBe(true);
    expect(config.pools.USDC.VIP7).toBe("0x7777777777777777777777777777777777777777");
  });

  it("blocks wallet actions when the acceptance whitelist is not configured", async () => {
    stubWeb3Env();
    vi.stubEnv("NEXT_PUBLIC_ACCEPTANCE_WHITELIST", "");
    const ethereum = {
      request: vi.fn(async (payload: unknown) => {
        if ((payload as { method: string }).method === "eth_requestAccounts") {
          return ["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"];
        }
        return null;
      }),
    };

    await expect(
      approveAssetTransfer({ ethereum, asset: "USDC", amount: "2" }),
    ).rejects.toThrow("Wallet address is not whitelisted");

    expect(ethereum.request).toHaveBeenCalledTimes(1);
  });

  it("blocks wallet actions when the connected address is not on the acceptance whitelist", async () => {
    stubWeb3Env();
    vi.stubEnv("NEXT_PUBLIC_ACCEPTANCE_WHITELIST", "0x9999999999999999999999999999999999999999");
    const ethereum = {
      request: vi.fn(async (payload: unknown) => {
        if ((payload as { method: string }).method === "eth_requestAccounts") {
          return ["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"];
        }
        return null;
      }),
    };

    await expect(
      approveAssetTransfer({ ethereum, asset: "USDC", amount: "2" }),
    ).rejects.toThrow("Wallet address is not whitelisted");

    expect(ethereum.request).toHaveBeenCalledTimes(1);
  });

  it("encodes ERC20 approve calls and parses token decimals", () => {
    expect(parseTokenAmount("1.25", 6)).toBe(1250000n);
    expect(parseTokenAmount("1.25", 18)).toBe(1250000000000000000n);
    expect(encodeApprove("0x1111111111111111111111111111111111111111", 1n)).toBe(
      "0x095ea7b300000000000000000000000011111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000001",
    );
    expect(encodeOpenFixed(1n, 7)).toBe(
      "0x1801d0df00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000007",
    );
  });

  it("switches chain and clears USDT allowance before setting the new amount", async () => {
    stubWeb3Env();
    const calls: unknown[] = [];
    const ethereum = {
      request: vi.fn(async (payload: unknown) => {
        calls.push(payload);
        if ((payload as { method: string }).method === "eth_requestAccounts") {
          return ["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"];
        }
        if ((payload as { method: string }).method === "eth_sendTransaction") return "0xhash";
        return null;
      }),
    };

    const result = await approveAssetTransfer({ ethereum, asset: "USDT", amount: "2" });

    expect(result.account).toBe("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
    expect(calls.map((call) => (call as { method: string }).method)).toEqual([
      "eth_requestAccounts",
      "wallet_switchEthereumChain",
      "eth_sendTransaction",
      "eth_sendTransaction",
    ]);
  });
});
