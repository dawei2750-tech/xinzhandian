export type AssetSymbol = "USDT" | "USDC" | "PYUSD";
export type VipPlanName = "VIP1" | "VIP2" | "VIP3" | "VIP4" | "VIP5" | "VIP6" | "VIP7";

type EthereumProvider = {
  request: (payload: { method: string; params?: unknown[] }) => Promise<unknown>;
};

type TokenConfig = {
  address: string;
  decimals: number;
  requiresZeroApproval: boolean;
};

export type AssetManagerConfig = {
  environment: string;
  chainId: number;
  chainIdHex: string;
  chainName: string;
  rpcUrl: string;
  spender: string;
  tokens: Record<AssetSymbol, TokenConfig>;
  pools: Record<AssetSymbol, Record<VipPlanName, string>>;
  ledger: string;
  acceptanceWhitelist: string[];
};

export function getAssetManagerConfig(): AssetManagerConfig {
  const chainId = Number(process.env.NEXT_PUBLIC_EVM_CHAIN_ID || "31337");
  const zeroApproval = process.env.NEXT_PUBLIC_USDT_REQUIRES_ZERO_APPROVAL !== "false";
  return {
    environment: process.env.NEXT_PUBLIC_WEB3_ENV || "local",
    chainId,
    chainIdHex: `0x${chainId.toString(16)}`,
    chainName: process.env.NEXT_PUBLIC_EVM_CHAIN_NAME || "HB Finance Local Ganache",
    rpcUrl: process.env.NEXT_PUBLIC_EVM_RPC_URL || "http://127.0.0.1:8545",
    spender: requireAddress(process.env.NEXT_PUBLIC_ASSET_MANAGER_ADDRESS, "NEXT_PUBLIC_ASSET_MANAGER_ADDRESS"),
    ledger: requireAddress(process.env.NEXT_PUBLIC_LEDGER_ADDRESS, "NEXT_PUBLIC_LEDGER_ADDRESS"),
    tokens: {
      USDT: {
        address: requireAddress(process.env.NEXT_PUBLIC_USDT_ADDRESS, "NEXT_PUBLIC_USDT_ADDRESS"),
        decimals: 6,
        requiresZeroApproval: zeroApproval,
      },
      USDC: {
        address: requireAddress(process.env.NEXT_PUBLIC_USDC_ADDRESS, "NEXT_PUBLIC_USDC_ADDRESS"),
        decimals: 6,
        requiresZeroApproval: false,
      },
      PYUSD: {
        address: requireAddress(process.env.NEXT_PUBLIC_PYUSD_ADDRESS, "NEXT_PUBLIC_PYUSD_ADDRESS"),
        decimals: 18,
        requiresZeroApproval: false,
      },
    },
    pools: {
      USDT: readVipPools("USDT"),
      USDC: readVipPools("USDC"),
      PYUSD: readVipPools("PYUSD"),
    },
    acceptanceWhitelist: readAcceptanceWhitelist(),
  };
}

export function parseTokenAmount(value: string, decimals: number): bigint {
  const trimmed = value.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) throw new Error("Invalid amount");
  const [whole, fraction = ""] = trimmed.split(".");
  if (fraction.length > decimals) throw new Error("Too many decimal places");
  return BigInt(whole) * BigInt(10) ** BigInt(decimals) + BigInt((fraction + "0".repeat(decimals)).slice(0, decimals) || "0");
}

export function encodeApprove(spender: string, amount: bigint): string {
  return `0x095ea7b3${encodeAddress(spender)}${encodeUint256(amount)}`;
}

export function encodeOpenFixed(principal: bigint, termDays: number): string {
  return `0x1801d0df${encodeUint256(principal)}${encodeUint256(BigInt(termDays))}`;
}

export function encodeBalanceOf(owner: string): string {
  return `0x70a08231${encodeAddress(owner)}`;
}

export function formatTokenAmount(value: bigint, decimals: number): string {
  const base = BigInt(10) ** BigInt(decimals);
  const whole = value / base;
  const fraction = value % base;
  const trimmedFraction = fraction.toString().padStart(decimals, "0").replace(/0+$/, "");
  return trimmedFraction ? `${whole}.${trimmedFraction}` : whole.toString();
}

export async function readLocalAssetBalances({
  ethereum,
}: {
  ethereum: EthereumProvider;
}) {
  const config = getAssetManagerConfig();
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const account = Array.isArray(accounts) && typeof accounts[0] === "string" ? accounts[0] : "";
  if (!account) throw new Error("Wallet account not found");
  ensureWhitelisted(account, config);
  await ensureWalletChain(ethereum, config);
  const balances = {} as Record<AssetSymbol, string>;
  for (const symbol of Object.keys(config.tokens) as AssetSymbol[]) {
    const token = config.tokens[symbol];
    const raw = await ethereum.request({
      method: "eth_call",
      params: [{ to: token.address, data: encodeBalanceOf(account) }, "latest"],
    });
    if (typeof raw !== "string") throw new Error(`${symbol} balance was not returned`);
    balances[symbol] = formatTokenAmount(BigInt(raw), token.decimals);
  }
  return { account, balances };
}

export async function approveAssetTransfer({
  ethereum,
  asset,
  amount,
}: {
  ethereum: EthereumProvider;
  asset: AssetSymbol;
  amount: string;
}) {
  const config = getAssetManagerConfig();
  const token = config.tokens[asset];
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const account = Array.isArray(accounts) && typeof accounts[0] === "string" ? accounts[0] : "";
  if (!account) throw new Error("Wallet account not found");
  ensureWhitelisted(account, config);
  await ensureWalletChain(ethereum, config);
  const rawAmount = parseTokenAmount(amount, token.decimals);
  const hashes: string[] = [];
  if (token.requiresZeroApproval) {
    hashes.push(await sendApprove(ethereum, account, token.address, config.spender, BigInt(0)));
  }
  hashes.push(await sendApprove(ethereum, account, token.address, config.spender, rawAmount));
  return { account, asset, amount: rawAmount.toString(), hashes };
}

export async function openFixedSavingsPosition({
  ethereum,
  asset,
  plan,
  amount,
  termDays = 7,
}: {
  ethereum: EthereumProvider;
  asset: AssetSymbol;
  plan: VipPlanName;
  amount: string;
  termDays?: number;
}) {
  const config = getAssetManagerConfig();
  const token = config.tokens[asset];
  const pool = requireAddress(config.pools[asset][plan], `${asset}_${plan}_POOL_ADDRESS`);
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const account = Array.isArray(accounts) && typeof accounts[0] === "string" ? accounts[0] : "";
  if (!account) throw new Error("Wallet account not found");
  ensureWhitelisted(account, config);
  await ensureWalletChain(ethereum, config);
  const rawAmount = parseTokenAmount(amount, token.decimals);
  const hashes: string[] = [];
  if (token.requiresZeroApproval) hashes.push(await sendApprove(ethereum, account, token.address, pool, BigInt(0)));
  hashes.push(await sendApprove(ethereum, account, token.address, pool, rawAmount));
  const openHash = await ethereum.request({
    method: "eth_sendTransaction",
    params: [{ from: account, to: pool, data: encodeOpenFixed(rawAmount, termDays) }],
  });
  if (typeof openHash !== "string") throw new Error("Deposit transaction was not sent");
  hashes.push(openHash);
  return { account, asset, plan, pool, amount: rawAmount.toString(), hashes };
}

async function ensureWalletChain(ethereum: EthereumProvider, config: AssetManagerConfig) {
  try {
    await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: config.chainIdHex }] });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? (error as { code: number }).code : 0;
    if (code !== 4902) throw error;
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: config.chainIdHex,
        chainName: config.chainName,
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: [config.rpcUrl],
      }],
    });
  }
}

async function sendApprove(
  ethereum: EthereumProvider,
  from: string,
  tokenAddress: string,
  spender: string,
  amount: bigint,
) {
  const hash = await ethereum.request({
    method: "eth_sendTransaction",
    params: [{ from, to: tokenAddress, data: encodeApprove(spender, amount) }],
  });
  if (typeof hash !== "string") throw new Error("Approval transaction was not sent");
  return hash;
}

function requireAddress(value: string | undefined, name: string) {
  if (!value || !/^0x[a-fA-F0-9]{40}$/.test(value)) throw new Error(`${name} is not configured`);
  return value;
}

function readVipPools(symbol: AssetSymbol): Record<VipPlanName, string> {
  const pools: Record<AssetSymbol, Record<VipPlanName, string | undefined>> = {
    USDT: {
      VIP1: process.env.NEXT_PUBLIC_USDT_VIP1_POOL_ADDRESS,
      VIP2: process.env.NEXT_PUBLIC_USDT_VIP2_POOL_ADDRESS,
      VIP3: process.env.NEXT_PUBLIC_USDT_VIP3_POOL_ADDRESS,
      VIP4: process.env.NEXT_PUBLIC_USDT_VIP4_POOL_ADDRESS,
      VIP5: process.env.NEXT_PUBLIC_USDT_VIP5_POOL_ADDRESS,
      VIP6: process.env.NEXT_PUBLIC_USDT_VIP6_POOL_ADDRESS,
      VIP7: process.env.NEXT_PUBLIC_USDT_VIP7_POOL_ADDRESS,
    },
    USDC: {
      VIP1: process.env.NEXT_PUBLIC_USDC_VIP1_POOL_ADDRESS,
      VIP2: process.env.NEXT_PUBLIC_USDC_VIP2_POOL_ADDRESS,
      VIP3: process.env.NEXT_PUBLIC_USDC_VIP3_POOL_ADDRESS,
      VIP4: process.env.NEXT_PUBLIC_USDC_VIP4_POOL_ADDRESS,
      VIP5: process.env.NEXT_PUBLIC_USDC_VIP5_POOL_ADDRESS,
      VIP6: process.env.NEXT_PUBLIC_USDC_VIP6_POOL_ADDRESS,
      VIP7: process.env.NEXT_PUBLIC_USDC_VIP7_POOL_ADDRESS,
    },
    PYUSD: {
      VIP1: process.env.NEXT_PUBLIC_PYUSD_VIP1_POOL_ADDRESS,
      VIP2: process.env.NEXT_PUBLIC_PYUSD_VIP2_POOL_ADDRESS,
      VIP3: process.env.NEXT_PUBLIC_PYUSD_VIP3_POOL_ADDRESS,
      VIP4: process.env.NEXT_PUBLIC_PYUSD_VIP4_POOL_ADDRESS,
      VIP5: process.env.NEXT_PUBLIC_PYUSD_VIP5_POOL_ADDRESS,
      VIP6: process.env.NEXT_PUBLIC_PYUSD_VIP6_POOL_ADDRESS,
      VIP7: process.env.NEXT_PUBLIC_PYUSD_VIP7_POOL_ADDRESS,
    },
  };
  return {
    VIP1: requireAddress(pools[symbol].VIP1, `NEXT_PUBLIC_${symbol}_VIP1_POOL_ADDRESS`),
    VIP2: requireAddress(pools[symbol].VIP2, `NEXT_PUBLIC_${symbol}_VIP2_POOL_ADDRESS`),
    VIP3: requireAddress(pools[symbol].VIP3, `NEXT_PUBLIC_${symbol}_VIP3_POOL_ADDRESS`),
    VIP4: requireAddress(pools[symbol].VIP4, `NEXT_PUBLIC_${symbol}_VIP4_POOL_ADDRESS`),
    VIP5: requireAddress(pools[symbol].VIP5, `NEXT_PUBLIC_${symbol}_VIP5_POOL_ADDRESS`),
    VIP6: requireAddress(pools[symbol].VIP6, `NEXT_PUBLIC_${symbol}_VIP6_POOL_ADDRESS`),
    VIP7: requireAddress(pools[symbol].VIP7, `NEXT_PUBLIC_${symbol}_VIP7_POOL_ADDRESS`),
  };
}

function readAcceptanceWhitelist() {
  return (process.env.NEXT_PUBLIC_ACCEPTANCE_WHITELIST || "")
    .split(/[\s,;]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function ensureWhitelisted(account: string, config: AssetManagerConfig) {
  const normalized = account.toLowerCase();
  if (!config.acceptanceWhitelist.includes(normalized)) {
    throw new Error("Wallet address is not whitelisted");
  }
}

function encodeAddress(address: string) {
  return requireAddress(address, "address").slice(2).toLowerCase().padStart(64, "0");
}

function encodeUint256(value: bigint) {
  if (value < BigInt(0)) throw new Error("Invalid uint256");
  return value.toString(16).padStart(64, "0");
}
