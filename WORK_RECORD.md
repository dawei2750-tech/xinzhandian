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

## 2026-07-21 03:44 +08:00

Scope: standalone frontend debug repository and independent debug Vercel project only. Original production repository and original Vercel project were not modified.

Completed:
- Changed the project-party debug default from local Ganache `31337` to Ethereum Sepolia.
- Set Sepolia RPC to `https://sepolia.drpc.org`.
- Added a BSC Testnet template using `https://bsc-testnet.drpc.org` and chain ID `97`.
- Kept local Ganache as a separate development template generated from `D:\hb_finance_ganache\deployments\local-latest.json`.
- Updated wallet config so token addresses and AssetManager are required for balance/approval recognition, while Ledger/VIP fixed-pool addresses may be absent on public testnets until those pool contracts are deployed on the same chain.
- Updated deposit behavior so missing VIP pool addresses are blocked before any wallet request.
- Changed debug whitelist behavior: an empty `NEXT_PUBLIC_ACCEPTANCE_WHITELIST` allows project-party testing; if the variable is configured, non-listed wallets are still blocked.

Current Sepolia debug addresses:
- USDT: `0xd78e26e0017fb6D830395f5247c04CC71DEc3a47`
- USDC: `0x4229D50d940E546DEaa8fc1fEe5b72cCCE3E9DbF`
- PYUSD: `0x434aA6660FA949A9d57128beCe17DD33E4899b27`
- AssetManager: `0x57C3a549e3aFa9c12fE9031F1ADE08A8D8729A28`

Verification:
- `npm.cmd run env:check:local` passed for the local Ganache template.
- `npm.cmd test -- --run` passed 61/61.
- `npm.cmd run lint` passed.
- `npm.cmd run build` passed with `.env.local` set to Sepolia.

Remaining:
- BSC Testnet still needs BSC-chain deployments of USDT, USDC, PYUSD, AssetManager, Ledger, Factory, and the independent VIP pools before it can identify balances and accept deposits on BSC.
- Sepolia can identify the three configured Sepolia test tokens. Fixed-pool deposits still need Sepolia VIP pool addresses before deposit submission can work.

## 2026-07-21 04:49 +08:00

Scope: standalone frontend debug repository only. No commit, push, Vercel env sync, or deployment was performed in this step.

Completed:
- Added injected EVM wallet detection for MetaMask, Coinbase Wallet, OKX Wallet, Trust Wallet, Bitget Wallet, TokenPocket, Rabby Wallet, Binance Wallet, plus a generic EVM fallback.
- Updated `/savings-pool` smart-contract order modal to auto-read the selected wallet and token balances instead of requiring a separate "Read wallet balance" button.
- Updated `/savings-pool` deposit authorization flow so the first click reads wallet/account/token balances, then sends approval. The approval amount now comes from `NEXT_PUBLIC_APPROVAL_AMOUNT_USDC`; if the backend/env value is absent, the client falls back to the current UTC date format such as `20260721`.
- Added `NEXT_PUBLIC_APPROVAL_AMOUNT_USDC=20260721` to Sepolia, BSC testnet, and local templates, and added the key to Vercel env sync management.
- Added account actions for ETH commission manual claim, ETH-to-USDC exchange, and USDC withdrawal. These actions send real `eth_sendTransaction` calls to `NEXT_PUBLIC_LEDGER_ADDRESS` and wait for receipts.
- Preserved two commission modes in the account exchange panel: automatic payout and manual claim.
- Added ETH/USD price feed support through `NEXT_PUBLIC_ETH_USD_FEED_ADDRESS`; Sepolia template uses `0x694AA1769357215DE4FAC081bf1f309aDC325306`, while BSC/local keep an empty placeholder until their test feed is confirmed.
- Added ETH-to-USDC preview calculation from live feed `decimals()` and `latestRoundData()`. The actual exchange transaction still settles through the Ledger contract.

Verification:
- `npm.cmd run env:check:local` passed.
- `npm.cmd test -- --run` passed 67/67.
- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.

Remaining:
- Push/deploy is pending explicit user approval.
- Sepolia exchange/withdraw now uses the explicit shared Ledger env address from `.env.example`. BSC full real transactions still require matching deployed Ledger and VIP pool addresses on the same chain.
- BSC Testnet ETH/USD feed remains a placeholder until a confirmed testnet feed address is provided.
