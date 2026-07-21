import { describe, expect, it } from "vitest";
import {
  formatBnb,
  getBscFaucetUrls,
  normalizeFaucetConfig,
} from "../../scripts/bsc-faucet-helper.mjs";

describe("BSC faucet helper", () => {
  it("normalizes a configured faucet address and polling interval", () => {
    const config = normalizeFaucetConfig({
      BSC_TESTNET_RPC_URL: "https://bsc-testnet.drpc.org",
      BSC_FAUCET_ADDRESS: "0x37CDc311C2035001FA794DB3D733316CE3a3F9e7",
      BSC_FAUCET_POLL_SECONDS: "15",
      BSC_FAUCET_MIN_TBNB: "0.05",
    });

    expect(config).toEqual({
      rpcUrl: "https://bsc-testnet.drpc.org",
      address: "0x37CDc311C2035001FA794DB3D733316CE3a3F9e7",
      pollSeconds: 15,
      minBalanceWei: 50000000000000000n,
    });
  });

  it("formats wei balances as readable tBNB values", () => {
    expect(formatBnb(0n)).toBe("0");
    expect(formatBnb(123456789000000000n)).toBe("0.123456789");
    expect(formatBnb(1000000000000000000n)).toBe("1");
  });

  it("keeps official and common faucet URLs available", () => {
    expect(getBscFaucetUrls()).toEqual([
      "https://docs.bnbchain.org/bnb-smart-chain/developers/faucet/",
      "https://faucet.quicknode.com/binance-smart-chain/bnb-testnet",
      "https://faucet.chainstack.com/bnb-testnet-faucet",
      "https://faucets.chain.link/bnb-chain-testnet",
    ]);
  });
});
