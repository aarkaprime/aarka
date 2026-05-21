'use client'

import { useAppStore } from '@/store/app-store'
import { ArrowLeft, Play, Clock, Check } from 'lucide-react'
import { useState } from 'react'

export function DocsRateLimits() {
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
          <Clock className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">Rate Limits</h1>
        </div>
        <p className="text-zinc-400 text-lg mb-8">
          NexusAPI enforces rate limits to ensure fair usage and platform stability. Limits are applied per API key using a sliding window algorithm.
        </p>

        {/* How rate limiting works */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">How Rate Limiting Works</h2>
          <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-6">
            <p className="text-zinc-300 text-sm leading-relaxed">
              Rate limits are applied using a <strong className="text-white">sliding window</strong> algorithm with a 60-second window. Each API key has its own rate limit counter. When you exceed the limit, subsequent requests receive a <code className="text-emerald-400 text-xs bg-zinc-800 px-1 rounded">429 Too Many Requests</code> response until the window resets.
            </p>
          </div>
        </div>

        {/* Limits per plan */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Limits Per Plan</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-400 font-medium">Plan</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Requests/Min</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Monthly Quota</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">API Keys</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Webhooks</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Free', '10', '100', '1', '1'],
                  ['Starter', '30', '1,000', '3', '3'],
                  ['Professional', '60', '10,000', '10', '10'],
                  ['Business', '120', '50,000', '25', '25'],
                  ['Enterprise', 'Custom', 'Unlimited', 'Unlimited', 'Unlimited'],
                ].map(([plan, rpm, monthly, keys, webhooks]) => (
                  <tr key={plan} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-white font-medium">{plan}</td>
                    <td className="py-2.5 text-zinc-300">{rpm}</td>
                    <td className="py-2.5 text-zinc-300">{monthly}</td>
                    <td className="py-2.5 text-zinc-300">{keys}</td>
                    <td className="py-2.5 text-zinc-300">{webhooks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Response headers */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Rate Limit Response Headers</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Every API response includes headers that tell you your current rate limit status:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-400 font-medium">Header</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Example</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['X-RateLimit-Limit', '60', 'Maximum requests allowed per minute'],
                  ['X-RateLimit-Remaining', '45', 'Requests remaining in the current window'],
                  ['X-RateLimit-Reset', '1705312200', 'Unix timestamp when the rate limit window resets'],
                  ['X-Monthly-Quota', '10000', 'Monthly API call quota for your plan'],
                  ['X-Monthly-Used', '847', 'API calls used in the current billing period'],
                ].map(([header, example, desc]) => (
                  <tr key={header} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{header}</td>
                    <td className="py-2.5 text-zinc-300 font-mono text-xs">{example}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rate limit exceeded response */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Rate Limit Exceeded Response</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode(`HTTP/1.1 429 Too Many Requests\n\n{\n  "success": false,\n  "error": {\n    "code": "RATE_LIMIT_EXCEEDED",\n    "message": "Too many requests. Slow down and retry.",\n    "status": 429,\n    "retry_after": 23\n  }\n}`, '429')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === '429' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`HTTP/1.1 429 Too Many Requests

{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Slow down and retry.",
    "status": 429,
    "retry_after": 23
  }
}`}</pre>
          </div>
          <p className="text-zinc-400 text-sm mt-3">
            The <code className="text-emerald-400 text-xs bg-zinc-800 px-1 rounded">retry_after</code> field tells you how many seconds to wait before making another request.
          </p>
        </div>

        {/* Monthly quota exceeded */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Monthly Quota Exceeded</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto">
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`HTTP/1.1 429 Too Many Requests

{
  "success": false,
  "error": {
    "code": "MONTHLY_QUOTA_EXCEEDED",
    "message": "Monthly API call quota exceeded. Upgrade your plan or wait for reset.",
    "status": 429
  }
}`}</pre>
          </div>
          <p className="text-zinc-400 text-sm mt-3">
            When you hit your monthly quota, all API calls will return 429 until the next billing cycle. Upgrade your plan to increase your quota immediately.
          </p>
        </div>

        {/* Best practices */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Best Practices</h2>
          <div className="space-y-3">
            {[
              {
                title: 'Check response headers',
                desc: 'Monitor X-RateLimit-Remaining on every response. When it gets low, slow down or queue requests.',
              },
              {
                title: 'Implement exponential backoff',
                desc: 'When you receive a 429, wait for the retry_after seconds before retrying. Use exponential backoff with jitter for repeated failures.',
              },
              {
                title: 'Cache responses',
                desc: 'Cache property data and generated content locally to reduce unnecessary API calls. Content changes less frequently than you might think.',
              },
              {
                title: 'Batch operations',
                desc: 'Use batch endpoints (like /v1/ai/generate/batch and /v1/leads/batch) to reduce the number of API calls needed.',
              },
              {
                title: 'Use webhooks instead of polling',
                desc: 'Subscribe to webhook events instead of repeatedly polling for status changes. This reduces API calls and gives you real-time updates.',
              },
              {
                title: 'Distribute load across keys',
                desc: 'If you have multiple API keys, distribute requests across them to maximize throughput. Each key has independent rate limits.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-lg bg-zinc-900/50 border border-zinc-800 p-4">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium text-sm">{item.title}</h3>
                  <p className="text-zinc-400 text-xs mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exponential backoff example */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Exponential Backoff Example</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode(`async function apiCallWithRetry(url, options, maxRetries = 3) {\n  for (let attempt = 0; attempt <= maxRetries; attempt++) {\n    const response = await fetch(url, options);\n    \n    if (response.status === 429) {\n      const data = await response.json();\n      const retryAfter = data.error?.retry_after || Math.pow(2, attempt);\n      console.log(\`Rate limited. Retrying after \${retryAfter}s...\`);\n      await new Promise(r => setTimeout(r, retryAfter * 1000));\n      continue;\n    }\n    \n    return response;\n  }\n  throw new Error('Max retries exceeded');\n}`, 'backoff')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'backoff' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`async function apiCallWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const data = await response.json();
      const retryAfter = data.error?.retry_after || Math.pow(2, attempt);
      console.log(\`Rate limited. Retrying after \${retryAfter}s...\`);
      await new Promise(r => setTimeout(r, retryAfter * 1000));
      continue;
    }
    
    return response;
  }
  throw new Error('Max retries exceeded');
}`}</pre>
          </div>
        </div>

        {/* Try in playground */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Test rate limiting</h3>
            <p className="text-zinc-400 text-sm">Make rapid API calls in the Playground to observe rate limit headers.</p>
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
