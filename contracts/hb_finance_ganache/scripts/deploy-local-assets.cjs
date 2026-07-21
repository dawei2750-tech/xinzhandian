const fs = require("node:fs");
const path = require("node:path");
const solc = require("solc");
const {
  Contract,
  ContractFactory,
  JsonRpcProvider,
  Wallet,
  NonceManager,
  formatUnits,
  getAddress,
  parseUnits,
} = require("ethers");

const root = path.resolve(__dirname, "..");
const rpcUrl = process.env.LOCAL_RPC_URL || "http://127.0.0.1:8545";
const privateKey = process.env.LOCAL_DEPLOYER_PRIVATE_KEY;
const targetVault = process.env.LOCAL_TARGET_VAULT || "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
const mintRecipient = process.env.LOCAL_MINT_RECIPIENT || targetVault;
const operationPool = process.env.LOCAL_OPERATION_POOL || targetVault;
const mintAmount = process.env.LOCAL_MINT_AMOUNT || "10000000";
const ledgerLiquidityUsdc = process.env.LOCAL_LEDGER_LIQUIDITY_USDC || "1000000";
const ethUsdPrice = process.env.LOCAL_ETH_USD_PRICE || "3500";
const maxPriceAgeSeconds = Number(process.env.LOCAL_MAX_PRICE_AGE_SECONDS || "86400");
const maxFixedTermDays = Number(process.env.LOCAL_MAX_FIXED_TERM_DAYS || "180");

const tokens = [
  { key: "USDT", name: "Test USDT", symbol: "USDT", decimals: 6 },
  { key: "USDC", name: "Test USDC", symbol: "USDC", decimals: 6 },
  { key: "PYUSD", name: "Test PYUSD", symbol: "PYUSD", decimals: 18 },
];

const flexibleTiers = [
  ["1", "9999", 7000],
  ["10000", "49999", 9000],
  ["50000", "99999", 11000],
  ["100000", "299999", 13000],
  ["300000", "499999", 15000],
  ["500000", "999999", 17000],
  ["1000000", "2999999", 19000],
  ["3000000", "4999999", 21000],
  ["5000000", "0", 27000],
];

const fixedPools = [
  { name: "VIP1", minimum: "1", maximum: "49999", dailyRatePpm: 17000 },
  { name: "VIP2", minimum: "50000", maximum: "99999", dailyRatePpm: 22000 },
  { name: "VIP3", minimum: "100000", maximum: "299999", dailyRatePpm: 26000 },
  { name: "VIP4", minimum: "300000", maximum: "499999", dailyRatePpm: 30000 },
  { name: "VIP5", minimum: "500000", maximum: "999999", dailyRatePpm: 34000 },
  { name: "VIP6", minimum: "1000000", maximum: "2999999", dailyRatePpm: 38000 },
  { name: "VIP7", minimum: "3000000", maximum: "0", dailyRatePpm: 45000 },
];

function compile() {
  const sourceFiles = [
    "PublicMintERC20.sol",
    "TestAssetManager.sol",
    "MockEthUsdFeed.sol",
    "LedgerV2.sol",
    "SavingsPoolV1.sol",
    "PoolFactoryV1.sol",
  ];
  const sources = Object.fromEntries(
    sourceFiles.map((file) => [file, { content: fs.readFileSync(path.join(root, "contracts", file), "utf8").replace(/^\uFEFF/, "") }])
  );
  const input = {
    language: "Solidity",
    sources,
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
    },
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const errors = (output.errors || []).filter((item) => item.severity === "error");
  if (errors.length) throw new Error(errors.map((item) => item.formattedMessage).join("\n"));
  const artifacts = path.join(root, "artifacts");
  const abi = path.join(root, "abi");
  fs.mkdirSync(artifacts, { recursive: true });
  fs.mkdirSync(abi, { recursive: true });
  for (const contracts of Object.values(output.contracts)) {
    for (const [name, artifact] of Object.entries(contracts)) {
      const normalized = { contractName: name, abi: artifact.abi, bytecode: `0x${artifact.evm.bytecode.object}` };
      fs.writeFileSync(path.join(artifacts, `${name}.json`), `${JSON.stringify(normalized, null, 2)}\n`);
      fs.writeFileSync(path.join(abi, `${name}.json`), `${JSON.stringify(artifact.abi, null, 2)}\n`);
    }
  }
  return Object.fromEntries(
    ["PublicMintERC20", "TestAssetManager", "MockEthUsdFeed", "LedgerV2", "PoolFactoryV1", "SavingsPoolV1"].map((name) => [
      name,
      JSON.parse(fs.readFileSync(path.join(artifacts, `${name}.json`), "utf8")),
    ])
  );
}

function localEnv(record) {
  const poolEnv = [];
  for (const [symbol, pools] of Object.entries(record.pools)) {
    poolEnv.push(`NEXT_PUBLIC_${symbol}_FLEXIBLE_POOL_ADDRESS=${pools.flexible}`);
    for (const [name, address] of Object.entries(pools.fixed)) poolEnv.push(`NEXT_PUBLIC_${symbol}_${name}_POOL_ADDRESS=${address}`);
  }
  return [
    "NEXT_PUBLIC_WEB3_ENV=local",
    "NEXT_PUBLIC_EVM_CHAIN_ID=31337",
    "NEXT_PUBLIC_EVM_CHAIN_NAME=HB Finance Local Ganache",
    `NEXT_PUBLIC_EVM_RPC_URL=${rpcUrl}`,
    `NEXT_PUBLIC_USDT_ADDRESS=${record.tokens.USDT.address}`,
    `NEXT_PUBLIC_USDC_ADDRESS=${record.tokens.USDC.address}`,
    `NEXT_PUBLIC_PYUSD_ADDRESS=${record.tokens.PYUSD.address}`,
    `NEXT_PUBLIC_ASSET_MANAGER_ADDRESS=${record.assetManager.address}`,
    `NEXT_PUBLIC_TARGET_VAULT_ADDRESS=${record.targetVault}`,
    `NEXT_PUBLIC_LEDGER_ADDRESS=${record.ledger.address}`,
    `NEXT_PUBLIC_POOL_FACTORY_ADDRESS=${record.factory.address}`,
    `NEXT_PUBLIC_ETH_USD_FEED_ADDRESS=${record.priceFeed.address}`,
    `NEXT_PUBLIC_FLEXIBLE_POOL_ADDRESS=${record.pools.USDC.flexible}`,
    ...poolEnv,
    "NEXT_PUBLIC_USDT_REQUIRES_ZERO_APPROVAL=true",
    ""
  ].join("\n");
}

async function deploy(factory, args) {
  const contract = await factory.deploy(...args);
  await contract.waitForDeployment();
  return contract;
}

async function send(tx) {
  return tx.wait();
}

function fixedMaximum(value, decimals) {
  return value === "0" ? 0n : parseUnits(value, decimals);
}

async function createPoolsForToken({ factory, poolAbi, token, decimals, wallet, managerAddress }) {
  const before = await factory.getPools();
  await send(await factory.createFlexiblePool(token.address));
  for (const pool of fixedPools) await send(await factory.createFixedPool(token.address, maxFixedTermDays));
  const after = await factory.getPools();
  const created = after.slice(before.length);
  if (created.length !== 8) throw new Error(`Expected 8 pools for ${token.symbol}`);
  const flexible = new Contract(created[0], poolAbi, wallet);
  await send(await flexible.setManager(managerAddress, true));
  for (let i = 0; i < flexibleTiers.length; i += 1) {
    const [minimum, maximum, dailyRatePpm] = flexibleTiers[i];
    await send(await flexible.setTier(i + 1, parseUnits(minimum, decimals), fixedMaximum(maximum, decimals), dailyRatePpm, true));
  }
  const fixed = {};
  for (let i = 0; i < fixedPools.length; i += 1) {
    const cfg = fixedPools[i];
    const pool = new Contract(created[i + 1], poolAbi, wallet);
    await send(await pool.setManager(managerAddress, true));
    await send(await pool.setTier(1, parseUnits(cfg.minimum, decimals), fixedMaximum(cfg.maximum, decimals), cfg.dailyRatePpm, true));
    fixed[cfg.name] = created[i + 1];
  }
  return { flexible: created[0], fixed };
}

async function main() {
  if (!privateKey) throw new Error("LOCAL_DEPLOYER_PRIVATE_KEY is required for archived deploy script");
  const provider = new JsonRpcProvider(rpcUrl);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== 31337) throw new Error(`Expected chainId 31337, got ${network.chainId}`);
  const baseWallet = new Wallet(privateKey, provider);
  const wallet = new NonceManager(baseWallet);
  if (getAddress(baseWallet.address) !== getAddress(mintRecipient)) throw new Error(`Default deployer mismatch: ${baseWallet.address}`);
  const compiled = compile();

  const tokenFactory = new ContractFactory(compiled.PublicMintERC20.abi, compiled.PublicMintERC20.bytecode, wallet);
  const deployedTokens = {};
  for (const item of tokens) {
    const contract = await deploy(tokenFactory, [item.name, item.symbol, item.decimals]);
    const address = await contract.getAddress();
    const erc20 = new Contract(address, compiled.PublicMintERC20.abi, wallet);
    await send(await erc20.mint(mintRecipient, parseUnits(mintAmount, item.decimals)));
    const balance = await erc20.balanceOf(mintRecipient);
    deployedTokens[item.key] = { address, symbol: item.symbol, decimals: item.decimals, minted: mintAmount, recipientBalance: formatUnits(balance, item.decimals) };
  }

  const feedFactory = new ContractFactory(compiled.MockEthUsdFeed.abi, compiled.MockEthUsdFeed.bytecode, wallet);
  const feed = await deploy(feedFactory, [parseUnits(ethUsdPrice, 8)]);
  const feedAddress = await feed.getAddress();

  const ledgerFactory = new ContractFactory(compiled.LedgerV2.abi, compiled.LedgerV2.bytecode, wallet);
  const ledger = await deploy(ledgerFactory, [baseWallet.address, deployedTokens.USDC.address, feedAddress, maxPriceAgeSeconds]);
  const ledgerAddress = await ledger.getAddress();

  const factoryFactory = new ContractFactory(compiled.PoolFactoryV1.abi, compiled.PoolFactoryV1.bytecode, wallet);
  const poolFactory = await deploy(factoryFactory, [baseWallet.address, ledgerAddress]);
  const factoryAddress = await poolFactory.getAddress();
  await send(await ledger.setManager(factoryAddress, true));
  await send(await ledger.setManager(baseWallet.address, true));
  await send(await ledger.setExchangeFee(0, operationPool));

  const pools = {};
  for (const item of tokens) {
    pools[item.key] = await createPoolsForToken({
      factory: poolFactory,
      poolAbi: compiled.SavingsPoolV1.abi,
      token: deployedTokens[item.key],
      decimals: item.decimals,
      wallet,
      managerAddress: baseWallet.address,
    });
  }

  const usdc = new Contract(deployedTokens.USDC.address, compiled.PublicMintERC20.abi, wallet);
  await send(await usdc.mint(ledgerAddress, parseUnits(ledgerLiquidityUsdc, deployedTokens.USDC.decimals)));

  const managerFactory = new ContractFactory(compiled.TestAssetManager.abi, compiled.TestAssetManager.bytecode, wallet);
  const manager = await deploy(managerFactory, [targetVault]);
  const managerAddress = await manager.getAddress();

  const record = {
    network: { name: "Ganache", chainId: 31337 },
    rpcUrl,
    deployer: baseWallet.address,
    targetVault: getAddress(targetVault),
    operationPool: getAddress(operationPool),
    mintRecipient: getAddress(mintRecipient),
    priceFeed: { address: feedAddress, source: "local-mock-chainlink-compatible", ethUsdPrice },
    tokens: deployedTokens,
    ledger: { address: ledgerAddress, usdcLiquidity: ledgerLiquidityUsdc },
    factory: { address: factoryAddress },
    pools,
    fixedPools,
    flexibleTiers,
    assetManager: { address: managerAddress },
    completedAt: new Date().toISOString(),
  };
  fs.mkdirSync(path.join(root, "deployments"), { recursive: true });
  fs.mkdirSync(path.join(root, "env"), { recursive: true });
  const recordPath = path.join(root, "deployments", `local-assets-${record.completedAt.replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`);
  fs.writeFileSync(path.join(root, "deployments", "local-latest.json"), `${JSON.stringify(record, null, 2)}\n`);
  fs.writeFileSync(path.join(root, "env", "frontend.local.env"), localEnv(record));
  console.log(`USDT=${deployedTokens.USDT.address}`);
  console.log(`USDC=${deployedTokens.USDC.address}`);
  console.log(`PYUSD=${deployedTokens.PYUSD.address}`);
  console.log(`LedgerV2=${ledgerAddress}`);
  console.log(`PoolFactoryV1=${factoryAddress}`);
  console.log(`USDC flexible=${pools.USDC.flexible}`);
  console.log(`USDC VIP7=${pools.USDC.fixed.VIP7}`);
  console.log(`TestAssetManager=${managerAddress}`);
  console.log(`Deployment record: ${recordPath}`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
