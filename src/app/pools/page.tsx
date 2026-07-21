'use client'

import { useState, useEffect } from 'react'
import { WalletService } from '@/lib/wallet-service'
import { apiClient } from '@/lib/api-client'

interface PoolDisplayProps {
  poolName: string
  apy: string
  tvl: string
  type: 'fixed' | 'flexible'
}

function PoolCard({ poolName, apy, tvl, type }: PoolDisplayProps) {
  const [isSelected, setIsSelected] = useState(false)

  return (
    <div
      className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-200 bg-white hover:border-blue-300'
      }`}
      onClick={() => setIsSelected(!isSelected)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900">{poolName}</h3>
          <p className="text-sm text-slate-500 mt-1">
            {type === 'fixed' ? '定期' : '活期'}
          </p>
        </div>
        <span className="text-2xl">{type === 'fixed' ? '📅' : '💰'}</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-600">年化收益率</span>
          <span className="font-bold text-green-600">{apy}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">总锁定价值</span>
          <span className="font-mono text-slate-900">${tvl}</span>
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
            选择此池子
          </button>
        </div>
      )}
    </div>
  )
}

export default function PoolsPage() {
  const [pools, setPools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userAddress, setUserAddress] = useState('')
  const [walletConnected, setWalletConnected] = useState(false)

  useEffect(() => {
    // 检查钱包连接
    checkWalletConnection()
    // 加载池子信息
    loadPools()
  }, [])

  const checkWalletConnection = async () => {
    try {
      const accounts = await WalletService.getAccounts()
      if (accounts.length > 0) {
        setUserAddress(accounts[0])
        setWalletConnected(true)
      }
    } catch (error) {
      console.error('Failed to check wallet:', error)
    }
  }

  const connectWallet = async () => {
    try {
      const accounts = await WalletService.requestConnect()
      setUserAddress(accounts[0])
      setWalletConnected(true)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const loadPools = async () => {
    try {
      setLoading(true)
      const data = await apiClient.pool.list()
      setPools(data.pools || [])
    } catch (error) {
      console.error('Failed to load pools:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* 顶部 */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">💰 存款池</h1>
            <p className="text-slate-600 mt-2">选择最适合你的存款方案</p>
          </div>

          {walletConnected ? (
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600">连接的账户</p>
              <p className="font-mono text-sm text-slate-900 mt-1">
                {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
              </p>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              连接钱包
            </button>
          )}
        </div>

        {/* 池子列表 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-slate-600 mt-4">加载中...</p>
          </div>
        ) : pools.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-600">暂无可用池子</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pools.map((pool) => (
              <PoolCard
                key={pool.pool_address}
                poolName={pool.pool_name}
                apy={pool.apy}
                tvl={pool.tvl}
                type={pool.type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
