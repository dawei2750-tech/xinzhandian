import type { Eip1193Provider } from "./asset-approval";
import { INDEPENDENT_POOL_FACTORY } from "./independent-pool-control";

const SELECTORS = {
  getPools: "0x673a2a1f",
  tiers: "0xd1d79974",
};

export type VIPPoolConfig = {
  poolId: number;
  name: string;
  address: string;
  minimumAmount: bigint;
  interestRate: number;
  enabled: boolean;
};

export async function readVIPPoolConfigs(
  ethereum: Eip1193Provider,
  poolAddresses: string[],
): Promise<VIPPoolConfig[]> {
  return Promise.all(
    poolAddresses.map(async (address, index) => {
      const tierData = await ethCall(ethereum, address, `${SELECTORS.tiers}${encodeUint(BigInt(1))}`);
      const words = splitWords(tierData);

      return {
        poolId: index + 1,
        name: `VIP${index + 1}`,
        address,
        minimumAmount: BigInt(`0x${words[0]}`),
        interestRate: Number(BigInt(`0x${words[2]}`)) / 10000,
        enabled: BigInt(`0x${words[3]}`) !== BigInt(0),
      };
    }),
  );
}

export async function readAllFixedPoolConfigs(ethereum: Eip1193Provider): Promise<VIPPoolConfig[]> {
  const poolAddressesRaw = await ethCall(ethereum, INDEPENDENT_POOL_FACTORY, SELECTORS.getPools);
  const addresses = decodeAddressArray(poolAddressesRaw);
  return readVIPPoolConfigs(ethereum, addresses.slice(1));
}

async function ethCall(ethereum: Eip1193Provider, to: string, data: string): Promise<string> {
  return ethereum.request<string>({
    method: "eth_call",
    params: [{ to, data }, "latest"],
  });
}

function decodeAddressArray(data: string): string[] {
  const words = splitWords(data);
  const offset = Number(BigInt(`0x${words[0]}`) / BigInt(32));
  const length = Number(BigInt(`0x${words[offset]}`));
  return words.slice(offset + 1, offset + 1 + length).map((word) => `0x${word.slice(-40)}`);
}

function encodeUint(value: bigint): string {
  return value.toString(16).padStart(64, "0");
}

function splitWords(data: string): string[] {
  const hex = data.replace(/^0x/, "");
  return Array.from({ length: hex.length / 64 }, (_, i) => hex.slice(i * 64, (i + 1) * 64));
}
