import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const projectRoot = resolve(import.meta.dirname, "..");
const envPath = resolve(projectRoot, ".env.example");
const targets = ["production", "preview"];
const managedKeys = [
  "NEXT_PUBLIC_WEB3_ENV",
  "NEXT_PUBLIC_EVM_CHAIN_ID",
  "NEXT_PUBLIC_EVM_CHAIN_NAME",
  "NEXT_PUBLIC_EVM_RPC_URL",
  "NEXT_PUBLIC_USDT_ADDRESS",
  "NEXT_PUBLIC_USDC_ADDRESS",
  "NEXT_PUBLIC_PYUSD_ADDRESS",
  "NEXT_PUBLIC_ASSET_MANAGER_ADDRESS",
  "NEXT_PUBLIC_TARGET_VAULT_ADDRESS",
  "NEXT_PUBLIC_LEDGER_ADDRESS",
  "NEXT_PUBLIC_POOL_FACTORY_ADDRESS",
  "NEXT_PUBLIC_ETH_USD_FEED_ADDRESS",
  "NEXT_PUBLIC_USDT_REQUIRES_ZERO_APPROVAL",
  "NEXT_PUBLIC_ACCEPTANCE_WHITELIST",
  "NEXT_PUBLIC_FLEXIBLE_POOL_ADDRESS",
  "NEXT_PUBLIC_USDT_FLEXIBLE_POOL_ADDRESS",
  "NEXT_PUBLIC_USDC_FLEXIBLE_POOL_ADDRESS",
  "NEXT_PUBLIC_PYUSD_FLEXIBLE_POOL_ADDRESS",
  ...["USDT", "USDC", "PYUSD"].flatMap((symbol) =>
    Array.from({ length: 7 }, (_, index) => `NEXT_PUBLIC_${symbol}_VIP${index + 1}_POOL_ADDRESS`),
  ),
];

function readEnv(path) {
  return readFileSync(path, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      if (index === -1) throw new Error(`Invalid env line: ${line}`);
      return [line.slice(0, index), line.slice(index + 1)];
    })
    .filter(([, value]) => value !== "");
}

function runVercel(args, options = {}) {
  const result = spawnSync("vercel", args, {
    cwd: projectRoot,
    encoding: "utf8",
    shell: true,
    ...options,
  });
  return result;
}

function requireSuccess(result, label) {
  if (result.status === 0) return;
  const stderr = result.stderr?.trim();
  const stdout = result.stdout?.trim();
  throw new Error(`${label} failed\n${stderr || stdout || "No output"}`);
}

const entries = readEnv(envPath);

for (const target of targets) {
  console.log(`Syncing ${entries.length} variables to Vercel ${target}`);
  for (const key of managedKeys) {
    runVercel(["env", "rm", key, target, "--yes"]);
  }
  for (const [key, value] of entries) {
    const add = runVercel(["env", "add", key, target], { input: `${value}\n` });
    requireSuccess(add, `vercel env add ${key} ${target}`);
    console.log(`  ${key}`);
  }
}

console.log("Vercel env sync complete.");
