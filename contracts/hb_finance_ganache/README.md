# HB Finance Ganache Local Chain

- RPC: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Accounts: `10`
- Balance: `100000` test ETH per account
- Data directory: `D:\hb_finance_ganache\data`
- Frontend project: `C:\Users\Administrator\heibai-workspace\projects\hb-chain-finance`

## Commands

```powershell
npm.cmd run chain
npm.cmd run deploy:local
npm.cmd run switch:local
npm.cmd run switch:sepolia
```

Double-click `start-chain.cmd` to start the chain. Double-click `deploy-local.cmd` after the chain is running to deploy local tokens and TestAssetManager, then write the frontend local environment.
