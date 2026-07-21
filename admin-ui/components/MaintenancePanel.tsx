'use client'

import { useState } from 'react'
import axios from 'axios'

export default function MaintenancePanel() {
  const [maintenance, setMaintenance] = useState(false)
  const [newRpcUrl, setNewRpcUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const toggleMaintenance = async () => {
    try {
      setLoading(true)
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/hidden-panel/toggle`
      )
      setMaintenance(!maintenance)
      setMessage(
        maintenance
          ? '✓ Maintenance mode disabled'
          : '✓ Maintenance mode enabled'
      )
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('✗ Failed to toggle maintenance')
    } finally {
      setLoading(false)
    }
  }

  const updateRpcNode = async () => {
    if (!newRpcUrl) {
      setMessage('✗ Please enter a valid RPC URL')
      return
    }

    try {
      setLoading(true)
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/hidden-panel/update-rpc`,
        { new_rpc_url: newRpcUrl }
      )
      setMessage('✓ RPC node updated successfully')
      setNewRpcUrl('')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('✗ Failed to update RPC node')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 fade-in">
      {/* 标题 */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Maintenance Panel</h1>
        <p className="text-slate-600 mt-1">System configuration and emergency controls</p>
      </div>

      {/* 消息提示 */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.startsWith('✓')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* 维护模式 */}
      <div className="card p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">🛑 Maintenance Mode</h2>
            <p className="text-slate-600 mt-2">
              Enable this to block all user requests. Use in emergencies.
            </p>
          </div>
        </div>

        {/* 警告 */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium">
            ⚠️ Warning: Enabling maintenance mode will block ALL user requests!
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMaintenance}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              maintenance
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            } disabled:opacity-50`}
          >
            {loading ? 'Processing...' : maintenance ? 'Disable' : 'Enable'}
          </button>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                maintenance ? 'bg-red-500' : 'bg-green-500'
              }`}
            ></div>
            <span className="text-slate-700 font-medium">
              {maintenance ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
        </div>
      </div>

      {/* RPC 节点切换 */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">🌐 RPC Node Configuration</h2>

        <div className="space-y-4">
          <p className="text-slate-600">
            Hot-swap the RPC endpoint without restarting the service.
          </p>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              New RPC URL
            </label>
            <input
              type="text"
              value={newRpcUrl}
              onChange={(e) => setNewRpcUrl(e.target.value)}
              placeholder="https://sepolia.drpc.org"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 font-mono text-sm"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              💡 Tip: Use Alchemy or QuickNode for better latency
            </p>
          </div>

          <button
            onClick={updateRpcNode}
            disabled={loading || !newRpcUrl}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update RPC Node'}
          </button>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">⚡ Quick Actions</h2>

        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-slate-800 transition-colors duration-200">
            <span className="text-2xl mb-2 block">📊</span>
            <span className="text-sm font-medium text-slate-900">View Logs</span>
          </button>
          <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-slate-800 transition-colors duration-200">
            <span className="text-2xl mb-2 block">🔄</span>
            <span className="text-sm font-medium text-slate-900">Restart Service</span>
          </button>
          <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-slate-800 transition-colors duration-200">
            <span className="text-2xl mb-2 block">🗑️</span>
            <span className="text-sm font-medium text-slate-900">Clear Cache</span>
          </button>
          <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-slate-800 transition-colors duration-200">
            <span className="text-2xl mb-2 block">📈</span>
            <span className="text-sm font-medium text-slate-900">Export Data</span>
          </button>
        </div>
      </div>
    </div>
  )
}
