# WORK_RECORD

## 2026-07-21 03:24 +08:00

Scope: standalone frontend debug repository only. Original `hb-chain-finance` repository, contract source packages, and original Vercel project were not modified.

Completed:
- Synced local debug frontend environment from `D:\hb_finance_ganache\deployments\local-latest.json`.
- Added `.env.example` with the D drive Ganache wiring for USDT, USDC, PYUSD, AssetManager, Ledger, Factory, flexible pools, and VIP1-VIP7 fixed pools.
- Added scripts:
  - `npm.cmd run env:sync:local`
  - `npm.cmd run env:check:local`
  - `npm.cmd run env:push:vercel`
- Documented the debug business rules: every VIP smart contract card points to an independent fixed pool; VIP1-VIP7 use the same rate algorithm across supported tokens; commissions are ETH-denominated; withdrawals settle in USDC only.
- Added environment validation that checks the three token addresses are unique, all flexible and fixed pool addresses are unique, and the VIP1-VIP7 rate table matches the D drive deployment record.
- Updated Vercel Production and Preview environment variables for the independent debug project `hb-chain-finance-frontend-debug`.
- Deployed the independent debug project to production.

Latest debug addresses:
- USDT: `0xD49a0e9A4CD5979aE36840f542D2d7f02C4817Be`
- USDC: `0xc582Bc0317dbb0908203541971a358c44b1F3766`
- PYUSD: `0xB377a2EeD7566Ac9fCb0BA673604F9BF875e2Bab`

Verification:
- `npm.cmd run env:check:local` passed.
- `npm.cmd test -- --run` passed 58/58.
- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.
- Vercel deployment `dpl_BfHAq1hTqXbtzxvqSjPAsVEQwQfA` is Ready.
- Alias `https://hb-chain-finance-frontend-debug.vercel.app` points to the latest debug deployment.
- `/admin` returned HTTP 200 and included the USDT, USDC, PYUSD, and AssetManager debug addresses.
- Chrome/Playwright H5 check confirmed `/savings-pool` renders VIP1, VIP7, `1.70%`, `4.50%`, and `USDC`.

Remaining:
- Real deposit execution still requires Chrome with MetaMask unlocked on local chain `31337`, the testing account imported, and the wallet holding the three local minted test tokens.
