import type { Eip1193Provider } from "./asset-approval";
import { KERNEL_POOL_ADDRESS } from "./kernel-pool";

const SELECTORS = {
  getAccountPositions: "0x98efa01b",
  positions: "0x60f3ce04",
  previewUsdc: "0x83e70e92",
  exchangeFeeBps: "0x91279a01",
  ethRewardOf: "0x8d495c04",
  usdcCreditOf: "0xd550f686",
  balanceOf: "0x70a08231",
};

const INDEPENDENT_POOL_LEDGER =
  process.env.NEXT_PUBLIC_LEDGER_ADDRESS ||
  "0x6d02101c228ed2c83ff05ec12b2ba28805680ebc";

export type PoolPosition = {
  positionId: bigint;
  pool: string;
  token: string;
  amount: bigint;
  createdAt: bigint;
  expiresAt: bigint;
  earnings: bigint;
  settled: boolean;
};

export type PoolBalance = {
  ethCommission: bigint;
  usdc: bigint;
  withdrawable: bigint;
};

export type ExchangePreview = {
  usdcAmount: bigint;
  feeAmount: bigint;
  netAmount: bigint;
  feeBps: number;
};

export async function readUserPositions(
  ethereum: Eip1193Provider,
  userAddress: string,
): Promise<PoolPosition[]> {
  const data = await ethCall(
    ethereum,
    KERNEL_POOL_ADDRESS,
    `${SELECTORS.getAccountPositions}${encodeAddress(userAddress)}`,
  );
  const positionIds = decodeUintArray(data);

  return Promise.all(positionIds.map((positionId) => readPosition(ethereum, positionId)));
}

export async function readPosition(
  ethereum: Eip1193Provider,
  positionId: bigint,
): Promise<PoolPosition> {
  const positionData = await ethCall(ethereum, KERNEL_POOL_ADDRESS, `${SELECTORS.positions}${encodeUint(positionId)}`);

  const words = splitWords(positionData);
  return {
    positionId,
    pool: KERNEL_POOL_ADDRESS,
    token: "",
    amount: BigInt(`0x${words[1]}`),
    createdAt: BigInt(`0x${words[2]}`),
    expiresAt: BigInt(`0x${words[4]}`),
    earnings: BigInt(0),
    settled: BigInt(`0x${words[6]}`) === BigInt(0),
  };
}

export async function readUserBalance(
  ethereum: Eip1193Provider,
  userAddress: string,
): Promise<PoolBalance> {
  const [ethCommission, usdcBalance] = await Promise.all([
    ethCall(ethereum, INDEPENDENT_POOL_LEDGER, `${SELECTORS.ethRewardOf}${encodeAddress(userAddress)}`),
    ethCall(ethereum, INDEPENDENT_POOL_LEDGER, `${SELECTORS.usdcCreditOf}${encodeAddress(userAddress)}`),
  ]);

  return {
    ethCommission: BigInt(ethCommission),
    usdc: BigInt(usdcBalance),
    withdrawable: BigInt(usdcBalance),
  };
}

export async function previewEthToUsdc(
  ethereum: Eip1193Provider,
  ethAmount: bigint,
): Promise<ExchangePreview> {
  const [previewData, feeBpsData] = await Promise.all([
    ethCall(ethereum, INDEPENDENT_POOL_LEDGER, `${SELECTORS.previewUsdc}${encodeUint(ethAmount)}`),
    ethCall(ethereum, INDEPENDENT_POOL_LEDGER, SELECTORS.exchangeFeeBps),
  ]);

  const [gross = BigInt(0), fee = BigInt(0), net = BigInt(0)] = splitWords(previewData).map((word) => BigInt(`0x${word}`));
  return {
    usdcAmount: gross,
    feeAmount: fee,
    netAmount: net,
    feeBps: Number(BigInt(feeBpsData)),
  };
}

export async function waitForTransaction(
  ethereum: Eip1193Provider,
  txHash: string,
  maxAttempts = 120,
  intervalMs = 1000,
): Promise<{ status: string; blockNumber: string } | null> {
  for (let i = 0; i < maxAttempts; i += 1) {
    const receipt = await ethereum.request<{ status?: string; blockNumber?: string } | null>({
      method: "eth_getTransactionReceipt",
      params: [txHash],
    });

    if (receipt?.blockNumber && receipt.status) {
      return { status: receipt.status, blockNumber: receipt.blockNumber };
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return null;
}

export function buildClaimPositionCalldata(positionId: bigint): string {
  return `0xaab8ab0c${encodeUint(positionId)}`;
}

export function buildExchangeEthCalldata(ethAmount: bigint): string {
  return `0xed2381f3${encodeUint(ethAmount)}`;
}

export function buildWithdrawCalldata(usdcAmount: bigint): string {
  return `0x5b06dece${encodeUint(usdcAmount)}`;
}

async function ethCall(ethereum: Eip1193Provider, to: string, data: string): Promise<string> {
  return ethereum.request<string>({ method: "eth_call", params: [{ to, data }, "latest"] });
}

function encodeAddress(address: string): string {
  return address.toLowerCase().replace(/^0x/, "").padStart(64, "0");
}

function encodeUint(value: bigint): string {
  return value.toString(16).padStart(64, "0");
}

function decodeUintArray(data: string): bigint[] {
  const words = splitWords(data);
  const offset = Number(BigInt(`0x${words[0]}`) / BigInt(32));
  const length = Number(BigInt(`0x${words[offset]}`));
  return words.slice(offset + 1, offset + 1 + length).map((word) => BigInt(`0x${word}`));
}

function splitWords(data: string): string[] {
  const hex = data.replace(/^0x/, "");
  return Array.from({ length: hex.length / 64 }, (_, i) => hex.slice(i * 64, (i + 1) * 64));
}
