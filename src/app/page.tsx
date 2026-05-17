'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import { Hero } from '@/components/landing/hero'
import { FeaturesGrid } from '@/components/landing/features-grid'
import { PricingCards } from '@/components/landing/pricing-cards'
import { CodeExamples } from '@/components/landing/code-examples'
import { UseCases } from '@/components/landing/use-cases'
import { Stats } from '@/components/landing/stats'
import { Footer } from '@/components/landing/footer'
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'
import { PortalLayout } from '@/components/layout/portal-layout'
import { OverviewStats } from '@/components/dashboard/overview-stats'
import { RecentCalls } from '@/components/dashboard/recent-calls'
import { QuickChart } from '@/components/dashboard/quick-chart'
import { KeyList } from '@/components/api-keys/key-list'

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col">
      <div className="flex-1">
        <Hero />
        <Stats />
        <FeaturesGrid />
        <CodeExamples />
        <UseCases />
        <PricingCards />
      </div>
      <Footer />
    </div>
  )
}

function PricingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col">
      <div className="flex-1">
        <PricingCards />
      </div>
      <Footer />
    </div>
  )
}

function DocsPage() {
  const setView = useAppStore((s) => s.setView)
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-white mb-6">Documentation</h1>
        <p className="text-zinc-400 text-lg mb-12">
          Everything you need to integrate EstateIQ into your application.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Getting Started', view: 'docs-getting-started', desc: 'Quick start guide and installation' },
            { title: 'Authentication', view: 'docs-authentication', desc: 'API key authentication and security' },
            { title: 'AI Generation', view: 'docs-ai-generation', desc: 'Content generation endpoints' },
            { title: 'Properties', view: 'docs-properties', desc: 'Property management API' },
            { title: 'Leads', view: 'docs-leads', desc: 'Lead tracking and management' },
            { title: 'Analytics', view: 'docs-analytics', desc: 'Usage and performance analytics' },
            { title: 'Webhooks', view: 'docs-webhooks', desc: 'Real-time event notifications' },
            { title: 'Rate Limits', view: 'docs-ratelimits', desc: 'API rate limiting and quotas' },
            { title: 'Error Codes', view: 'docs-errors', desc: 'Error handling and codes' },
            { title: 'SDKs', view: 'docs-sdks', desc: 'Official client libraries' },
            { title: 'Changelog', view: 'docs-changelog', desc: 'Latest updates and changes' },
          ].map((doc) => (
            <button
              key={doc.view}
              onClick={() => setView(doc.view as Parameters<typeof setView>[0])}
              className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-all text-left cursor-pointer"
            >
              <h3 className="text-white font-semibold mb-1">{doc.title}</h3>
              <p className="text-sm text-zinc-500">{doc.desc}</p>
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

function DocDetailPage({ title }: { title: string }) {
  const setView = useAppStore((s) => s.setView)
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto px-4 py-20">
        <button
          onClick={() => setView('docs')}
          className="text-emerald-400 hover:text-emerald-300 text-sm mb-6 inline-flex items-center gap-1 cursor-pointer"
        >
          ← Back to Documentation
        </button>
        <h1 className="text-4xl font-bold text-white mb-6">{title}</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-400 text-lg">Documentation content coming soon. Check back for updates.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function DashboardPage() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <OverviewStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickChart />
          <RecentCalls />
        </div>
      </div>
    </PortalLayout>
  )
}

function ApiKeysPage() {
  return (
    <PortalLayout>
      <KeyList />
    </PortalLayout>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <PortalLayout>
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-zinc-500">This section is coming soon.</p>
        </div>
      </div>
    </PortalLayout>
  )
}

const docTitles: Record<string, string> = {
  'docs-getting-started': 'Getting Started',
  'docs-authentication': 'Authentication',
  'docs-ai-generation': 'AI Content Generation',
  'docs-properties': 'Properties API',
  'docs-leads': 'Leads API',
  'docs-analytics': 'Analytics API',
  'docs-webhooks': 'Webhooks',
  'docs-ratelimits': 'Rate Limits',
  'docs-errors': 'Error Codes',
  'docs-sdks': 'SDKs',
  'docs-changelog': 'Changelog',
}

const portalViews = new Set([
  'dashboard', 'api-keys', 'usage', 'properties', 'leads',
  'content', 'webhooks', 'playground', 'settings', 'billing',
])

export default function Home() {
  const view = useAppStore((s) => s.view)
  const setIsAuthenticated = useAppStore((s) => s.setIsAuthenticated)
  const setDeveloper = useAppStore((s) => s.setDeveloper)
  const setView = useAppStore((s) => s.setView)

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data.success) {
          setIsAuthenticated(true)
          setDeveloper(data.data)
          // If on landing/auth page, redirect to dashboard
          if (['landing', 'login', 'register'].includes(view)) {
            setView('dashboard')
          }
        }
      } catch {
        // Not authenticated
      }
    }
    checkSession()
  }, [])

  // Render based on view
  if (view === 'landing') return <LandingPage />
  if (view === 'pricing') return <PricingPage />
  if (view === 'docs') return <DocsPage />
  if (view === 'login') return <LoginForm />
  if (view === 'register') return <RegisterForm />
  if (view === 'dashboard') return <DashboardPage />
  if (view === 'api-keys') return <ApiKeysPage />

  // Doc detail pages
  if (docTitles[view]) return <DocDetailPage title={docTitles[view]} />

  // Other portal pages
  if (portalViews.has(view)) {
    const title = view.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    return <PlaceholderPage title={title} />
  }

  return <LandingPage />
}
