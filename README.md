# HB Chain Finance Frontend Debug

This is a standalone debug-only frontend recovery repository for temporary review and deployment.

It is not the canonical contract repository. It intentionally excludes local Ganache files, Solidity contract source packages, private keys, `.env.local`, Vercel project state, and tool cache/quarantine directories.

## Start

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://127.0.0.1:3000`.

## Verify

```powershell
npm.cmd run env:check:local
npm.cmd test -- --run
npm.cmd run lint
npm.cmd run build
```

## Local Ganache wiring

The project-party debug default is Ethereum Sepolia, using `https://sepolia.drpc.org`.

```powershell
npm.cmd run env:use:sepolia
```

BSC Testnet uses a separate template and must be filled with BSC Testnet deployments of our own test tokens and independent pools before deposits can work.

```powershell
npm.cmd run env:use:bsc-testnet
```

Local Ganache remains available only for local development and is wired from `D:\hb_finance_ganache\deployments\local-latest.json`.

```powershell
npm.cmd run env:sync:local
npm.cmd run env:check:local
npm.cmd run env:use:local
```

- USDT, USDC, and PYUSD must be the three local minted token contracts from the D drive deployment record.
- Every VIP card points to an independent fixed-pool contract address. The 21 VIP fixed-pool addresses across USDT, USDC, and PYUSD must not repeat.
- VIP1-VIP7 use the same fixed-rate algorithm and deployment rate table for every supported token.
- Commission rewards are accounted in ETH; withdrawal settlement is USDC only.
- Public testnets must use token and pool contracts deployed on that same public testnet. Sepolia, BSC Testnet, and local Ganache addresses are not interchangeable.

## Scope

- Frontend pages, styles, config, wallet approval client helpers, and frontend tests.
- No backend service.
- No production smart-contract deployment state.
- No local Ganache runtime data.
