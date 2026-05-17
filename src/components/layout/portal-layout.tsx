'use client'

import { useEffect, type ReactNode } from 'react'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Key,
  Building,
  Users,
  FileText,
  Webhook,
  Terminal,
  BarChart3,
  Settings,
  CreditCard,
  BookOpen,
  Menu,
  LogOut,
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useAppStore } from '@/store/app-store'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' as const },
  { icon: Key, label: 'API Keys', view: 'api-keys' as const },
  { icon: Building, label: 'Properties', view: 'properties' as const },
  { icon: Users, label: 'Leads', view: 'leads' as const },
  { icon: FileText, label: 'Content', view: 'content' as const },
  { icon: Webhook, label: 'Webhooks', view: 'webhooks' as const },
  { icon: Terminal, label: 'Playground', view: 'playground' as const },
  { icon: BarChart3, label: 'Usage', view: 'usage' as const },
  { icon: Settings, label: 'Settings', view: 'settings' as const },
  { icon: CreditCard, label: 'Billing', view: 'billing' as const },
  { icon: BookOpen, label: 'Docs', view: 'docs' as const },
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
  const setDeveloper = useAppStore((s) => s.setDeveloper)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) setSidebarOpen(false)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setIsMobile, setSidebarOpen])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    setIsAuthenticated(false)
    setDeveloper(null)
    setView('landing')
  }

  const planName =
    (developer?.plan as string) || 'free'

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-zinc-950 border-r border-zinc-800 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-16'
        } overflow-hidden`}
      >
        {sidebarOpen && (
          <>
            {/* Logo */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EQ</span>
                </div>
                <span className="text-white font-semibold text-lg">EstateIQ</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer lg:flex hidden"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>

            {/* Nav items */}
            <ScrollArea className="flex-1 px-3 py-4">
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => {
                      setView(item.view)
                      if (isMobile) setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      view === item.view
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </ScrollArea>

            {/* Bottom */}
            <div className="border-t border-zinc-800 p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-400 text-xs font-medium">
                    {(developer?.name as string)?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {(developer?.name as string) || 'User'}
                  </p>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 mt-0.5"
                  >
                    {planName.charAt(0).toUpperCase() + planName.slice(1)}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-zinc-400 hover:text-red-400 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Collapsed sidebar for desktop */}
        {!sidebarOpen && (
          <div className="flex flex-col items-center py-4 h-full">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center mb-4">
              <span className="text-white font-bold text-sm">EQ</span>
            </div>
            <nav className="space-y-2 flex-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => setView(item.view)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    view === item.view
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                  title={item.label}
                >
                  <item.icon className="w-4 h-4" />
                </button>
              ))}
            </nav>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-zinc-400 hover:text-red-400 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm flex items-center px-4 sm:px-6 sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-zinc-400 hover:text-white mr-4 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white capitalize">
              {view.replace(/-/g, ' ').replace('docs ', '')}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hidden sm:inline-flex"
            >
              {planName.charAt(0).toUpperCase() + planName.slice(1)} Plan
            </Badge>
          </div>
        </header>

        <Separator className="bg-zinc-800" />

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
