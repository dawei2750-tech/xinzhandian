// Web3 钱包提供者类型
export type WalletType = 
  | 'metamask'
  | 'coinbase'
  | 'okx'
  | 'trust'
  | 'bitget'
  | 'tokenPocket'
  | 'rabby'
  | 'binance'
  | 'generic'

export interface EthereumProvider {
  isConnected: () => boolean
  request: (request: { method: string; params?: any[] }) => Promise<any>
  on: (event: string, callback: (...args: any[]) => void) => void
  removeListener: (event: string, callback: (...args: any[]) => void) => void
}

export interface PoolInfo {
  poolName: string
  tokenName: string
  tokenAddress: string
  apy: string
  tvl: string
  poolAddress: string
  type: 'fixed' | 'flexible'
  minDeposit?: string
  maxDeposit?: string
  lockDays?: number
}

export interface UserInfo {
  address: string
  tokenBalances: Record<string, string>
  approvalStatus: Record<string, string>
  totalDeposited: string
}

export interface AuthorizationStep {
  step: number
  name: string
  description: string
}
