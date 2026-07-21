import { EthereumProvider, WalletType } from '@/types/web3'

/**
 * Web3 钱包检测和连接服务
 */
export class WalletService {
  private static readonly WALLET_CONFIGS = {
    metamask: {
      name: 'MetaMask',
      icon: '🦊',
      isInstalled: () => !!(window as any).ethereum?.isMetaMask,
    },
    coinbase: {
      name: 'Coinbase Wallet',
      icon: '🟦',
      isInstalled: () => !!(window as any).coinbaseWalletExtension,
    },
    okx: {
      name: 'OKX Wallet',
      icon: '🔵',
      isInstalled: () => !!(window as any).okxwallet,
    },
    trust: {
      name: 'Trust Wallet',
      icon: '🛡️',
      isInstalled: () => !!(window as any).trustwallet,
    },
    bitget: {
      name: 'Bitget Wallet',
      icon: '🎯',
      isInstalled: () => !!(window as any).bitkeep?.ethereum,
    },
    tokenPocket: {
      name: 'TokenPocket',
      icon: '🎲',
      isInstalled: () => !!(window as any).tokenPocket?.ethereum,
    },
    rabby: {
      name: 'Rabby Wallet',
      icon: '🐰',
      isInstalled: () => !!(window as any).ethereum?.isRabby,
    },
    binance: {
      name: 'Binance Wallet',
      icon: '🟡',
      isInstalled: () => !!(window as any).BinanceChain?.ethereum,
    },
  }

  /**
   * 获取可用钱包列表
   */
  static getAvailableWallets(): Array<{ type: WalletType; name: string; icon: string }> {
    const available: Array<{ type: WalletType; name: string; icon: string }> = []

    // 检查所有已知钱包
    for (const [type, config] of Object.entries(this.WALLET_CONFIGS)) {
      if (config.isInstalled()) {
        available.push({
          type: type as WalletType,
          name: config.name,
          icon: config.icon,
        })
      }
    }

    // 如果有通用 ethereum 提供者，添加到列表
    if ((window as any).ethereum && available.length === 0) {
      available.push({
        type: 'generic',
        name: 'EVM Wallet',
        icon: '💼',
      })
    }

    return available
  }

  /**
   * 获取 Ethereum 提供者
   */
  static getProvider(walletType?: WalletType): EthereumProvider | null {
    const ethereum = (window as any).ethereum

    if (!ethereum) return null

    if (!walletType || walletType === 'generic') {
      return ethereum
    }

    // 特定钱包提供者
    switch (walletType) {
      case 'metamask':
        return ethereum.isMetaMask ? ethereum : null
      case 'coinbase':
        return (window as any).coinbaseWalletExtension || ethereum
      case 'okx':
        return (window as any).okxwallet || ethereum
      case 'trust':
        return (window as any).trustwallet || ethereum
      case 'bitget':
        return (window as any).bitkeep?.ethereum || ethereum
      case 'tokenPocket':
        return (window as any).tokenPocket?.ethereum || ethereum
      case 'rabby':
        return ethereum.isRabby ? ethereum : null
      case 'binance':
        return (window as any).BinanceChain?.ethereum || ethereum
      default:
        return ethereum
    }
  }

  /**
   * 请求连接钱包
   */
  static async requestConnect(walletType?: WalletType): Promise<string[]> {
    const provider = this.getProvider(walletType)
    if (!provider) {
      throw new Error('No EVM wallet found')
    }

    try {
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      })
      return accounts
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  /**
   * 获取当前账户
   */
  static async getAccounts(): Promise<string[]> {
    const provider = this.getProvider()
    if (!provider) return []

    try {
      const accounts = await provider.request({
        method: 'eth_accounts',
      })
      return accounts
    } catch (error) {
      console.error('Failed to get accounts:', error)
      return []
    }
  }

  /**
   * 获取当前网络链ID
   */
  static async getChainId(): Promise<number> {
    const provider = this.getProvider()
    if (!provider) throw new Error('No provider')

    try {
      const chainId = await provider.request({
        method: 'eth_chainId',
      })
      return parseInt(chainId, 16)
    } catch (error) {
      console.error('Failed to get chain ID:', error)
      throw error
    }
  }

  /**
   * 切换网络链
   */
  static async switchChain(chainId: number): Promise<void> {
    const provider = this.getProvider()
    if (!provider) throw new Error('No provider')

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (error: any) {
      // 如果链不存在，某些钱包会返回 4902
      if (error.code === 4902) {
        throw new Error('Chain not found. Please add it manually.')
      }
      throw error
    }
  }

  /**
   * 获取代币余额
   */
  static async getTokenBalance(
    account: string,
    tokenAddress: string,
    rpcUrl: string
  ): Promise<string> {
    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [
            {
              to: tokenAddress,
              data: `0x70a08231000000000000000000000000${account.slice(2)}`,
            },
            'latest',
          ],
        }),
      })

      const data = await response.json()
      if (data.result) {
        return BigInt(data.result).toString()
      }
      return '0'
    } catch (error) {
      console.error('Failed to get token balance:', error)
      return '0'
    }
  }

  /**
   * 发送交易
   */
  static async sendTransaction(
    from: string,
    to: string,
    data: string,
    value?: string
  ): Promise<string> {
    const provider = this.getProvider()
    if (!provider) throw new Error('No provider')

    try {
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            to,
            data,
            value: value || '0x0',
          },
        ],
      })
      return txHash
    } catch (error) {
      console.error('Failed to send transaction:', error)
      throw error
    }
  }

  /**
   * 监听账户变化
   */
  static onAccountsChanged(callback: (accounts: string[]) => void): void {
    const provider = this.getProvider()
    if (!provider) return

    provider.on('accountsChanged', callback)
  }

  /**
   * 监听网络变化
   */
  static onChainChanged(callback: (chainId: string) => void): void {
    const provider = this.getProvider()
    if (!provider) return

    provider.on('chainChanged', callback)
  }
}
