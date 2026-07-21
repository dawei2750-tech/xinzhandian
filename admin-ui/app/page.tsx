'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import MultiSigPanel from '@/components/MultiSigPanel'
import MaintenancePanel from '@/components/MaintenancePanel'

type ActiveTab = 'dashboard' | 'multisig' | 'maintenance'

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
  const [systemStatus, setSystemStatus] = useState<any>(null)

  useEffect(() => {
    fetchSystemStatus()
    const interval = setInterval(fetchSystemStatus, 30000) // 30秒更新一次
    return () => clearInterval(interval)
  }, [])

  const fetchSystemStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/system/health`
      )
      setSystemStatus(response.data)
    } catch (error) {
      console.error('Failed to fetch system status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      <Header systemStatus={systemStatus} />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'multisig' && <MultiSigPanel />}
            {activeTab === 'maintenance' && <MaintenancePanel />}
          </div>
        </main>
      </div>
    </div>
  )
}
