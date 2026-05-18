'use client'

import { useAppStore } from '@/store/app-store'
import { ArrowLeft, Play, Zap, Key, Terminal, Check } from 'lucide-react'
import { useState } from 'react'

export function DocsGettingStarted() {
  const setView = useAppStore((s) => s.setView)
  const [activeTab, setActiveTab] = useState<'js' | 'python' | 'curl'>('js')
  const [copiedStep, setCopiedStep] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedStep(id)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const jsCode = `// Install the HTTP client of your choice
// npm install node-fetch (or use built-in fetch)

const response = await fetch('https://api.estateiq.com/v1/ai/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ei_sk_your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content_type: 'property_description',
    property: {
      title: 'Luxury Penthouse with Skyline Views',
      property_type: 'apartment',
      location: 'Upper East Side, New York',
      price: 850000,
      currency: 'USD',
      bedrooms: 3,
      bathrooms: 2,
      features: ['Rooftop terrace', 'Doorman', 'Gym']
    },
    options: {
      language: 'english',
      tone: 'luxury',
      count: 3
    }
  })
});

const data = await response.json();
console.log(data.results);`

  const pythonCode = `# Install requests: pip install requests

import requests

response = requests.post(
    'https://api.estateiq.com/v1/ai/generate',
    headers={
        'Authorization': 'Bearer ei_sk_your_api_key_here',
        'Content-Type': 'application/json'
    },
    json={
        'content_type': 'property_description',
        'property': {
            'title': 'Luxury Penthouse with Skyline Views',
            'property_type': 'apartment',
            'location': 'Upper East Side, New York',
            'price': 850000,
            'currency': 'USD',
            'bedrooms': 3,
            'bathrooms': 2,
            'features': ['Rooftop terrace', 'Doorman', 'Gym']
        },
        'options': {
            'language': 'english',
            'tone': 'luxury',
            'count': 3
        }
    }
)

data = response.json()
print(data['results'])`

  const curlCode = `curl -X POST https://api.estateiq.com/v1/ai/generate \\
  -H "Authorization: Bearer ei_sk_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content_type": "property_description",
    "property": {
      "title": "Luxury Penthouse with Skyline Views",
      "property_type": "apartment",
      "location": "Upper East Side, New York",
      "price": 850000,
      "currency": "USD",
      "bedrooms": 3,
      "bathrooms": 2,
      "features": ["Rooftop terrace", "Doorman", "Gym"]
    },
    "options": {
      "language": "english",
      "tone": "luxury",
      "count": 3
    }
  }'`

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => setView('docs')}
          className="text-zinc-500 hover:text-white text-sm flex items-center gap-1 mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Docs
        </button>

        <h1 className="text-3xl font-bold text-white mb-4">Getting Started</h1>
        <p className="text-zinc-400 text-lg mb-8">
          Get your API key and make your first AI content generation call in under 60 seconds.
        </p>

        {/* Quick start badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-full px-4 py-1.5 mb-10">
          <Zap className="w-3.5 h-3.5" />
          Get Your API Key in 60 Seconds
        </div>

        {/* Step 1 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">1</div>
            <h2 className="text-xl font-semibold text-white">Create Your Account</h2>
          </div>
          <p className="text-zinc-400 mb-4 ml-11">
            Sign up for a free account at EstateIQ. No credit card required. You&apos;ll start on the Free plan with 100 API calls per month.
          </p>
          <div className="ml-11 rounded-lg bg-zinc-900/50 border border-zinc-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span className="text-white font-medium text-sm">Free Plan Includes</span>
            </div>
            <ul className="text-sm text-zinc-400 space-y-1 ml-6">
              <li>&#8226; 100 API calls/month</li>
              <li>&#8226; 1 API key</li>
              <li>&#8226; All content types</li>
              <li>&#8226; 10 supported languages</li>
              <li>&#8226; Community support</li>
            </ul>
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">2</div>
            <h2 className="text-xl font-semibold text-white">Get Your API Key</h2>
          </div>
          <p className="text-zinc-400 mb-4 ml-11">
            After registration, you&apos;ll receive your API key starting with <code className="text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded text-xs">ei_sk_</code>. You can also create additional keys from the dashboard.
          </p>
          <div className="ml-11 rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode('ei_sk_live_a1b2c3d4e5f6g7h8i9j0...', 'step2')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedStep === 'step2' ? <Check className="w-4 h-4 text-emerald-400" /> : <Terminal className="w-4 h-4" />}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">ei_sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6</pre>
          </div>
          <div className="ml-11 mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <p className="text-amber-400 text-sm">
              <strong>Important:</strong> Store your API key securely. Never expose it in client-side code or public repositories. The full key is only shown once at creation.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">3</div>
            <h2 className="text-xl font-semibold text-white">Make Your First API Call</h2>
          </div>
          <p className="text-zinc-400 mb-4 ml-11">
            Use your API key to generate AI content. Here&apos;s a quick example in three languages:
          </p>

          <div className="ml-11">
            {/* Language tabs */}
            <div className="flex gap-1 mb-0">
              {[
                { id: 'js' as const, label: 'JavaScript' },
                { id: 'python' as const, label: 'Python' },
                { id: 'curl' as const, label: 'cURL' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg cursor-pointer transition-colors ${
                    activeTab === tab.id
                      ? 'bg-zinc-950 text-white border border-zinc-800 border-b-transparent'
                      : 'bg-zinc-900/30 text-zinc-500 hover:text-zinc-300 border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="rounded-b-lg rounded-tr-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
              <button
                onClick={() => copyCode(activeTab === 'js' ? jsCode : activeTab === 'python' ? pythonCode : curlCode, 'step3')}
                className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
              >
                {copiedStep === 'step3' ? <Check className="w-4 h-4 text-emerald-400" /> : <Terminal className="w-4 h-4" />}
              </button>
              <pre className="text-sm text-zinc-300 font-mono whitespace-pre">
                {activeTab === 'js' ? jsCode : activeTab === 'python' ? pythonCode : curlCode}
              </pre>
            </div>
          </div>
        </div>

        {/* Response example */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Example Response</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto">
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`{
  "success": true,
  "data": {
    "results": [
      {
        "title": "Professional Listing",
        "content": "Perched high above Manhattan's iconic Upper East Side...",
        "tone": "luxury",
        "word_count": 156
      },
      {
        "title": "Lifestyle Narrative",
        "content": "Wake up every morning to panoramic skyline views...",
        "tone": "luxury",
        "word_count": 142
      },
      {
        "title": "Short & Punchy",
        "content": "3BR/2BA Penthouse | Upper East Side | $850,000...",
        "tone": "luxury",
        "word_count": 48
      }
    ],
    "total_results": 3,
    "total_tokens_used": 1247,
    "credits_remaining": 97
  }
}`}</pre>
          </div>
        </div>

        {/* Installation */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Installation & Setup</h2>
          <div className="grid gap-4">
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-4">
              <h3 className="text-white font-medium text-sm mb-2">Base URL</h3>
              <code className="text-emerald-400 text-sm bg-zinc-950 px-3 py-1.5 rounded block">https://api.estateiq.com/v1</code>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-4">
              <h3 className="text-white font-medium text-sm mb-2">Authentication Header</h3>
              <code className="text-emerald-400 text-sm bg-zinc-950 px-3 py-1.5 rounded block">Authorization: Bearer ei_sk_your_api_key_here</code>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-4">
              <h3 className="text-white font-medium text-sm mb-2">Content Type</h3>
              <code className="text-emerald-400 text-sm bg-zinc-950 px-3 py-1.5 rounded block">Content-Type: application/json</code>
            </div>
          </div>
        </div>

        {/* Quick reference table */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">API Quick Reference</h2>
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
                  ['/v1/ai/generate', 'POST', 'Generate AI content'],
                  ['/v1/properties', 'GET/POST', 'List or create properties'],
                  ['/v1/leads', 'GET/POST', 'List or create leads'],
                  ['/v1/analytics/overview', 'GET', 'Get usage overview'],
                  ['/v1/webhooks', 'GET/POST', 'Manage webhooks'],
                  ['/v1/health', 'GET', 'API health check (no auth)'],
                ].map(([endpoint, method, desc]) => (
                  <tr key={endpoint} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{endpoint}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${method.includes('POST') ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
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

        {/* Try in playground */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Ready to try it?</h3>
            <p className="text-zinc-400 text-sm">Head to the API Playground to test endpoints with your own data.</p>
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
