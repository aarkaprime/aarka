'use client'

import { useEffect, type ReactNode } from 'react'
import { useAppStore } from '@/store/app-store'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Key, Building2, Users, FileText, Webhook,
  Terminal, BarChart3, Settings, CreditCard, BookOpen, Zap,
  Menu, X, ChevronLeft, LogOut
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' as const },
  { icon: Key, label: 'API Keys', view: 'api-keys' as const },
  { icon: Building2, label: 'Properties', view: 'properties' as const },
  { icon: Users, label: 'Leads', view: 'leads' as const },
  { icon: FileText, label: 'Content', view: 'content' as const },
  { icon: Webhook, label: 'Webhooks', view: 'webhooks' as const },
  { icon: Terminal, label: 'Playground', view: 'playground' as const },
  { icon: BarChart3, label: 'Usage', view: 'usage' as const },
  { icon: Settings, label: 'Settings', view: 'settings' as const },
  { icon: CreditCard, label: 'Billing', view: 'billing' as const },
  { icon: BookOpen, label: 'Docs', view: 'docs-getting-started' as const },
]

export function PortalLayout({ children }: { children: ReactNode }) {
  const view = useAppStore((s) => s.view)
  const setView = useAppStore((s) => s.setView)
  const developer = useAppStore((s) => s.developer)
  const sidebarOpen = useAppStore((s) => s.sidebarOpen)
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen)
  const isMobile = useAppStore((s) => s.isMobile)
  const setIsMobile = useAppStore((s) => s.setIsMobile)
  const setIsAuthenticated = useAppStore((s) => s.setIsAuthenticated)
  const setDeveloper2 = useAppStore((s) => s.setDeveloper)

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setSidebarOpen(false)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [setIsMobile, setSidebarOpen])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    setIsAuthenticated(false)
    setDeveloper2(null)
    setView('landing')
  }

  const planLabel = (developer as Record<string, unknown>)?.plan as string || 'free'
  const planColors: Record<string, string> = {
    free: 'bg-zinc-700 text-zinc-300',
    starter: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    pro: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    business: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    enterprise: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0c0c0e] border-r border-zinc-800/50 flex flex-col transition-transform duration-200 ${
        isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : (sidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-16 md:translate-x-0')
      }`}>
        {/* Logo */}
        <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-emerald-500" />
            <span className="font-bold text-white">NexusAPI</span>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="p-1 text-zinc-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => { setView(item.view); if (isMobile) setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-0.5 cursor-pointer ${
                view === item.view
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-zinc-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold">
              {((developer as Record<string, unknown>)?.name as string)?.charAt(0)?.toUpperCase() || 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white font-medium truncate">{((developer as Record<string, unknown>)?.name as string) || 'Developer'}</div>
              <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded ${planColors[planLabel] || planColors.free}`}>
                {planLabel.charAt(0).toUpperCase() + planLabel.slice(1)}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-800/50 transition-all cursor-pointer">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-md flex items-center px-4 gap-4">
          {!isMobile && (
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-zinc-400 hover:text-white cursor-pointer">
              <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
            </button>
          )}
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} className="p-1 text-zinc-400 hover:text-white cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-sm font-medium text-zinc-400">
            {navItems.find(n => n.view === view)?.label || 'Dashboard'}
          </h2>
        </header>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
