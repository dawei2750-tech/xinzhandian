import type { Eip1193Provider } from "./asset-approval";
import { waitForTransaction } from "./pool-integration";

export type TransactionResult = {
  txHash: string;
  receipt: { status: string; blockNumber: string } | null;
  success: boolean;
};

export async function sendTransactionAndWait(
  ethereum: Eip1193Provider,
  from: string,
  to: string,
  data: string,
): Promise<TransactionResult> {
  const txHash = await ethereum.request<string>({
    method: "eth_sendTransaction",
    params: [{ from, to, data }],
  });

  if (!txHash) throw new Error("No transaction hash returned");

  const receipt = await waitForTransaction(ethereum, txHash);
  if (!receipt) throw new Error("Transaction timeout");

  return { txHash, receipt, success: receipt.status === "0x1" };
}

export async function handleApprovalTransaction(
  ethereum: Eip1193Provider,
  from: string,
  tokenAddress: string,
  data: string,
  onProgress?: (status: string) => void,
): Promise<TransactionResult> {
  onProgress?.("Sending approval transaction...");
  const result = await sendTransactionAndWait(ethereum, from, tokenAddress, data);
  if (result.success) onProgress?.("Approval confirmed!");
  return result;
}

export async function handleDepositTransaction(
  ethereum: Eip1193Provider,
  from: string,
  poolAddress: string,
  data: string,
  onProgress?: (status: string) => void,
): Promise<TransactionResult> {
  onProgress?.("Depositing to pool...");
  const result = await sendTransactionAndWait(ethereum, from, poolAddress, data);
  if (result.success) onProgress?.("Deposit confirmed!");
  return result;
}

export async function handleClaimTransaction(
  ethereum: Eip1193Provider,
  from: string,
  poolAddress: string,
  data: string,
  onProgress?: (status: string) => void,
): Promise<TransactionResult> {
  onProgress?.("Claiming position...");
  const result = await sendTransactionAndWait(ethereum, from, poolAddress, data);
  if (result.success) onProgress?.("Position claimed!");
  return result;
}
