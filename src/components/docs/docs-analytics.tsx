'use client'

import { useAppStore } from '@/store/app-store'
import { ArrowLeft, Play, BarChart3, Check } from 'lucide-react'
import { useState } from 'react'

export function DocsAnalytics() {
  const setView = useAppStore((s) => s.setView)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => setView('docs')}
          className="text-zinc-500 hover:text-white text-sm flex items-center gap-1 mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Docs
        </button>

        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">Analytics API</h1>
        </div>
        <p className="text-zinc-400 text-lg mb-8">
          Get deep insights into your API usage, content performance, and lead conversion. Build dashboards and track ROI.
        </p>

        {/* Endpoints */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Endpoints</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-400 font-medium">Endpoint</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Method</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['/v1/analytics/overview', 'GET', 'High-level account overview with key metrics'],
                  ['/v1/analytics/usage', 'GET', 'Detailed API usage data (30 days)'],
                  ['/v1/analytics/content-performance', 'GET', 'Content generation performance metrics'],
                  ['/v1/analytics/leads-funnel', 'GET', 'Lead funnel and conversion analytics'],
                ].map(([endpoint, method, desc]) => (
                  <tr key={endpoint} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{endpoint}</td>
                    <td className="py-2.5"><span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{method}</span></td>
                    <td className="py-2.5 text-zinc-400">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overview */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative mb-4">
            <button
              onClick={() => copyCode('GET /v1/analytics/overview', 'overview')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'overview' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`GET /v1/analytics/overview

// Response:
{
  "success": true,
  "data": {
    "total_properties": 45,
    "total_leads": 130,
    "total_content": 312,
    "api_calls_this_month": 847,
    "conversion_rate": 0.133,
    "avg_response_time_ms": 245
  }
}`}</pre>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-400 font-medium">Field</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Type</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['total_properties', 'integer', 'Total properties in your account'],
                  ['total_leads', 'integer', 'Total leads across all statuses'],
                  ['total_content', 'integer', 'Total AI-generated content pieces'],
                  ['api_calls_this_month', 'integer', 'API calls made in the current billing period'],
                  ['conversion_rate', 'float', 'Lead-to-close conversion rate (0-1)'],
                  ['avg_response_time_ms', 'integer', 'Average API response time in milliseconds'],
                ].map(([field, type, desc]) => (
                  <tr key={field} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{field}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{type}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Usage Analytics</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative mb-4">
            <button
              onClick={() => copyCode('GET /v1/analytics/usage', 'usage')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'usage' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`GET /v1/analytics/usage

// Response:
{
  "success": true,
  "data": {
    "daily_calls": [
      { "date": "2025-01-15", "count": 42 },
      { "date": "2025-01-14", "count": 38 },
      // ... 30 days
    ],
    "total_tokens_used": 128450,
    "popular_endpoints": [
      { "endpoint": "/v1/ai/generate", "calls": 312, "percentage": 0.42 },
      { "endpoint": "/v1/properties", "calls": 189, "percentage": 0.25 },
      { "endpoint": "/v1/leads", "calls": 145, "percentage": 0.19 }
    ],
    "avg_response_time_per_endpoint": [
      { "endpoint": "/v1/ai/generate", "avg_ms": 1850 },
      { "endpoint": "/v1/properties", "avg_ms": 85 },
      { "endpoint": "/v1/leads", "avg_ms": 72 }
    ]
  }
}`}</pre>
          </div>
          <p className="text-zinc-400 text-sm">
            Use <code className="text-emerald-400 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">daily_calls</code> data to build time-series charts. The <code className="text-emerald-400 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">popular_endpoints</code> array helps identify which API resources your application uses most.
          </p>
        </div>

        {/* Content performance */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Content Performance</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative mb-4">
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`GET /v1/analytics/content-performance

// Response:
{
  "success": true,
  "data": {
    "by_type": [
      { "content_type": "property_description", "count": 120, "avg_tokens": 845 },
      { "content_type": "social_post", "count": 85, "avg_tokens": 320 },
      { "content_type": "whatsapp_msg", "count": 52, "avg_tokens": 180 },
      { "content_type": "email_campaign", "count": 35, "avg_tokens": 1100 },
      { "content_type": "ad_copy", "count": 20, "avg_tokens": 290 }
    ],
    "by_language": [
      { "language": "english", "count": 245 },
      { "language": "spanish", "count": 32 },
      { "language": "french", "count": 18 }
    ],
    "by_tone": [
      { "tone": "professional", "count": 140 },
      { "tone": "luxury", "count": 85 },
      { "tone": "casual", "count": 45 }
    ]
  }
}`}</pre>
          </div>
        </div>

        {/* Leads funnel */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Leads Funnel</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto">
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`GET /v1/analytics/leads-funnel

// Response:
{
  "success": true,
  "data": {
    "by_status": {
      "new": 45,
      "contacted": 32,
      "viewing": 18,
      "negotiation": 12,
      "closed": 8,
      "lost": 15
    },
    "by_source": {
      "website": 58,
      "api": 24,
      "whatsapp": 18,
      "manual": 12,
      "sms": 8,
      "webhook": 5,
      "other": 5
    },
    "by_property_type": {
      "apartment": 52,
      "house": 35,
      "villa": 22,
      "commercial": 15
    },
    "conversion_rates": {
      "new_to_contacted": 0.71,
      "contacted_to_viewing": 0.56,
      "viewing_to_negotiation": 0.67,
      "negotiation_to_closed": 0.67,
      "overall": 0.133
    }
  }
}`}</pre>
          </div>
        </div>

        {/* Dashboard guide */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Building Dashboards</h2>
          <div className="space-y-3">
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-2">1. Overview Widget</h3>
              <p className="text-zinc-400 text-xs">Use <code className="text-emerald-400">/analytics/overview</code> for top-level KPI cards: total properties, leads, API calls, and conversion rate.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-2">2. Usage Chart</h3>
              <p className="text-zinc-400 text-xs">Use <code className="text-emerald-400">/analytics/usage</code> daily_calls array to build a 30-day line/area chart of API activity.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-2">3. Content Breakdown</h3>
              <p className="text-zinc-400 text-xs">Use <code className="text-emerald-400">/analytics/content-performance</code> by_type data for a pie/donut chart showing content generation distribution.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-2">4. Lead Funnel</h3>
              <p className="text-zinc-400 text-xs">Use <code className="text-emerald-400">/analytics/leads-funnel</code> by_status for a horizontal bar chart or funnel visualization, and conversion_rates for stage-by-stage analysis.</p>
            </div>
          </div>
        </div>

        {/* Try in playground */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Explore your analytics</h3>
            <p className="text-zinc-400 text-sm">Query your analytics data in the API Playground.</p>
          </div>
          <button
            onClick={() => setView('playground')}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm px-4 py-2.5 rounded-lg cursor-pointer transition-colors"
          >
            <Play className="w-4 h-4" /> Try in Playground
          </button>
        </div>
      </div>
    </div>
  )
}
