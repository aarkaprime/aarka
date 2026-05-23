'use client'

import { useAppStore } from '@/store/app-store'
import { ArrowLeft, GitCommit, Tag } from 'lucide-react'

export function DocsChangelog() {
  const setView = useAppStore((s) => s.setView)

  const releases = [
    {
      version: 'v1.0.0',
      date: 'March 4, 2026',
      title: 'NexusAPI API v1.0 — Global Launch',
      type: 'major' as const,
      changes: [
        { type: 'feature' as const, desc: 'AI chat completion API with OpenAI-compatible interface' },
        { type: 'feature' as const, desc: '8 AI models from Chinese providers: DeepSeek, Qwen, GLM-4, Moonshot, Yi, Baichuan' },
        { type: 'feature' as const, desc: 'Model catalog endpoint with pricing and capability information' },
        { type: 'feature' as const, desc: 'Analytics API with overview, usage, and token performance endpoints' },
        { type: 'feature' as const, desc: 'Webhook system with HMAC-SHA256 signature verification and retry logic' },
        { type: 'feature' as const, desc: 'API key management with test and production environments' },
        { type: 'feature' as const, desc: 'Rate limiting with sliding window algorithm and monthly quotas' },
        { type: 'feature' as const, desc: '10 supported languages: English, Spanish, French, German, Portuguese, Arabic, Chinese, Japanese, Korean, Hindi' },
        { type: 'feature' as const, desc: '5 tone options: professional, casual, luxury, urgent, friendly' },
        { type: 'feature' as const, desc: 'Global coverage with support for 20 currencies and 25 countries' },
        { type: 'feature' as const, desc: 'Developer authentication with NextAuth.js and Bearer token API keys' },
        { type: 'feature' as const, desc: '5 plan tiers: Free, Starter, Professional, Business, Enterprise' },
      ]
    },
    {
      version: 'v1.0.1',
      date: 'March 6, 2026',
      title: 'Bug Fixes & Improvements',
      type: 'patch' as const,
      changes: [
        { type: 'fix' as const, desc: 'Fixed API key hash lookup performance by switching from findUnique to findFirst' },
        { type: 'fix' as const, desc: 'Fixed Next.js 16 Promise-based route params handling in withApiAuth wrapper' },
        { type: 'fix' as const, desc: 'Added @unique constraint on ApiKey.keyHash for data integrity' },
        { type: 'improvement' as const, desc: 'Improved error response format with optional details field for validation errors' },
        { type: 'improvement' as const, desc: 'Optimized analytics queries with proper database indexing on UsageLog' },
      ]
    },
    {
      version: 'v1.0.2',
      date: 'March 10, 2026',
      title: 'Global Expansion & AI Engine Upgrade',
      type: 'minor' as const,
      changes: [
        { type: 'feature' as const, desc: 'Switched AI engine from z-ai-web-dev-sdk to direct DeepSeek API for improved reliability and performance' },
        { type: 'feature' as const, desc: 'Expanded language support from 5 to 10 global languages' },
        { type: 'feature' as const, desc: 'Expanded currency support from 10 to 20 major world currencies' },
        { type: 'feature' as const, desc: 'Expanded country support from 10 to 25 global countries' },
        { type: 'improvement' as const, desc: 'Updated AI routing with automatic fallback from DeepSeek to z-ai-web-dev-sdk' },
        { type: 'improvement' as const, desc: 'Added chat playground for interactive model testing in the dashboard' },
      ]
    },
  ]

  const upcomingFeatures = [
    'Official SDKs for JavaScript, Python, PHP, and Ruby',
    'Streaming responses (SSE) for chat completions',
    'Image generation capabilities',
    'Function calling and tool use support',
    'Advanced analytics with custom date ranges',
    'Team management with role-based access control',
    'Sandbox environment for testing',
    'GraphQL API support',
  ]

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => setView('docs')}
          className="text-zinc-500 hover:text-white text-sm flex items-center gap-1 mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Docs
        </button>

        <h1 className="text-3xl font-bold text-white mb-4">Changelog</h1>
        <p className="text-zinc-400 text-lg mb-8">
          Follow the evolution of the NexusAPI API. Every release, feature, and fix documented here.
        </p>

        {/* Releases */}
        <div className="space-y-8 mb-12">
          {releases.map((release) => (
            <div key={release.version} className="relative">
              {/* Timeline line */}
              <div className="absolute left-[15px] top-8 bottom-0 w-px bg-zinc-800" />
              
              {/* Version header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  release.type === 'major' ? 'bg-emerald-500/20 text-emerald-400' :
                  release.type === 'minor' ? 'bg-sky-500/20 text-sky-400' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {release.type === 'major' ? <Tag className="w-4 h-4" /> : <GitCommit className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-mono font-bold ${
                      release.type === 'major' ? 'text-emerald-400' :
                      release.type === 'minor' ? 'text-sky-400' :
                      'text-zinc-300'
                    }`}>{release.version}</span>
                    <span className="text-zinc-600 text-xs">{release.date}</span>
                  </div>
                  <h2 className="text-white font-semibold text-lg mt-0.5">{release.title}</h2>
                </div>
              </div>

              {/* Changes */}
              <div className="ml-12 space-y-2">
                {release.changes.map((change, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={`text-xs mt-1 shrink-0 font-medium ${
                      change.type === 'feature' ? 'text-emerald-400' :
                      change.type === 'fix' ? 'text-amber-400' :
                      'text-sky-400'
                    }`}>
                      {change.type === 'feature' ? '+' : change.type === 'fix' ? '~' : '^'}
                    </span>
                    <span className="text-zinc-400 text-sm">{change.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming */}
        <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-6 mb-10">
          <h2 className="text-white font-semibold mb-4">Upcoming Features</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Here&apos;s what we&apos;re working on next. Star our repo or subscribe to get notified when these ship.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {upcomingFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-zinc-400 text-sm">
                <span className="text-emerald-500">⊕</span>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center">
          <p className="text-zinc-500 text-sm">
            Have a feature request? We&apos;d love to hear from you.
          </p>
          <p className="text-zinc-600 text-xs mt-1">
            Reach out at support@nexusapi.com or open an issue on GitHub.
          </p>
        </div>
      </div>
    </div>
  )
}
