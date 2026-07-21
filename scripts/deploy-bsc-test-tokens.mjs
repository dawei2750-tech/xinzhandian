import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = resolve(import.meta.dirname, "..");
const artifactPath = "D:\\hb_finance_ganache\\artifacts\\PublicMintERC20.json";
loadLocalEnv(resolve(projectRoot, ".env.bsc-testnet.local"));

const ethers = await loadEthers();
const { Contract, ContractFactory, JsonRpcProvider, Wallet, formatUnits, parseUnits } = ethers;

const rpcUrl = process.env.BSC_TESTNET_RPC_URL || "https://bsc-testnet.drpc.org";
const privateKey = normalizePrivateKey(process.env.BSC_DEPLOYER_PRIVATE_KEY);
const recipient =
  process.env.BSC_TOKEN_RECIPIENT ||
  process.env.BSC_MINT_RECIPIENT ||
  "0xeb95f8399d8e265fc71008dD8285E1fb8207EF2e";
const mintAmount =
  process.env.BSC_TOKEN_MINT_AMOUNT ||
  process.env.BSC_MINT_AMOUNT ||
  "100000";

const tokens = [
  { key: "USDT", name: "Test USDT", symbol: "USDT", decimals: 6 },
  { key: "USDC", name: "Test USDC", symbol: "USDC", decimals: 6 },
  { key: "PYUSD", name: "Test PYUSD", symbol: "PYUSD", decimals: 18 },
];

if (!privateKey) {
  throw new Error("BSC_DEPLOYER_PRIVATE_KEY is required. Set it in this terminal only; do not write it into source files.");
}
if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
  throw new Error(`Invalid BSC_MINT_RECIPIENT: ${recipient}`);
}

const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
const provider = new JsonRpcProvider(rpcUrl);
const network = await provider.getNetwork();
if (Number(network.chainId) !== 97) throw new Error(`Expected BSC Testnet chainId 97, got ${network.chainId}`);

const wallet = new Wallet(privateKey, provider);
const balance = await provider.getBalance(wallet.address);
if (balance === 0n) throw new Error(`Deployer ${wallet.address} has no BSC Testnet BNB for gas`);

const deployed = {};
for (const token of tokens) {
  const factory = new ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy(token.name, token.symbol, token.decimals);
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  const erc20 = new Contract(address, artifact.abi, wallet);
  const amount = parseUnits(mintAmount, token.decimals);
  const tx = await erc20.mint(recipient, amount);
  const receipt = await tx.wait();
  const recipientBalance = await erc20.balanceOf(recipient);
  deployed[token.key] = {
    address,
    symbol: token.symbol,
    decimals: token.decimals,
    minted: mintAmount,
    recipient,
    recipientBalance: formatUnits(recipientBalance, token.decimals),
    mintTx: receipt.hash,
  };
  console.log(`${token.symbol}=${address}`);
}

const record = {
  network: { name: "BSC Testnet", chainId: 97 },
  rpcUrl,
  deployer: wallet.address,
  recipient,
  tokens: deployed,
  completedAt: new Date().toISOString(),
};

const outDir = resolve(projectRoot, "deployments");
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, `bsc-test-tokens-${record.completedAt.replace(/[:.]/g, "-")}.json`);
writeFileSync(outPath, `${JSON.stringify(record, null, 2)}\n`);
writeFileSync(resolve(outDir, "bsc-test-tokens-latest.json"), `${JSON.stringify(record, null, 2)}\n`);

console.log(`Minted ${mintAmount} each to ${recipient}`);
console.log(`Deployment record: ${outPath}`);

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

async function loadEthers() {
  try {
    return await import("ethers");
  } catch {
    return import(pathToFileURL("D:\\hb_finance_ganache\\node_modules\\ethers\\lib.esm\\index.js").href);
  }
}

function normalizePrivateKey(value) {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  if (/^0x[a-fA-F0-9]{64}$/.test(trimmed)) return trimmed;
  if (/^[a-fA-F0-9]{64}$/.test(trimmed)) return `0x${trimmed}`;
  throw new Error("BSC_DEPLOYER_PRIVATE_KEY must be 64 hex characters, with or without 0x");
}
