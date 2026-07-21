const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

test('one-click Ganache project exposes fixed local chain startup', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.equal(pkg.private, true);
  assert.equal(pkg.scripts.chain, 'ganache --chain.chainId 31337 --server.host 127.0.0.1 --server.port 8545 --wallet.totalAccounts 10 --wallet.defaultBalance 100000 --wallet.mnemonic "test test test test test test test test test test test junk" --database.dbPath ./data');

  const cmd = fs.readFileSync(path.join(root, 'start-chain.cmd'), 'utf8');
  assert.match(cmd, /npm\.cmd run chain/);
  assert.match(cmd, /127\.0\.0\.1:8545/);

  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  assert.match(readme, /Chain ID: `31337`/);
  assert.match(readme, /RPC: `http:\/\/127\.0\.0\.1:8545`/);
});
