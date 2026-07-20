import { describe, expect, it, vi } from "vitest";
import { buildClaimPositionCalldata, buildExchangeEthCalldata } from "@/lib/pool-integration";
import { sendTransactionAndWait } from "@/lib/transaction-handler";

describe("local pool integration helpers", () => {
  it("encodes claim and exchange calldata for local pool actions", () => {
    expect(buildClaimPositionCalldata(BigInt(7))).toBe(
      "0xaab8ab0c0000000000000000000000000000000000000000000000000000000000000007",
    );
    expect(buildExchangeEthCalldata(BigInt(3))).toBe(
      "0xed2381f30000000000000000000000000000000000000000000000000000000000000003",
    );
  });

  it("waits for transaction receipts after sending wallet transactions", async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce("0xabc")
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ status: "0x1", blockNumber: "0x2" });

    const result = await sendTransactionAndWait(
      { request },
      "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      "0x1111111111111111111111111111111111111111",
      "0x1234",
    );

    expect(result).toEqual({
      txHash: "0xabc",
      receipt: { status: "0x1", blockNumber: "0x2" },
      success: true,
    });
    expect(request).toHaveBeenCalledTimes(3);
  });
});
