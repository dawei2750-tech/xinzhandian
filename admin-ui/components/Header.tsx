'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface HeaderProps {
  systemStatus: any
}

export default function Header({ systemStatus }: HeaderProps) {
  const [time, setTime] = useState('')
  const [rpcLatency, setRpcLatency] = useState<number | null>(null)

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleString('zh-CN'))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (systemStatus?.current_latency) {
      setRpcLatency(systemStatus.current_latency)
    }
  }, [systemStatus])

  const getStatusColor = () => {
    if (!rpcLatency) return 'bg-gray-300'
    if (rpcLatency < 200) return 'bg-green-500'
    if (rpcLatency < 500) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-slate-900">
            🏦 HB Finance
          </div>
          <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Admin Dashboard v1.0
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* RPC 状态 */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
            <span className="text-xs text-slate-600">
              RPC: {rpcLatency ? `${rpcLatency}ms` : 'connecting...'}
            </span>
          </div>

          {/* 系统状态 */}
          <div className="flex items-center space-x-2">
            {systemStatus?.is_maintaining ? (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-xs text-red-600 font-medium">Maintenance Mode</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-green-600 font-medium">Normal</span>
              </>
            )}
          </div>

          {/* 时间 */}
          <div className="text-xs text-slate-500">
            {time}
          </div>
        </div>
      </div>
    </header>
  )
}
