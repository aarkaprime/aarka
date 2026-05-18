'use client'

import { useAppStore } from '@/store/app-store'
import { ArrowLeft, Play, Users, Check } from 'lucide-react'
import { useState } from 'react'

export function DocsLeads() {
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
          <Users className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">Leads API</h1>
        </div>
        <p className="text-zinc-400 text-lg mb-8">
          Track and manage property leads through their entire lifecycle — from first contact to closing.
        </p>

        {/* Lead lifecycle */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Lead Lifecycle</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Every lead progresses through a defined status pipeline. Updating a lead&apos;s status triggers a <code className="text-emerald-400 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">lead.status_changed</code> webhook event.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { status: 'new', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
              { status: 'contacted', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
              { status: 'viewing', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
              { status: 'negotiation', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
              { status: 'closed', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
            ].map((item, i) => (
              <div key={item.status} className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1.5 rounded-full border ${item.color} font-medium`}>
                  {item.status}
                </span>
                {i < 4 && <span className="text-zinc-600">→</span>}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-zinc-600 text-sm">Lost branch:</span>
            {[
              { status: 'new', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
            ].map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1.5 rounded-full border ${item.color}`}>{item.status}</span>
                <span className="text-zinc-600">→</span>
                <span className="text-xs px-3 py-1.5 rounded-full border bg-red-500/10 text-red-400 border-red-500/20">lost</span>
              </div>
            ))}
          </div>
        </div>

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
                  ['/v1/leads', 'GET', 'List leads with pagination and filters'],
                  ['/v1/leads', 'POST', 'Create a new lead'],
                  ['/v1/leads/batch', 'POST', 'Create up to 100 leads at once'],
                  ['/v1/leads/stats', 'GET', 'Get lead statistics and conversion rates'],
                  ['/v1/leads/:id', 'GET', 'Get a single lead'],
                  ['/v1/leads/:id', 'PUT', 'Update a lead (change status, add notes)'],
                  ['/v1/leads/:id', 'DELETE', 'Delete a lead'],
                ].map(([endpoint, method, desc]) => (
                  <tr key={`${endpoint}-${method}`} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{endpoint}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        method === 'POST' ? 'bg-amber-500/10 text-amber-400' :
                        method === 'PUT' ? 'bg-sky-500/10 text-sky-400' :
                        method === 'DELETE' ? 'bg-red-500/10 text-red-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
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

        {/* Create lead */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Create Lead</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode(`POST /v1/leads\n\n{\n  "name": "Jane Smith",\n  "email": "jane@example.com",\n  "phone": "+1-555-0123",\n  "message": "Interested in the SoHo loft listing",\n  "property_id": "prop_abc123",\n  "source": "website"\n}`, 'create-lead')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'create-lead' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`POST /v1/leads

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1-555-0123",
  "message": "Interested in the SoHo loft listing",
  "property_id": "prop_abc123",
  "source": "website"
}`}</pre>
          </div>

          <h3 className="text-white font-medium text-sm mb-3 mt-6">Lead Parameters</h3>
          <div className="overflow-x-auto">
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
                  ['name', 'string', 'Yes', 'Contact name (1-200 characters)'],
                  ['email', 'string', 'No', 'Valid email address'],
                  ['phone', 'string', 'No', 'Phone number (up to 30 characters)'],
                  ['message', 'string', 'No', 'Inquiry message (up to 5000 characters)'],
                  ['property_id', 'string', 'No', 'ID of the property the lead is interested in'],
                  ['source', 'enum', 'No', 'Lead source: api, webhook, manual, whatsapp, website, sms, other (default: api)'],
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
        </div>

        {/* List leads */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">List Leads</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto">
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`GET /v1/leads?page=1&limit=20&status=new&source=website&property_id=prop_abc123

// Query Parameters:
// page        - Page number (default: 1)
// limit       - Results per page, max 100 (default: 20)
// status      - Filter by status: new, contacted, viewing, negotiation, closed, lost
// source      - Filter by source: api, webhook, manual, whatsapp, website, sms, other
// property_id - Filter by associated property`}</pre>
          </div>
        </div>

        {/* Batch creation */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Batch Creation</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Create up to 100 leads in a single request. Triggers a <code className="text-emerald-400 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">lead.batch_created</code> webhook event.
          </p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto">
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`POST /v1/leads/batch

{
  "leads": [
    {
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "phone": "+1-555-0101",
      "source": "website",
      "property_id": "prop_abc123"
    },
    {
      "name": "Bob Williams",
      "email": "bob@example.com",
      "phone": "+1-555-0202",
      "source": "api",
      "property_id": "prop_def456"
    }
  ]
}

// Response:
{
  "success": true,
  "data": {
    "created": 2,
    "leads": [...]
  }
}`}</pre>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Lead Statistics</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto">
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`GET /v1/leads/stats

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
    "conversion_rate": 0.133,
    "total": 130
  }
}`}</pre>
          </div>
        </div>

        {/* Webhook events */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Lead Webhook Events</h2>
          <div className="space-y-2">
            {[
              { event: 'lead.created', desc: 'Fired when a new lead is created' },
              { event: 'lead.status_changed', desc: 'Fired when a lead\'s status is updated' },
              { event: 'lead.batch_created', desc: 'Fired when leads are created in batch' },
            ].map((item) => (
              <div key={item.event} className="flex items-center gap-3 rounded-lg bg-zinc-900/50 border border-zinc-800 p-3">
                <code className="text-emerald-400 text-xs bg-zinc-800 px-2 py-0.5 rounded">{item.event}</code>
                <span className="text-zinc-400 text-sm">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Try in playground */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Test the Leads API</h3>
            <p className="text-zinc-400 text-sm">Create leads and view stats in the API Playground.</p>
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
