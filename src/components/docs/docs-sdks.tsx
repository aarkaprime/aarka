'use client'

import { useAppStore } from '@/store/app-store'
import { ArrowLeft, Code2, Check } from 'lucide-react'
import { useState } from 'react'

export function DocsSDKs() {
  const setView = useAppStore((s) => s.setView)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'js' | 'python' | 'php' | 'ruby'>('js')

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const jsCode = `import { EstateIQ } from '@estateiq/sdk';

const client = new EstateIQ({
  apiKey: process.env.ESTATEIQ_API_KEY,
  baseURL: 'https://api.estateiq.com/v1'
});

// Generate property descriptions
const result = await client.ai.generate({
  content_type: 'property_description',
  property: {
    title: 'Modern Downtown Loft',
    property_type: 'apartment',
    location: 'SoHo, New York',
    price: 1250000,
    currency: 'USD',
    bedrooms: 2,
    bathrooms: 2,
    features: ['Exposed brick', 'High ceilings']
  },
  options: {
    language: 'english',
    tone: 'luxury',
    count: 3
  }
});

console.log(result.results);

// List properties
const properties = await client.properties.list({
  status: 'active',
  city: 'New York',
  limit: 10
});

// Create a lead
const lead = await client.leads.create({
  name: 'Jane Smith',
  email: 'jane@example.com',
  source: 'website',
  property_id: 'prop_abc123'
});

// Get analytics overview
const analytics = await client.analytics.overview();`

  const pythonCode = `from estateiq import EstateIQ

client = EstateIQ(api_key="ei_sk_your_api_key_here")

# Generate property descriptions
result = client.ai.generate(
    content_type="property_description",
    property={
        "title": "Modern Downtown Loft",
        "property_type": "apartment",
        "location": "SoHo, New York",
        "price": 1250000,
        "currency": "USD",
        "bedrooms": 2,
        "bathrooms": 2,
        "features": ["Exposed brick", "High ceilings"]
    },
    options={
        "language": "english",
        "tone": "luxury",
        "count": 3
    }
)

print(result.results)

# List properties
properties = client.properties.list(
    status="active",
    city="New York",
    limit=10
)

# Create a lead
lead = client.leads.create(
    name="Jane Smith",
    email="jane@example.com",
    source="website",
    property_id="prop_abc123"
)

# Get analytics
analytics = client.analytics.overview()`

  const phpCode = `<?php

use EstateIQ\\Client;

$client = new Client('ei_sk_your_api_key_here');

// Generate property descriptions
$result = $client->ai()->generate([
    'content_type' => 'property_description',
    'property' => [
        'title' => 'Modern Downtown Loft',
        'property_type' => 'apartment',
        'location' => 'SoHo, New York',
        'price' => 1250000,
        'currency' => 'USD',
        'bedrooms' => 2,
        'bathrooms' => 2,
        'features' => ['Exposed brick', 'High ceilings']
    ],
    'options' => [
        'language' => 'english',
        'tone' => 'luxury',
        'count' => 3
    ]
]);

print_r($result->results);

// List properties
$properties = $client->properties()->list([
    'status' => 'active',
    'city' => 'New York',
    'limit' => 10
]);

// Create a lead
$lead = $client->leads()->create([
    'name' => 'Jane Smith',
    'email' => 'jane@example.com',
    'source' => 'website',
    'property_id' => 'prop_abc123'
]);`

  const rubyCode = `require 'estateiq'

client = EstateIQ::Client.new(api_key: 'ei_sk_your_api_key_here')

# Generate property descriptions
result = client.ai.generate(
  content_type: 'property_description',
  property: {
    title: 'Modern Downtown Loft',
    property_type: 'apartment',
    location: 'SoHo, New York',
    price: 1_250_000,
    currency: 'USD',
    bedrooms: 2,
    bathrooms: 2,
    features: ['Exposed brick', 'High ceilings']
  },
  options: {
    language: 'english',
    tone: 'luxury',
    count: 3
  }
)

puts result.results

# List properties
properties = client.properties.list(
  status: 'active',
  city: 'New York',
  limit: 10
)

# Create a lead
lead = client.leads.create(
  name: 'Jane Smith',
  email: 'jane@example.com',
  source: 'website',
  property_id: 'prop_abc123'
)`

  const tabContent: Record<string, string> = {
    js: jsCode,
    python: pythonCode,
    php: phpCode,
    ruby: rubyCode,
  }

  const tabs = [
    { id: 'js' as const, label: 'JavaScript / Node.js', install: 'npm install @estateiq/sdk' },
    { id: 'python' as const, label: 'Python', install: 'pip install estateiq' },
    { id: 'php' as const, label: 'PHP', install: 'composer require estateiq/sdk' },
    { id: 'ruby' as const, label: 'Ruby', install: 'gem install estateiq' },
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

        <div className="flex items-center gap-3 mb-4">
          <Code2 className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">SDKs</h1>
        </div>
        <p className="text-zinc-400 text-lg mb-8">
          Official client libraries to help you integrate EstateIQ faster. Type-safe, documented, and auto-generated from our OpenAPI spec.
        </p>

        {/* Coming soon banner */}
        <div className="mb-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-white font-semibold">Official SDKs Coming Soon</h2>
          </div>
          <p className="text-zinc-400 text-sm">
            We&apos;re building official SDKs for JavaScript/TypeScript, Python, PHP, and Ruby. They&apos;ll feature full TypeScript types, automatic retries, request/response logging, and comprehensive error handling.
          </p>
          <p className="text-zinc-500 text-xs mt-2">
            In the meantime, use the code examples below to integrate with standard HTTP clients.
          </p>
        </div>

        {/* Language tabs */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Usage Examples</h2>
          
          <div className="flex gap-1 mb-0">
            {tabs.map((tab) => (
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

          {/* Install command */}
          <div className="mb-0.5 bg-zinc-900/50 border border-zinc-800 border-b-0 px-4 py-2 rounded-t-none">
            <span className="text-zinc-500 text-xs">Install: </span>
            <code className="text-emerald-400 text-xs">{tabs.find(t => t.id === activeTab)?.install}</code>
          </div>

          {/* Code block */}
          <div className="rounded-b-lg rounded-tr-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode(tabContent[activeTab], `sdk-${activeTab}`)}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === `sdk-${activeTab}` ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{tabContent[activeTab]}</pre>
          </div>
        </div>

        {/* SDK features */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Planned SDK Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Type Safety', desc: 'Full TypeScript types and Python type hints. Auto-generated from our OpenAPI specification.' },
              { title: 'Automatic Retries', desc: 'Built-in retry logic with exponential backoff for transient failures and rate limits.' },
              { title: 'Request Logging', desc: 'Configurable logging for debugging. See exact requests and responses during development.' },
              { title: 'Error Handling', desc: 'Typed error classes for each error code. Catch specific errors with native try/catch.' },
              { title: 'Pagination Helpers', desc: 'Automatic pagination with async iterators. No manual page management needed.' },
              { title: 'Webhook Verification', desc: 'Built-in HMAC-SHA256 signature verification helper. One function call to verify.' },
            ].map((feature) => (
              <div key={feature.title} className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-4">
                <h3 className="text-white font-medium text-sm mb-1">{feature.title}</h3>
                <p className="text-zinc-400 text-xs">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* REST API alternative */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Using the REST API Directly</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Until the official SDKs are released, you can use any HTTP client to call the EstateIQ REST API. Here are minimal examples:
          </p>
          <div className="space-y-4">
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-2">JavaScript (fetch)</h3>
              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 overflow-x-auto">
                <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`const response = await fetch('https://api.estateiq.com/v1/ai/generate', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.ESTATEIQ_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content_type: 'property_description',
    property: { title: 'My Property', property_type: 'apartment', location: 'New York', price: 500000 },
    options: { count: 3 }
  })
});
const data = await response.json();`}</pre>
              </div>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-2">Python (requests)</h3>
              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 overflow-x-auto">
                <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`import requests

response = requests.post(
    'https://api.estateiq.com/v1/ai/generate',
    headers={
        'Authorization': f'Bearer {os.environ["ESTATEIQ_API_KEY"]}',
        'Content-Type': 'application/json'
    },
    json={
        'content_type': 'property_description',
        'property': {'title': 'My Property', 'property_type': 'apartment', 'location': 'New York', 'price': 500000},
        'options': {'count': 3}
    }
)
data = response.json()`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Notification signup */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6 text-center">
          <h3 className="text-white font-semibold mb-2">Want to be notified when SDKs launch?</h3>
          <p className="text-zinc-400 text-sm mb-4">
            Star our GitHub repository or subscribe to developer updates. We&apos;ll announce SDK releases on our changelog and via email.
          </p>
          <button
            onClick={() => setView('docs-changelog')}
            className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg cursor-pointer transition-colors"
          >
            View Changelog
          </button>
        </div>
      </div>
    </div>
  )
}
