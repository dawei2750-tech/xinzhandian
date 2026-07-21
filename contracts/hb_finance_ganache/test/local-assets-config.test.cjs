const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

test('environment templates define local Ganache and Sepolia frontend modes', () => {
  const local = read('env/frontend.local.env');
  const sepolia = read('env/frontend.sepolia.env');
  assert.match(local, /NEXT_PUBLIC_WEB3_ENV=local/);
  assert.match(local, /NEXT_PUBLIC_EVM_CHAIN_ID=31337/);
  assert.match(local, /NEXT_PUBLIC_EVM_RPC_URL=http:\/\/127\.0\.0\.1:8545/);
  assert.match(sepolia, /NEXT_PUBLIC_WEB3_ENV=sepolia/);
  assert.match(sepolia, /NEXT_PUBLIC_EVM_CHAIN_ID=11155111/);
  assert.match(local, /NEXT_PUBLIC_USDT_REQUIRES_ZERO_APPROVAL=true/);
  assert.match(sepolia, /NEXT_PUBLIC_USDT_REQUIRES_ZERO_APPROVAL=true/);
});

test('switch scripts copy the selected environment into the frontend project', () => {
  const writer = read('scripts/write-frontend-env.cjs');
  assert.match(writer, /frontend\.local\.env/);
  assert.match(writer, /frontend\.sepolia\.env/);
  assert.match(writer, /hb-chain-finance/);
  assert.match(read('switch-local.cmd'), /node scripts\\write-frontend-env\.cjs local/);
  assert.match(read('switch-sepolia.cmd'), /node scripts\\write-frontend-env\.cjs sepolia/);
});

test('local deployment script records ERC20 tokens, independent pools, ledger and price feed', () => {
  const deploy = read('scripts/deploy-local-assets.cjs');
  assert.match(deploy, /PublicMintERC20/);
  assert.match(deploy, /TestAssetManager/);
  assert.match(deploy, /MockEthUsdFeed/);
  assert.match(deploy, /LedgerV2/);
  assert.match(deploy, /PoolFactoryV1/);
  assert.match(deploy, /SavingsPoolV1/);
  assert.match(deploy, /USDT/);
  assert.match(deploy, /USDC/);
  assert.match(deploy, /PYUSD/);
  assert.match(deploy, /createFlexiblePool/);
  assert.match(deploy, /createFixedPool/);
  assert.match(deploy, /setExchangeFee\(0, operationPool\)/);
  assert.match(deploy, /frontend\.local\.env/);
});

test('local contracts keep four-hour windows and ETH-to-USDC exchange formula', () => {
  const pool = read('contracts/SavingsPoolV1.sol');
  const ledger = read('contracts/LedgerV2.sol');
  assert.match(pool, /WINDOW_SECONDS = 4 hours/);
  assert.match(pool, /MAX_WINDOWS_PER_SETTLEMENT = 6/);
  assert.match(pool, /ledger\.quoteEthCommission/);
  assert.match(pool, /ledger\.creditEthCommission/);
  assert.match(ledger, /ethRewardOf/);
  assert.match(ledger, /usdcCreditOf/);
  assert.match(ledger, /exchangeEthForUsdc/);
  assert.match(ledger, /withdrawUsdc/);
  assert.match(ledger, /principal \* dailyRatePpm \* windows \* feedScale \* 1e18/);
});
