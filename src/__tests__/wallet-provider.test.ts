import { describe, expect, it, vi } from "vitest";
import { detectEvmWalletProviders, getPreferredEvmProvider } from "@/lib/wallet-provider";

function provider(flags: Record<string, boolean>) {
  return { request: vi.fn(), ...flags };
}

describe("wallet provider detection", () => {
  it("detects the integrated wallet set with MetaMask first", () => {
    const providers = [
      provider({ isCoinbaseWallet: true }),
      provider({ isOkxWallet: true }),
      provider({ isMetaMask: true }),
      provider({ isTrust: true }),
      provider({ isBitKeep: true }),
      provider({ isTokenPocket: true }),
      provider({ isRabby: true }),
      provider({ isBinance: true }),
    ];

    const detected = detectEvmWalletProviders({ ethereum: { providers } });

    expect(detected.map((item) => item.name)).toEqual([
      "MetaMask",
      "Coinbase Wallet",
      "OKX Wallet",
      "Trust Wallet",
      "Bitget Wallet",
      "TokenPocket",
      "Rabby Wallet",
      "Binance Wallet",
    ]);
  });

  it("detects the nine integrated wallet providers instead of excluding supported wallets", () => {
    const providers = [
      provider({ isCoinbaseWallet: true }),
      provider({ isOkxWallet: true }),
      provider({ isMetaMask: true }),
      provider({ isTrust: true }),
      provider({ isBitKeep: true }),
      provider({ isTokenPocket: true }),
      provider({ isRabby: true }),
      provider({ isBinance: true }),
      provider({}),
    ];

    const detected = detectEvmWalletProviders({ ethereum: { providers } });

    expect(detected.map((item) => item.name)).toEqual([
      "MetaMask",
      "Coinbase Wallet",
      "OKX Wallet",
      "Trust Wallet",
      "Bitget Wallet",
      "TokenPocket",
      "Rabby Wallet",
      "Binance Wallet",
      "EVM Wallet",
    ]);
  });

  it("prefers MetaMask and can fall back to a generic EVM wallet", () => {
    const generic = provider({});
    const metamask = provider({ isMetaMask: true });
    const okx = provider({ isOkxWallet: true });

    expect(getPreferredEvmProvider({ ethereum: { providers: [generic, okx, metamask] } })?.name).toBe("MetaMask");
    expect(getPreferredEvmProvider({ ethereum: generic })?.name).toBe("EVM Wallet");
  });
});
