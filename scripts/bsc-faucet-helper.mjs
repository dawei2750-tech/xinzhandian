import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const projectRoot = resolve(import.meta.dirname, "..");
const defaultEnvPath = resolve(projectRoot, ".env.bsc-testnet.local");

export function getBscFaucetUrls() {
  return [
    "https://docs.bnbchain.org/bnb-smart-chain/developers/faucet/",
    "https://faucet.quicknode.com/binance-smart-chain/bnb-testnet",
    "https://faucet.chainstack.com/bnb-testnet-faucet",
    "https://faucets.chain.link/bnb-chain-testnet",
  ];
}

export function normalizeFaucetConfig(env) {
  const rpcUrl = env.BSC_TESTNET_RPC_URL || "https://bsc-testnet.drpc.org";
  const address = env.BSC_FAUCET_ADDRESS || "";
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error("BSC_FAUCET_ADDRESS must be a valid 0x address");
  }
  const pollSeconds = Math.max(10, Number(env.BSC_FAUCET_POLL_SECONDS || "30"));
  const minBalanceWei = parseDecimalToWei(env.BSC_FAUCET_MIN_TBNB || "0.05", 18);
  return { rpcUrl, address, pollSeconds, minBalanceWei };
}

export function formatBnb(value) {
  const base = 10n ** 18n;
  const whole = value / base;
  const fraction = (value % base).toString().padStart(18, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

export async function readBnbBalanceWei(rpcUrl, address) {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBalance",
      params: [address, "latest"],
    }),
  });
  if (!response.ok) throw new Error(`RPC request failed: ${response.status}`);
  const body = await response.json();
  if (body.error) throw new Error(body.error.message || "RPC returned an error");
  if (typeof body.result !== "string") throw new Error("RPC balance result missing");
  return BigInt(body.result);
}

export async function deriveAddressFromPrivateKey(privateKey) {
  const ethers = await loadEthers();
  return new ethers.Wallet(normalizePrivateKey(privateKey)).address;
}

async function main() {
  loadLocalEnv(defaultEnvPath);
  if (!process.env.BSC_FAUCET_ADDRESS && process.env.BSC_DEPLOYER_PRIVATE_KEY) {
    process.env.BSC_FAUCET_ADDRESS = await deriveAddressFromPrivateKey(process.env.BSC_DEPLOYER_PRIVATE_KEY);
  }
  const config = normalizeFaucetConfig(process.env);
  const balance = await readBnbBalanceWei(config.rpcUrl, config.address);
  console.log(`BSC Testnet address: ${config.address}`);
  console.log(`Current balance: ${formatBnb(balance)} tBNB`);
  if (balance >= config.minBalanceWei) {
    console.log("Balance is enough for deployment.");
    return;
  }
  copyToClipboard(config.address);
  console.log("Address copied to clipboard.");
  openFaucets();
  if (process.argv.includes("--once")) {
    console.log("Faucets opened. Re-run without --once to keep watching for balance.");
    return;
  }
  console.log(`Waiting for at least ${formatBnb(config.minBalanceWei)} tBNB. Polling every ${config.pollSeconds}s.`);
  for (;;) {
    await sleep(config.pollSeconds * 1000);
    const next = await readBnbBalanceWei(config.rpcUrl, config.address);
    console.log(`Balance: ${formatBnb(next)} tBNB`);
    if (next >= config.minBalanceWei) {
      console.log("tBNB received. You can run: npm run deploy:bsc:test-tokens");
      return;
    }
  }
}

function loadLocalEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function openFaucets() {
  for (const url of getBscFaucetUrls()) {
    spawnSync("powershell.exe", ["-NoProfile", "-Command", "Start-Process", url], {
      stdio: "ignore",
      windowsHide: true,
    });
  }
}

function copyToClipboard(value) {
  spawnSync("powershell.exe", ["-NoProfile", "-Command", "Set-Clipboard", "-Value", value], {
    stdio: "ignore",
    windowsHide: true,
  });
}

function parseDecimalToWei(value, decimals) {
  const normalized = value.trim();
  if (!/^\d+(\.\d+)?$/.test(normalized)) throw new Error("Invalid decimal amount");
  const [whole, fraction = ""] = normalized.split(".");
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt((fraction + "0".repeat(decimals)).slice(0, decimals));
}

function normalizePrivateKey(value) {
  const trimmed = value?.trim();
  if (!trimmed) throw new Error("BSC_DEPLOYER_PRIVATE_KEY is empty");
  if (/^0x[a-fA-F0-9]{64}$/.test(trimmed)) return trimmed;
  if (/^[a-fA-F0-9]{64}$/.test(trimmed)) return `0x${trimmed}`;
  throw new Error("BSC_DEPLOYER_PRIVATE_KEY must be 64 hex characters, with or without 0x");
}

async function loadEthers() {
  try {
    return await import("ethers");
  } catch {
    return import(pathToFileURL("D:\\hb_finance_ganache\\node_modules\\ethers\\lib.esm\\index.js").href);
  }
}

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
