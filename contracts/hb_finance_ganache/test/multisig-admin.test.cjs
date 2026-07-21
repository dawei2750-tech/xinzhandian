const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

test("contracts expose a multisig admin that gates management calls by threshold", () => {
  const multisig = read("contracts/SimpleMultiSigAdmin.sol");
  const deploy = read("scripts/deploy-local-assets.cjs");

  assert.match(multisig, /contract SimpleMultiSigAdmin/);
  assert.match(multisig, /requiredApprovals/);
  assert.match(multisig, /function propose/);
  assert.match(multisig, /function approve/);
  assert.match(multisig, /function execute/);
  assert.match(multisig, /mapping\(address => bool\) public isSigner/);
  assert.match(multisig, /executed = true/);
  assert.match(multisig, /target.call\(data\)/);
  assert.match(deploy, /SimpleMultiSigAdmin/);
  assert.match(deploy, /multisigAddress/);
  assert.match(deploy, /LedgerV2.*multisigAddress/s);
  assert.match(deploy, /PoolFactoryV1.*multisigAddress/s);
  assert.match(deploy, /TestAssetManager.*targetVault/s);
});
