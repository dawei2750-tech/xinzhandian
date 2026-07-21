'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import StatCard from './StatCard'

interface SystemStats {
  status: string
  is_maintaining: boolean
  authorizations: number
  proposals: number
  transactions: number
  current_block?: number
  latency_ms?: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const [healthRes, rpcRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/system/health`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rpc/status`),
        ])

        setStats({
          ...healthRes.data,
          current_block: rpcRes.data.current_block,
          latency_ms: rpcRes.data.latency_ms,
        })
        setError('')
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in">
      {/* 标题 */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Overview</h1>
        <p className="text-slate-600 mt-1">Real-time system statistics and monitoring</p>
      </div>

      {/* 系统状态提示 */}
      {stats?.is_maintaining && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">
            ⚠️ System is in maintenance mode. All user requests are blocked.
          </p>
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Authorizations"
          value={stats?.authorizations || 0}
          icon="📝"
          color="bg-blue-50"
          borderColor="border-blue-200"
        />
        <StatCard
          title="Active Proposals"
          value={stats?.proposals || 0}
          icon="🔐"
          color="bg-purple-50"
          borderColor="border-purple-200"
        />
        <StatCard
          title="Transactions"
          value={stats?.transactions || 0}
          icon="💳"
          color="bg-green-50"
          borderColor="border-green-200"
        />
        <StatCard
          title="Block Height"
          value={stats?.current_block || 0}
          icon="📦"
          color="bg-orange-50"
          borderColor="border-orange-200"
        />
      </div>

      {/* 系统信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RPC 信息 */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">🌐 RPC Node</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-slate-600">Latency</span>
              <span className="font-mono text-slate-900">
                {stats?.latency_ms}ms
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-slate-600">Status</span>
              <span className="inline-flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-green-600 font-medium">Online</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Current Block</span>
              <span className="font-mono text-slate-900 font-semibold">
                #{stats?.current_block}
              </span>
            </div>
          </div>
        </div>

        {/* 系统状态 */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">⚙️ System Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-slate-600">Maintenance</span>
              <span
                className={`inline-flex items-center space-x-2 ${
                  stats?.is_maintaining ? 'text-red-600' : 'text-green-600'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    stats?.is_maintaining ? 'bg-red-500' : 'bg-green-500'
                  }`}
                ></div>
                <span className="font-medium">
                  {stats?.is_maintaining ? 'ON' : 'OFF'}
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-slate-600">API Health</span>
              <span className="inline-flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="font-medium">Healthy</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Uptime</span>
              <span className="text-slate-900 font-medium">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
