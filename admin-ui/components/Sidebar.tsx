'use client'

type ActiveTab = 'dashboard' | 'multisig' | 'maintenance'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: ActiveTab) => void
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api/v1'

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems: Array<{ id: ActiveTab; label: string; icon: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: '[]' },
    { id: 'multisig', label: 'Multi-Sig Panel', icon: '**' },
    { id: 'maintenance', label: 'Maintenance', icon: '!!' },
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
            <span className="mr-2 font-mono text-xs">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-slate-200">
        <p className="text-xs font-semibold text-slate-500 mb-3">Quick Links</p>
        <div className="space-y-2">
          <a
            href={`${apiBaseUrl}/rpc/status`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 block"
          >
            RPC Status
          </a>
          <a
            href={`${apiBaseUrl}/system/health`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 block"
          >
            System Health
          </a>
          <a
            href={`${apiBaseUrl}/multisig/proposals`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 block"
          >
            All Proposals
          </a>
        </div>
      </div>
    </aside>
  )
}
