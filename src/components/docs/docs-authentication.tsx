'use client'

import { useAppStore } from '@/store/app-store'
import { ArrowLeft, Play, Shield, Check, X, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

export function DocsAuthentication() {
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

        <h1 className="text-3xl font-bold text-white mb-4">Authentication</h1>
        <p className="text-zinc-400 text-lg mb-8">
          All EstateIQ API endpoints require authentication via Bearer token in the Authorization header, except the health check endpoint.
        </p>

        {/* Overview */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">How Authentication Works</h2>
          <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  EstateIQ uses API keys for authentication. Each API key starts with <code className="text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded text-xs">ei_sk_</code> and is sent as a Bearer token in the <code className="text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded text-xs">Authorization</code> header. API keys are tied to your developer account and inherit your plan&apos;s rate limits and quotas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Correct usage */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Correct Authentication</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode(`Authorization: Bearer ei_sk_live_a1b2c3d4e5f6g7h8i9j0`, 'correct')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'correct' ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4" />}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`# Include the API key in the Authorization header
curl https://api.estateiq.com/v1/ai/generate \\
  -H "Authorization: Bearer ei_sk_live_a1b2c3d4e5f6g7h8i9j0" \\
  -H "Content-Type: application/json"

# JavaScript example
fetch('https://api.estateiq.com/v1/ai/generate', {
  headers: {
    'Authorization': 'Bearer ei_sk_live_a1b2c3d4e5f6g7h8i9j0',
    'Content-Type': 'application/json'
  }
})`}</pre>
          </div>
          <div className="flex items-center gap-2 mt-3 text-emerald-400 text-sm">
            <Check className="w-4 h-4" />
            Always use HTTPS and include the full key after &quot;Bearer&quot;
          </div>
        </div>

        {/* Incorrect usage */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Common Mistakes</h2>
          <div className="space-y-3">
            <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-4">
              <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-2">
                <X className="w-4 h-4" /> Don&apos;t use the API key as a query parameter
              </div>
              <code className="text-red-400/70 text-xs bg-zinc-950 px-2 py-1 rounded block">
                &#10005; https://api.estateiq.com/v1/properties?api_key=ei_sk_...
              </code>
            </div>
            <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-4">
              <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-2">
                <X className="w-4 h-4" /> Don&apos;t forget the &quot;Bearer&quot; prefix
              </div>
              <code className="text-red-400/70 text-xs bg-zinc-950 px-2 py-1 rounded block">
                &#10005; Authorization: ei_sk_live_a1b2c3d4e5f6g7h8i9j0
              </code>
            </div>
            <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-4">
              <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-2">
                <X className="w-4 h-4" /> Don&apos;t use &quot;Basic&quot; auth
              </div>
              <code className="text-red-400/70 text-xs bg-zinc-950 px-2 py-1 rounded block">
                &#10005; Authorization: Basic ei_sk_live_a1b2c3d4e5f6g7h8i9j0
              </code>
            </div>
          </div>
        </div>

        {/* API Key management */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">API Key Management</h2>
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
                  ['/v1/account/keys', 'GET', 'List all API keys (masked)'],
                  ['/v1/account/keys', 'POST', 'Create a new API key'],
                  ['/v1/account/keys/:id', 'DELETE', 'Revoke an API key'],
                  ['/v1/validate/api-key', 'POST', 'Validate current API key'],
                ].map(([endpoint, method, desc]) => (
                  <tr key={`${endpoint}-${method}`} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{endpoint}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${method === 'POST' ? 'bg-amber-500/10 text-amber-400' : method === 'DELETE' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {method}
                      </span>
                    </td>
                    <td className="py-2.5 text-zinc-400">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key environments */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">API Key Environments</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-zinc-900/50 border border-emerald-500/20 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">test</span>
                <h3 className="text-white font-medium">Test Key</h3>
              </div>
              <p className="text-zinc-400 text-sm">Prefix: <code className="text-emerald-400">ei_sk_test_</code></p>
              <p className="text-zinc-500 text-xs mt-2">Use for development and testing. Shares the same rate limits as production keys.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-amber-500/20 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">production</span>
                <h3 className="text-white font-medium">Production Key</h3>
              </div>
              <p className="text-zinc-400 text-sm">Prefix: <code className="text-amber-400">ei_sk_live_</code></p>
              <p className="text-zinc-500 text-xs mt-2">Use for live applications. Full access to all features and real data.</p>
            </div>
          </div>
        </div>

        {/* Error codes */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Authentication Error Codes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-400 font-medium">Status</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Code</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [401, 'MISSING_API_KEY', 'No Authorization header provided. Include "Bearer ei_sk_..." in the header.'],
                  [401, 'INVALID_API_KEY', 'The API key provided is invalid or does not exist.'],
                  [401, 'API_KEY_REVOKED', 'This API key has been revoked. Create a new one from the dashboard.'],
                  [403, 'ACCOUNT_SUSPENDED', 'Your account has been suspended. Contact support for assistance.'],
                  [429, 'RATE_LIMIT_EXCEEDED', 'Too many requests. Respect the rate limit headers and retry after the indicated time.'],
                  [429, 'MONTHLY_QUOTA_EXCEEDED', 'Monthly API call quota exceeded. Upgrade your plan or wait for the next billing cycle.'],
                ].map(([status, code, desc]) => (
                  <tr key={code as string} className="border-b border-zinc-800/50">
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        status === 401 ? 'bg-red-500/10 text-red-400' :
                        status === 403 ? 'bg-amber-500/10 text-amber-400' :
                        'bg-orange-500/10 text-orange-400'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-2.5 text-zinc-300 font-mono text-xs">{code}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 mt-4 overflow-x-auto">
            <p className="text-zinc-500 text-xs mb-2">Example error response:</p>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The API key provided is invalid.",
    "status": 401
  }
}`}</pre>
          </div>
        </div>

        {/* Best practices */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Best Practices</h2>
          <div className="space-y-3">
            {[
              { icon: Shield, title: 'Use environment variables', desc: 'Never hardcode API keys in source code. Use .env files or secret managers.' },
              { icon: AlertTriangle, title: 'Rotate keys regularly', desc: 'Create new keys and revoke old ones periodically to minimize exposure risk.' },
              { icon: Check, title: 'Use test keys in development', desc: 'Use test keys (ei_sk_test_*) during development to avoid accidental production data changes.' },
              { icon: Shield, title: 'Restrict key permissions', desc: 'Create separate keys for different environments and services. Revoke unused keys immediately.' },
              { icon: AlertTriangle, title: 'Monitor usage', desc: 'Check the usage dashboard regularly for unexpected API call patterns that may indicate a compromised key.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-lg bg-zinc-900/50 border border-zinc-800 p-4">
                <item.icon className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium text-sm">{item.title}</h3>
                  <p className="text-zinc-400 text-xs mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Try in playground */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Test authentication live</h3>
            <p className="text-zinc-400 text-sm">Use the Playground to validate your API key and test authenticated endpoints.</p>
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
