import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_DEPLOYMENT = "D:\\hb_finance_ganache\\deployments\\local-latest.json";
const projectRoot = resolve(import.meta.dirname, "..");
const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");
const deploymentPath = process.argv.find((arg) => arg.startsWith("--deployment="))?.slice("--deployment=".length) || DEFAULT_DEPLOYMENT;

function assertAddress(value, name) {
  if (typeof value !== "string" || !/^0x[a-fA-F0-9]{40}$/.test(value)) {
    throw new Error(`${name} is not a valid EVM address`);
  }
  return value;
}

function readDeployment() {
  if (!existsSync(deploymentPath)) {
    throw new Error(`Deployment record not found: ${deploymentPath}`);
  }
  return JSON.parse(readFileSync(deploymentPath, "utf8"));
}

function buildEnv(deployment) {
  const symbols = ["USDT", "USDC", "PYUSD"];
  const lines = [
    "# Generated from D:\\hb_finance_ganache\\deployments\\local-latest.json",
    "# Debug-only local Ganache wiring. These token addresses must match the pools below.",
    "NEXT_PUBLIC_WEB3_ENV=local-ganache",
    `NEXT_PUBLIC_EVM_CHAIN_ID=${deployment.network?.chainId || 31337}`,
    `NEXT_PUBLIC_EVM_CHAIN_NAME=${deployment.network?.name || "HB Finance Local Ganache"}`,
    `NEXT_PUBLIC_EVM_RPC_URL=${deployment.rpcUrl || "http://127.0.0.1:8545"}`,
    `NEXT_PUBLIC_ASSET_MANAGER_ADDRESS=${assertAddress(deployment.assetManager?.address, "assetManager.address")}`,
    `NEXT_PUBLIC_LEDGER_ADDRESS=${assertAddress(deployment.ledger?.address, "ledger.address")}`,
    `NEXT_PUBLIC_POOL_FACTORY_ADDRESS=${assertAddress(deployment.factory?.address, "factory.address")}`,
    `NEXT_PUBLIC_USDT_REQUIRES_ZERO_APPROVAL=true`,
  ];

  const whitelistAddress = deployment.mintRecipient || deployment.deployer;
  if (whitelistAddress) {
    lines.push(`NEXT_PUBLIC_ACCEPTANCE_WHITELIST=${assertAddress(whitelistAddress, "acceptanceWhitelist").toLowerCase()}`);
  }

  for (const symbol of symbols) {
    lines.push(`NEXT_PUBLIC_${symbol}_ADDRESS=${assertAddress(deployment.tokens?.[symbol]?.address, `tokens.${symbol}.address`)}`);
  }

  for (const symbol of symbols) {
    const flexible = deployment.pools?.[symbol]?.flexible;
    if (flexible) {
      lines.push(`NEXT_PUBLIC_${symbol}_FLEXIBLE_POOL_ADDRESS=${assertAddress(flexible, `pools.${symbol}.flexible`)}`);
    }
  }
  if (deployment.pools?.USDC?.flexible) {
    lines.push(`NEXT_PUBLIC_FLEXIBLE_POOL_ADDRESS=${assertAddress(deployment.pools.USDC.flexible, "pools.USDC.flexible")}`);
  }

  for (const symbol of symbols) {
    for (let vip = 1; vip <= 7; vip += 1) {
      const key = `VIP${vip}`;
      lines.push(`NEXT_PUBLIC_${symbol}_${key}_POOL_ADDRESS=${assertAddress(deployment.pools?.[symbol]?.fixed?.[key], `pools.${symbol}.fixed.${key}`)}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

function checkFile(path, expected) {
  if (!existsSync(path)) return [`missing: ${path}`];
  const actual = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  return actual === expected ? [] : [`out of sync: ${path}`];
}

const expected = buildEnv(readDeployment());
const targets = [resolve(projectRoot, ".env.local"), resolve(projectRoot, ".env.example")];

if (checkOnly) {
  const failures = targets.flatMap((target) => checkFile(target, expected));
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log("Local Ganache env files match D drive deployment record.");
} else {
  for (const target of targets) {
    writeFileSync(target, expected, "utf8");
  }
  console.log(`Synced ${targets.length} env files from ${deploymentPath}`);
}
