'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Proposal {
  id: number
  token: string
  from_user: string
  amount: string
  target_to: string
  approvals: string[]
  required: number
  status: string
  created_at: string
}

export default function MultiSigPanel() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending')
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchProposals()
    const interval = setInterval(fetchProposals, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchProposals = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/multisig/proposals`
      )
      setProposals(response.data.proposals || [])
    } catch (error) {
      console.error('Failed to fetch proposals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProposals =
    activeTab === 'pending'
      ? proposals.filter((p) => p.status === 'Pending')
      : proposals

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      Executed: { bg: 'bg-green-100', text: 'text-green-800' },
      Rejected: { bg: 'bg-red-100', text: 'text-red-800' },
    }
    const badge = badges[status] || badges.Pending
    return (
      <span className={`badge ${badge.bg} ${badge.text}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-6 fade-in">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Multi-Signature Panel</h1>
          <p className="text-slate-600 mt-1">Manage and approve transfer proposals</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary"
        >
          + New Proposal
        </button>
      </div>

      {/* 创建表单 */}
      {showCreateForm && (
        <div className="card p-6 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Create New Proposal</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Token (e.g., USDC)"
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
            <input
              type="text"
              placeholder="Amount"
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
            <input
              type="text"
              placeholder="From User Address"
              className="col-span-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
            <input
              type="text"
              placeholder="Target Address"
              className="col-span-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
          </div>
          <div className="flex space-x-2 mt-4">
            <button className="btn-primary">Create Proposal</button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 标签 */}
      <div className="flex space-x-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-1 font-medium ${
            activeTab === 'pending'
              ? 'text-slate-900 border-b-2 border-slate-800'
              : 'text-slate-600'
          }`}
        >
          Pending ({proposals.filter((p) => p.status === 'Pending').length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-1 font-medium ${
            activeTab === 'all'
              ? 'text-slate-900 border-b-2 border-slate-800'
              : 'text-slate-600'
          }`}
        >
          All ({proposals.length})
        </button>
      </div>

      {/* 提案列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto"></div>
        </div>
      ) : filteredProposals.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-600">No proposals found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProposals.map((proposal) => (
            <div key={proposal.id} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-100 px-3 py-1 rounded text-sm font-mono text-slate-700">
                    #{proposal.id}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {proposal.token} Transfer
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(proposal.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {getStatusBadge(proposal.status)}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-slate-600">Amount</span>
                  <p className="font-mono font-semibold text-slate-900">
                    {proposal.amount}
                  </p>
                </div>
                <div>
                  <span className="text-slate-600">From</span>
                  <p className="font-mono text-xs text-slate-700 truncate">
                    {proposal.from_user}
                  </p>
                </div>
                <div>
                  <span className="text-slate-600">To</span>
                  <p className="font-mono text-xs text-slate-700 truncate">
                    {proposal.target_to}
                  </p>
                </div>
              </div>

              {/* 签名状态 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Approvals</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {proposal.approvals.length}/{proposal.required}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-slate-800 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(proposal.approvals.length / proposal.required) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* 操作按钮 */}
              {proposal.status === 'Pending' && (
                <div className="flex space-x-2">
                  <button className="flex-1 btn-primary text-sm">
                    ✓ Approve
                  </button>
                  <button className="flex-1 btn-secondary text-sm">
                    ✕ Reject
                  </button>
                  {proposal.approvals.length >= proposal.required && (
                    <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-green-700 text-sm">
                      Execute
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
