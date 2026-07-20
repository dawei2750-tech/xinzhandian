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
npm.cmd test -- --run
npm.cmd run lint
npm.cmd run build
```

## Scope

- Frontend pages, styles, config, wallet approval client helpers, and frontend tests.
- No backend service.
- No production smart-contract deployment state.
- No local Ganache runtime data.
