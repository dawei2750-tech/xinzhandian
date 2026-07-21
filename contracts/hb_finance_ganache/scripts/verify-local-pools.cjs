const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { Contract, JsonRpcProvider, Wallet, NonceManager, parseUnits, formatUnits } = require("ethers");

const root = path.resolve(__dirname, "..");
const rpcUrl = process.env.LOCAL_RPC_URL || "http://127.0.0.1:8545";
const privateKey = process.env.LOCAL_DEPLOYER_PRIVATE_KEY;

function artifact(name) {
  return JSON.parse(fs.readFileSync(path.join(root, "artifacts", `${name}.json`), "utf8"));
}

async function mine(provider, seconds) {
  await provider.send("evm_increaseTime", [seconds]);
  await provider.send("evm_mine", []);
}

async function main() {
  if (!privateKey) throw new Error("LOCAL_DEPLOYER_PRIVATE_KEY is required for archived verification script");
  const record = JSON.parse(fs.readFileSync(path.join(root, "deployments", "local-latest.json"), "utf8"));
  const provider = new JsonRpcProvider(rpcUrl);
  const baseWallet = new Wallet(privateKey, provider);
  const wallet = new NonceManager(baseWallet);
  const tokenAbi = artifact("PublicMintERC20").abi;
  const poolAbi = artifact("SavingsPoolV1").abi;
  const ledgerAbi = artifact("LedgerV2").abi;
  const usdc = new Contract(record.tokens.USDC.address, tokenAbi, wallet);
  const vip1 = new Contract(record.pools.USDC.fixed.VIP1, poolAbi, wallet);
  const vip2 = new Contract(record.pools.USDC.fixed.VIP2, poolAbi, wallet);
  const ledger = new Contract(record.ledger.address, ledgerAbi, wallet);
  const principal = parseUnits("100", record.tokens.USDC.decimals);
  const beforeWalletUsdc = await usdc.balanceOf(baseWallet.address);
  const beforeCredit = await ledger.usdcCreditOf(baseWallet.address);
  const beforeEthReward = await ledger.ethRewardOf(baseWallet.address);
  const beforeVip2Ids = await vip2.getAccountPositions(baseWallet.address);
  await (await usdc.approve(await vip1.getAddress(), principal)).wait();
  await (await vip1.openFixed(principal, 7)).wait();
  const ids = await vip1.getAccountPositions(baseWallet.address);
  const positionId = ids[ids.length - 1];
  await mine(provider, 4 * 60 * 60);
  await (await vip1.claim(positionId)).wait();
  const ethReward = await ledger.ethRewardOf(baseWallet.address);
  const expected = await ledger.quoteEthCommission(principal, record.tokens.USDC.decimals, 17000, 1);
  assert.equal((ethReward - beforeEthReward).toString(), expected.toString());
  assert(expected > 0n);
  const vip2Ids = await vip2.getAccountPositions(baseWallet.address);
  assert.equal(vip2Ids.length, beforeVip2Ids.length);
  const [, , expectedNet] = await ledger.previewUsdc(expected);
  await (await ledger.exchangeEthForUsdc(expected)).wait();
  const credit = await ledger.usdcCreditOf(baseWallet.address);
  assert.equal((credit - beforeCredit).toString(), expectedNet.toString());
  await (await ledger.withdrawUsdc(expectedNet)).wait();
  const afterWalletUsdc = await usdc.balanceOf(baseWallet.address);
  assert(afterWalletUsdc >= beforeWalletUsdc - principal + expectedNet);
  console.log(`VIP1 first 4h ETH commission=${formatUnits(ethReward, 18)}`);
  console.log(`USDC credit exchanged and withdrawn=${formatUnits(expectedNet, record.tokens.USDC.decimals)}`);
  console.log("Independent VIP pool check passed: VIP2 has no position");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
