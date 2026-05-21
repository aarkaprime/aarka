'use client'

import { useAppStore } from '@/store/app-store'
import { ArrowLeft, Play, Sparkles, Check } from 'lucide-react'
import { useState } from 'react'

export function DocsAIGeneration() {
  const setView = useAppStore((s) => s.setView)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeContentType, setActiveContentType] = useState('property_description')

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const contentTypes = [
    { id: 'property_description', label: 'Property Description', desc: 'Generate professional property listing descriptions' },
    { id: 'social_post', label: 'Social Media Posts', desc: 'Create platform-specific social media content' },
    { id: 'whatsapp_msg', label: 'WhatsApp Messages', desc: 'Generate WhatsApp marketing messages' },
    { id: 'email_campaign', label: 'Email Campaigns', desc: 'Create email templates for listings, open houses, price drops' },
    { id: 'ad_copy', label: 'Ad Copy', desc: 'Generate Facebook, Google, and Instagram ad copy' },
    { id: 'custom', label: 'Custom Content', desc: 'Freeform content generation with custom prompts' },
  ]

  const requestExample = `{
  "content_type": "property_description",
  "property": {
    "title": "Modern Downtown Loft",
    "property_type": "apartment",
    "location": "SoHo, New York",
    "neighborhood": "SoHo",
    "city": "New York",
    "country": "US",
    "price": 1250000,
    "currency": "USD",
    "bedrooms": 2,
    "bathrooms": 2,
    "area_sqm": 120,
    "features": ["Exposed brick", "High ceilings", "Rooftop access", "Concierge"],
    "description": "Stunning loft in the heart of SoHo"
  },
  "options": {
    "language": "english",
    "tone": "luxury",
    "count": 3,
    "save": true,
    "webhook_url": "https://yourapp.com/webhooks/nexusapi"
  }
}`

  const responseExample = `{
  "success": true,
  "data": {
    "results": [
      {
        "title": "Professional Listing",
        "content": "Welcome to this extraordinary SoHo loft, where industrial charm meets contemporary luxury. Spanning 120 square meters of thoughtfully designed living space, this 2-bedroom, 2-bathroom residence features soaring ceilings, exposed brick walls, and oversized windows that flood every corner with natural light...",
        "tone": "luxury",
        "word_count": 168
      },
      {
        "title": "Lifestyle Narrative",
        "content": "Imagine waking up in the heart of SoHo, sunlight streaming through floor-to-ceiling windows, the city's creative energy pulsing just beyond your door. This isn't just a loft — it's a statement. 120 square meters of pure Manhattan sophistication...",
        "tone": "luxury",
        "word_count": 145
      },
      {
        "title": "Short & Compelling",
        "content": "SoHo Loft | 2BR/2BA | $1.25M — Exposed brick, high ceilings, rooftop access. Where industrial heritage meets modern luxury in Manhattan's most coveted neighborhood...",
        "tone": "luxury",
        "word_count": 52
      }
    ],
    "total_results": 3,
    "total_tokens_used": 1542,
    "credits_remaining": 97
  }
}`

  const batchExample = `{
  "items": [
    {
      "content_type": "property_description",
      "property": { "title": "Beach Villa", "property_type": "villa", "location": "Malibu, CA", "price": 3500000, "bedrooms": 5, "bathrooms": 4 },
      "options": { "tone": "luxury", "count": 2 }
    },
    {
      "content_type": "social_post",
      "property": { "title": "Beach Villa", "property_type": "villa", "location": "Malibu, CA", "price": 3500000, "bedrooms": 5, "bathrooms": 4 },
      "options": { "language": "english", "platform": "instagram", "count": 3 }
    },
    {
      "content_type": "email_campaign",
      "property": { "title": "Beach Villa", "property_type": "villa", "location": "Malibu, CA", "price": 3500000, "bedrooms": 5, "bathrooms": 4 },
      "options": { "count": 1 }
    }
  ]
}`

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
          <Sparkles className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">AI Content Generation</h1>
        </div>
        <p className="text-zinc-400 text-lg mb-8">
          Generate property descriptions, social media posts, WhatsApp messages, email campaigns, and ad copy through a single powerful endpoint.
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
                <tr className="border-b border-zinc-800/50">
                  <td className="py-2.5 text-emerald-400 font-mono text-xs">/v1/ai/generate</td>
                  <td className="py-2.5"><span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">POST</span></td>
                  <td className="py-2.5 text-zinc-400">Generate AI content for a single property</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-2.5 text-emerald-400 font-mono text-xs">/v1/ai/generate/batch</td>
                  <td className="py-2.5"><span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">POST</span></td>
                  <td className="py-2.5 text-zinc-400">Generate multiple content types in one request</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Content types */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Content Types</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {contentTypes.map((ct) => (
              <button
                key={ct.id}
                onClick={() => setActiveContentType(ct.id)}
                className={`p-4 rounded-lg border text-left cursor-pointer transition-all ${
                  activeContentType === ct.id
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <code className={`text-xs font-mono ${activeContentType === ct.id ? 'text-emerald-400' : 'text-zinc-400'}`}>{ct.id}</code>
                <p className="text-white font-medium text-sm mt-1">{ct.label}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{ct.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Parameters */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Request Parameters</h2>
          <h3 className="text-white font-medium text-sm mb-3">Top-Level Parameters</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-400 font-medium">Parameter</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Type</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Required</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['content_type', 'string', 'Yes', 'Type of content to generate: property_description, social_post, whatsapp_msg, email_campaign, ad_copy, custom'],
                  ['property', 'object', 'Yes', 'Property data object (see Property schema below)'],
                  ['options', 'object', 'No', 'Generation options (language, tone, count, etc.)'],
                ].map(([param, type, req, desc]) => (
                  <tr key={param} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{param}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{type}</td>
                    <td className="py-2.5">{req === 'Yes' ? <span className="text-amber-400 text-xs">Required</span> : <span className="text-zinc-600 text-xs">Optional</span>}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-white font-medium text-sm mb-3">Property Object</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-400 font-medium">Field</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Type</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Required</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Default</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['title', 'string', 'Yes', '—', '1-200 characters'],
                  ['property_type', 'enum', 'Yes', '—', 'apartment, house, land, commercial, townhouse, villa, studio, duplex'],
                  ['location', 'string', 'Yes', '—', '1-300 characters'],
                  ['neighborhood', 'string', 'No', '—', 'Up to 200 characters'],
                  ['city', 'string', 'No', '—', 'Up to 100 characters'],
                  ['country', 'string', 'No', '—', 'Up to 100 characters'],
                  ['price', 'number', 'Yes', '—', 'Must be positive'],
                  ['currency', 'string', 'No', 'USD', 'Up to 10 characters'],
                  ['bedrooms', 'integer', 'No', '0', 'Minimum 0'],
                  ['bathrooms', 'integer', 'No', '0', 'Minimum 0'],
                  ['area_sqm', 'number', 'No', '—', 'Must be positive'],
                  ['features', 'string[]', 'No', '—', 'Max 30 items'],
                  ['description', 'string', 'No', '—', 'Up to 5000 characters'],
                ].map(([field, type, req, def, note]) => (
                  <tr key={field} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{field}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{type}</td>
                    <td className="py-2.5">{req === 'Yes' ? <span className="text-amber-400 text-xs">Required</span> : <span className="text-zinc-600 text-xs">Optional</span>}</td>
                    <td className="py-2.5 text-zinc-500 text-xs">{def}</td>
                    <td className="py-2.5 text-zinc-500 text-xs">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-white font-medium text-sm mb-3">Options Object</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-400 font-medium">Option</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Type</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Default</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['language', 'enum', 'english', 'english, spanish, french, german, portuguese, arabic, chinese, japanese, korean, hindi'],
                  ['tone', 'enum', 'professional', 'professional, casual, luxury, urgent, friendly'],
                  ['platform', 'enum', '—', 'facebook, instagram, twitter, whatsapp, email, google (for social/ad content)'],
                  ['custom_prompt', 'string', '—', 'Custom instructions (up to 2000 chars, for custom content_type)'],
                  ['count', 'integer', '3', 'Number of variations to generate (1-10)'],
                  ['save', 'boolean', 'true', 'Save generated content to your content library'],
                  ['webhook_url', 'string', '—', 'URL to receive webhook notification when content is generated'],
                ].map(([option, type, def, desc]) => (
                  <tr key={option} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{option}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{type}</td>
                    <td className="py-2.5 text-zinc-500 text-xs">{def}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Language and tone */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Supported Languages & Tones</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-3">Languages (10)</h3>
              <div className="flex flex-wrap gap-2">
                {['English', 'Spanish', 'French', 'German', 'Portuguese', 'Arabic', 'Chinese', 'Japanese', 'Korean', 'Hindi'].map((lang) => (
                  <span key={lang} className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">{lang}</span>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-3">Tones (5)</h3>
              <div className="space-y-2">
                {[
                  { name: 'professional', desc: 'Formal, objective, data-driven' },
                  { name: 'casual', desc: 'Conversational, approachable' },
                  { name: 'luxury', desc: 'Premium, aspirational, evocative' },
                  { name: 'urgent', desc: 'Time-sensitive, action-oriented' },
                  { name: 'friendly', desc: 'Warm, personal, community-focused' },
                ].map((tone) => (
                  <div key={tone.name} className="flex items-center gap-2">
                    <code className="text-emerald-400 text-xs bg-zinc-800 px-2 py-0.5 rounded">{tone.name}</code>
                    <span className="text-zinc-500 text-xs">— {tone.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Request example */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Request Example</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode(requestExample, 'request')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'request' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{requestExample}</pre>
          </div>
        </div>

        {/* Response example */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Response Example</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode(responseExample, 'response')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'response' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{responseExample}</pre>
          </div>
        </div>

        {/* Batch generation */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Batch Generation</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Generate multiple content types for one or more properties in a single request using <code className="text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded text-xs">/v1/ai/generate/batch</code>.
          </p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode(batchExample, 'batch')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'batch' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{batchExample}</pre>
          </div>
        </div>

        {/* Content type specifics */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Content Type Specifics</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium mb-2">property_description</h3>
              <p className="text-zinc-400 text-sm">Generates 1-10 listing descriptions with different tones. Each result includes a title, full description text, tone label, and word count.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium mb-2">social_post</h3>
              <p className="text-zinc-400 text-sm">Creates platform-optimized social media posts. Use the <code className="text-emerald-400 text-xs">platform</code> option to target facebook, instagram, or twitter. Posts include hashtags and emojis where appropriate.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium mb-2">whatsapp_msg</h3>
              <p className="text-zinc-400 text-sm">Generates WhatsApp-friendly messages — professional, casual, and urgent variants. Messages are concise, include emojis, and are optimized for mobile reading.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium mb-2">email_campaign</h3>
              <p className="text-zinc-400 text-sm">Creates 3 email templates: listing announcement, open house invitation, and price drop notification. Each includes subject line and body content.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium mb-2">ad_copy</h3>
              <p className="text-zinc-400 text-sm">Generates ad copy optimized for Facebook, Google, and Instagram. Use the <code className="text-emerald-400 text-xs">platform</code> option to target a specific platform. Includes headline, primary text, and description.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium mb-2">custom</h3>
              <p className="text-zinc-400 text-sm">Freeform content generation. Provide a <code className="text-emerald-400 text-xs">custom_prompt</code> in options to guide the AI. The property context is included automatically. Maximum 2000 characters for custom prompts.</p>
            </div>
          </div>
        </div>

        {/* Try in playground */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Try AI generation now</h3>
            <p className="text-zinc-400 text-sm">Generate your first property description in the Playground.</p>
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
