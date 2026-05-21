'use client'

import { useState, useEffect } from 'react'
import { Play, Copy, Check, Loader2, ChevronDown, Terminal } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

interface Endpoint {
  label: string
  method: string
  path: string
  body?: Record<string, unknown>
  description: string
}

const ENDPOINTS: Endpoint[] = [
  {
    label: 'Get Properties',
    method: 'GET',
    path: '/api/v1/properties',
    description: 'List all properties with pagination',
  },
  {
    label: 'Create Property',
    method: 'POST',
    path: '/api/v1/properties',
    body: {
      title: 'Luxury Penthouse',
      description: 'Stunning penthouse with panoramic city views',
      property_type: 'apartment',
      status: 'available',
      price: 850000,
      currency: 'USD',
      bedrooms: 3,
      bathrooms: 2,
      area_sqft: 2200,
      address: '432 Park Avenue',
      city: 'New York',
      country: 'US',
      neighborhood: 'Midtown',
    },
    description: 'Create a new property listing',
  },
  {
    label: 'Generate Content',
    method: 'POST',
    path: '/api/v1/ai/generate',
    body: {
      content_type: 'property_description',
      property: {
        title: 'Modern Downtown Loft',
        property_type: 'apartment',
        price: 450000,
        currency: 'USD',
        bedrooms: 2,
        bathrooms: 1,
        city: 'San Francisco',
        neighborhood: 'SoMa',
      },
      options: {
        language: 'english',
        tone: 'professional',
        save: true,
      },
    },
    description: 'Generate AI content for a property',
  },
  {
    label: 'Get Leads',
    method: 'GET',
    path: '/api/v1/leads',
    description: 'List all leads with pagination',
  },
  {
    label: 'Create Lead',
    method: 'POST',
    path: '/api/v1/leads',
    body: {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1234567890',
      source: 'website',
      message: 'Interested in viewing the property',
    },
    description: 'Create a new lead',
  },
  {
    label: 'Get Analytics Overview',
    method: 'GET',
    path: '/api/v1/analytics/overview',
    description: 'Get analytics overview stats',
  },
  {
    label: 'Get Usage Data',
    method: 'GET',
    path: '/api/v1/analytics/usage',
    description: 'Get API usage analytics',
  },
  {
    label: 'List API Keys',
    method: 'GET',
    path: '/api/v1/account/keys',
    description: 'List all API keys',
  },
  {
    label: 'Get Account Info',
    method: 'GET',
    path: '/api/v1/account',
    description: 'Get current account information',
  },
  {
    label: 'Get Webhooks',
    method: 'GET',
    path: '/api/v1/webhooks',
    description: 'List all webhooks',
  },
  {
    label: 'Health Check',
    method: 'GET',
    path: '/api/v1/health',
    description: 'Check API health status (no auth required)',
  },
  {
    label: 'Get Content',
    method: 'GET',
    path: '/api/v1/content',
    description: 'List all generated content',
  },
]

const methodColors: Record<string, string> = {
  GET: 'text-emerald-400',
  POST: 'text-amber-400',
  PUT: 'text-sky-400',
  DELETE: 'text-red-400',
  PATCH: 'text-amber-400',
}

export function ApiPlayground() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [requestBody, setRequestBody] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [endpointDropdownOpen, setEndpointDropdownOpen] = useState(false)
  const addToast = useAppStore((s) => s.addToast)

  const selected = ENDPOINTS[selectedIdx]

  useEffect(() => {
    if (selected.body) {
      setRequestBody(JSON.stringify(selected.body, null, 2))
    } else {
      setRequestBody('')
    }
    setResponse(null)
    setStatusCode(null)
    setResponseTime(null)
  }, [selectedIdx, selected.body])

  const handleSend = async () => {
    setLoading(true)
    setResponse(null)
    setStatusCode(null)
    setResponseTime(null)

    const apiKey = localStorage.getItem('eq_api_key') || ''
    const startTime = performance.now()

    try {
      const options: RequestInit = {
        method: selected.method,
        headers: {
          'Content-Type': 'application/json',
          ...(selected.path !== '/api/v1/health' ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
      }

      if (selected.method !== 'GET' && requestBody.trim()) {
        options.body = requestBody
      }

      const res = await fetch(selected.path, options)
      const elapsed = Math.round(performance.now() - startTime)
      const data = await res.json()

      setStatusCode(res.status)
      setResponseTime(elapsed)
      setResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      const elapsed = Math.round(performance.now() - startTime)
      setResponseTime(elapsed)
      setStatusCode(0)
      setResponse(JSON.stringify({ error: err instanceof Error ? err.message : 'Request failed' }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const handleCopyResponse = async () => {
    if (response) {
      await navigator.clipboard.writeText(response)
      setCopied(true)
      addToast('Response copied to clipboard!', 'success')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getCurlCommand = () => {
    const apiKey = localStorage.getItem('eq_api_key') || ''
    let cmd = `curl -X ${selected.method} https://api.nexusapi.com${selected.path}`
    cmd += ` \\\n  -H "Content-Type: application/json"`
    if (selected.path !== '/api/v1/health' && apiKey) {
      cmd += ` \\\n  -H "Authorization: Bearer ${apiKey.slice(0, 10)}..."`
    }
    if (selected.method !== 'GET' && requestBody.trim()) {
      cmd += ` \\\n  -d '${requestBody.replace(/'/g, "\\'")}'`
    }
    return cmd
  }

  const getStatusBadgeClass = (code: number | null) => {
    if (!code) return ''
    if (code >= 200 && code < 300) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    if (code >= 400 && code < 500) return 'bg-red-500/10 text-red-400 border border-red-500/20'
    if (code >= 500) return 'bg-red-500/10 text-red-400 border border-red-500/20'
    return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">API Playground</h2>
        <p className="text-sm text-zinc-400 mt-1">Test API endpoints interactively — like a mini Postman</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel — Request */}
        <div className="space-y-4">
          {/* Endpoint Selector */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">Endpoint</label>
            <div className="relative">
              <button
                onClick={() => setEndpointDropdownOpen(!endpointDropdownOpen)}
                className="w-full flex items-center gap-3 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-lg px-3 py-2.5 text-left transition-colors cursor-pointer"
              >
                <span className={`text-sm font-mono font-bold ${methodColors[selected.method]}`}>
                  {selected.method}
                </span>
                <span className="text-sm text-zinc-300 font-mono flex-1 truncate">{selected.path}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${endpointDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {endpointDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto">
                  {ENDPOINTS.map((ep, i) => (
                    <button
                      key={`${ep.method}-${ep.path}`}
                      onClick={() => {
                        setSelectedIdx(i)
                        setEndpointDropdownOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-zinc-700/50 transition-colors cursor-pointer ${
                        i === selectedIdx ? 'bg-zinc-700/30' : ''
                      }`}
                    >
                      <span className={`text-xs font-mono font-bold w-14 ${methodColors[ep.method]}`}>
                        {ep.method}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-zinc-300 font-mono truncate">{ep.path}</div>
                        <div className="text-xs text-zinc-500 truncate">{ep.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Request Body */}
          {selected.method !== 'GET' && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
                Request Body (JSON)
              </label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs rounded-lg p-3 min-h-[240px] resize-y focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                spellCheck={false}
              />
            </div>
          )}

          {/* cURL Equivalent */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
              cURL Equivalent
            </label>
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
              <pre className="text-xs text-zinc-400 font-mono whitespace-pre-wrap break-all overflow-x-auto max-h-40 overflow-y-auto">
                {getCurlCommand()}
              </pre>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm px-4 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {loading ? 'Sending...' : 'Send Request'}
          </button>
        </div>

        {/* Right Panel — Response */}
        <div className="space-y-4">
          {/* Response Status Bar */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Response</label>
              {statusCode !== null && (
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${getStatusBadgeClass(statusCode)}`}>
                    {statusCode}
                  </span>
                  {responseTime !== null && (
                    <span className="text-xs text-zinc-500 font-mono">{responseTime}ms</span>
                  )}
                </div>
              )}
            </div>

            {response ? (
              <div className="relative">
                <button
                  onClick={handleCopyResponse}
                  className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer z-10"
                  title="Copy response"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 max-h-[500px] overflow-y-auto">
                  <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap break-all">
                    {response}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px]">
                <Terminal className="w-8 h-8 text-zinc-700 mb-3" />
                <p className="text-zinc-500 text-sm">Select an endpoint and click Send</p>
                <p className="text-zinc-600 text-xs mt-1">Response will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
