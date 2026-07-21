'use client'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: any) => void
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'multisig', label: '🔐 Multi-Sig Panel', icon: '🔐' },
    { id: 'maintenance', label: '⚙️ Maintenance', icon: '⚙️' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen overflow-y-auto sticky top-16">
      <nav className="p-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${
              activeTab === item.id
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* 快速链接 */}
      <div className="px-6 py-4 border-t border-slate-200">
        <p className="text-xs font-semibold text-slate-500 mb-3">Quick Links</p>
        <div className="space-y-2">
          <a
            href="/api/v1/rpc/status"
            target="_blank"
            className="text-xs text-blue-600 hover:text-blue-800 block"
          >
            → RPC Status
          </a>
          <a
            href="/api/v1/system/health"
            target="_blank"
            className="text-xs text-blue-600 hover:text-blue-800 block"
          >
            → System Health
          </a>
          <a
            href="/api/v1/multisig/proposals"
            target="_blank"
            className="text-xs text-blue-600 hover:text-blue-800 block"
          >
            → All Proposals
          </a>
        </div>
      </div>
    </aside>
  )
}
