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
import { ApiPlayground } from '@/components/playground/api-playground'
import { WebhookManager } from '@/components/webhooks/webhook-manager'
import { UsagePage } from '@/components/usage/usage-page'
import { PropertiesPage } from '@/components/properties/properties-page'
import { LeadsPage } from '@/components/leads/leads-page'
import { ContentPage } from '@/components/content/content-page'
import { SettingsPage } from '@/components/settings/settings-page'
import { DocsGettingStarted } from '@/components/docs/docs-getting-started'
import { DocsAuthentication } from '@/components/docs/docs-authentication'
import { DocsAIGeneration } from '@/components/docs/docs-ai-generation'
import { DocsProperties } from '@/components/docs/docs-properties'
import { DocsLeads } from '@/components/docs/docs-leads'
import { DocsAnalytics } from '@/components/docs/docs-analytics'
import { DocsWebhooks } from '@/components/docs/docs-webhooks'
import { DocsRateLimits } from '@/components/docs/docs-ratelimits'
import { DocsErrors } from '@/components/docs/docs-errors'
import { DocsSDKs } from '@/components/docs/docs-sdks'
import { DocsChangelog } from '@/components/docs/docs-changelog'

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
          Everything you need to integrate NexusAPI into your application.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Getting Started', view: 'docs-getting-started' as const, desc: 'Quick start guide and installation' },
            { title: 'Authentication', view: 'docs-authentication' as const, desc: 'API key authentication and security' },
            { title: 'AI Generation', view: 'docs-ai-generation' as const, desc: 'Content generation endpoints' },
            { title: 'Properties', view: 'docs-properties' as const, desc: 'Property management API' },
            { title: 'Leads', view: 'docs-leads' as const, desc: 'Lead tracking and management' },
            { title: 'Analytics', view: 'docs-analytics' as const, desc: 'Usage and performance analytics' },
            { title: 'Webhooks', view: 'docs-webhooks' as const, desc: 'Real-time event notifications' },
            { title: 'Rate Limits', view: 'docs-ratelimits' as const, desc: 'API rate limiting and quotas' },
            { title: 'Error Codes', view: 'docs-errors' as const, desc: 'Error handling and codes' },
            { title: 'SDKs', view: 'docs-sdks' as const, desc: 'Official client libraries' },
            { title: 'Changelog', view: 'docs-changelog' as const, desc: 'Latest updates and changes' },
          ].map((doc) => (
            <button
              key={doc.view}
              onClick={() => setView(doc.view)}
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

function PlaygroundPage() {
  return (
    <PortalLayout>
      <ApiPlayground />
    </PortalLayout>
  )
}

function WebhooksPage() {
  return (
    <PortalLayout>
      <WebhookManager />
    </PortalLayout>
  )
}

function UsageAnalyticsPage() {
  return (
    <PortalLayout>
      <UsagePage />
    </PortalLayout>
  )
}

function PropertiesPageWrapper() {
  return (
    <PortalLayout>
      <PropertiesPage />
    </PortalLayout>
  )
}

function LeadsPageWrapper() {
  return (
    <PortalLayout>
      <LeadsPage />
    </PortalLayout>
  )
}

function ContentPageWrapper() {
  return (
    <PortalLayout>
      <ContentPage />
    </PortalLayout>
  )
}

function SettingsPageWrapper() {
  return (
    <PortalLayout>
      <SettingsPage />
    </PortalLayout>
  )
}

function BillingPage() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Billing</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage your subscription and billing</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
          <div className="text-center py-8">
            <p className="text-zinc-400 text-sm">Billing management coming soon.</p>
            <p className="text-zinc-600 text-xs mt-1">Contact support for plan changes.</p>
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}

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

  // Landing & public pages
  if (view === 'landing') return <LandingPage />
  if (view === 'pricing') return <PricingPage />
  if (view === 'docs') return <DocsPage />
  if (view === 'login') return <LoginForm />
  if (view === 'register') return <RegisterForm />

  // Portal pages
  if (view === 'dashboard') return <DashboardPage />
  if (view === 'api-keys') return <ApiKeysPage />
  if (view === 'playground') return <PlaygroundPage />
  if (view === 'webhooks') return <WebhooksPage />
  if (view === 'usage') return <UsageAnalyticsPage />
  if (view === 'properties') return <PropertiesPageWrapper />
  if (view === 'leads') return <LeadsPageWrapper />
  if (view === 'content') return <ContentPageWrapper />
  if (view === 'settings') return <SettingsPageWrapper />
  if (view === 'billing') return <BillingPage />

  // Doc detail pages — real components
  if (view === 'docs-getting-started') return <DocsGettingStarted />
  if (view === 'docs-authentication') return <DocsAuthentication />
  if (view === 'docs-ai-generation') return <DocsAIGeneration />
  if (view === 'docs-properties') return <DocsProperties />
  if (view === 'docs-leads') return <DocsLeads />
  if (view === 'docs-analytics') return <DocsAnalytics />
  if (view === 'docs-webhooks') return <DocsWebhooks />
  if (view === 'docs-ratelimits') return <DocsRateLimits />
  if (view === 'docs-errors') return <DocsErrors />
  if (view === 'docs-sdks') return <DocsSDKs />
  if (view === 'docs-changelog') return <DocsChangelog />

  return <LandingPage />
}
