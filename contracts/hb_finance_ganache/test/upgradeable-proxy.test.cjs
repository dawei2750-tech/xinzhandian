const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

test("contracts expose an ERC1967-style proxy upgrade path controlled by multisig admin", () => {
  const proxy = read("contracts/Simple1967Proxy.sol");
  const upgradeable = read("contracts/UpgradeableAdmin.sol");
  const ledger = read("contracts/LedgerV2.sol");
  const pool = read("contracts/SavingsPoolV1.sol");
  const factory = read("contracts/PoolFactoryV1.sol");
  const deploy = read("scripts/deploy-local-assets.cjs");

  assert.match(proxy, /contract Simple1967Proxy/);
  assert.match(proxy, /IMPLEMENTATION_SLOT/);
  assert.match(proxy, /delegatecall\(initialization\)/);
  assert.match(proxy, /delegatecall\(gas\(\), implementation/);
  assert.match(proxy, /proxiableUUID\(\)/);

  assert.match(upgradeable, /abstract contract UpgradeableAdmin/);
  assert.match(upgradeable, /function upgradeTo\(address newImplementation\)/);
  assert.match(upgradeable, /_authorizeUpgrade\(\)/);
  assert.match(upgradeable, /sstore\(IMPLEMENTATION_SLOT, newImplementation\)/);

  assert.match(ledger, /function initialize\(/);
  assert.doesNotMatch(ledger, /constructor\(/);
  assert.match(pool, /function initialize\(/);
  assert.doesNotMatch(pool, /immutable/);
  assert.match(factory, /function initialize\(/);
  assert.match(factory, /poolImplementation/);
  assert.match(factory, /Simple1967Proxy/);

  assert.match(deploy, /Simple1967Proxy/);
  assert.match(deploy, /ledgerImplementationAddress/);
  assert.match(deploy, /factoryImplementationAddress/);
  assert.match(deploy, /poolImplementationAddress/);
  assert.match(deploy, /multisigAddress/);
});
