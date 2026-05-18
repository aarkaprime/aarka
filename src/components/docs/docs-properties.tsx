'use client'

import { useAppStore } from '@/store/app-store'
import { ArrowLeft, Play, Building2, Check } from 'lucide-react'
import { useState } from 'react'

export function DocsProperties() {
  const setView = useAppStore((s) => s.setView)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const listResponse = `{
  "success": true,
  "data": [
    {
      "id": "prop_abc123",
      "title": "Luxury Penthouse with Skyline Views",
      "property_type": "apartment",
      "location": "Upper East Side, New York",
      "city": "New York",
      "country": "US",
      "price": 850000,
      "currency": "USD",
      "bedrooms": 3,
      "bathrooms": 2,
      "area_sqm": 180,
      "features": ["Rooftop terrace", "Doorman", "Gym", "Concierge"],
      "status": "active",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}`

  const createBody = `{
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
  "features": ["Exposed brick", "High ceilings", "Rooftop access"],
  "description": "Stunning loft in the heart of SoHo"
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
          <Building2 className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">Properties API</h1>
        </div>
        <p className="text-zinc-400 text-lg mb-8">
          Full CRUD operations for property listings. Create, read, update, delete, search, and filter properties with rich query support.
        </p>

        {/* Endpoints table */}
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
                  ['/v1/properties', 'GET', 'List all properties with pagination and filters'],
                  ['/v1/properties', 'POST', 'Create a new property'],
                  ['/v1/properties/search', 'GET', 'Full-text search across properties'],
                  ['/v1/properties/:id', 'GET', 'Get a single property with content and leads'],
                  ['/v1/properties/:id', 'PUT', 'Update a property'],
                  ['/v1/properties/:id', 'DELETE', 'Delete a property'],
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

        {/* List properties */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">List Properties</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative mb-4">
            <button
              onClick={() => copyCode(`GET /v1/properties?page=1&limit=20&status=active&property_type=apartment&city=New+York&sort=created_at&order=desc`, 'list')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'list' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`GET /v1/properties?page=1&limit=20&status=active&property_type=apartment&city=New+York&sort=created_at&order=desc`}</pre>
          </div>

          <h3 className="text-white font-medium text-sm mb-3">Query Parameters</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-400 font-medium">Parameter</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Type</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Default</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['page', 'integer', '1', 'Page number for pagination'],
                  ['limit', 'integer', '20', 'Results per page (max 100)'],
                  ['status', 'string', '—', 'Filter by status: active, sold, rented, draft'],
                  ['property_type', 'string', '—', 'Filter by type: apartment, house, land, commercial, townhouse, villa, studio, duplex'],
                  ['city', 'string', '—', 'Filter by city name'],
                  ['country', 'string', '—', 'Filter by country code'],
                  ['min_price', 'number', '—', 'Minimum price filter'],
                  ['max_price', 'number', '—', 'Maximum price filter'],
                  ['min_bedrooms', 'integer', '—', 'Minimum number of bedrooms'],
                  ['max_bedrooms', 'integer', '—', 'Maximum number of bedrooms'],
                  ['search', 'string', '—', 'Search across title, location, and description'],
                  ['sort', 'string', 'created_at', 'Sort field: created_at, price, title, updated_at'],
                  ['order', 'string', 'desc', 'Sort order: asc or desc'],
                ].map(([param, type, def, desc]) => (
                  <tr key={param} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{param}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{type}</td>
                    <td className="py-2.5 text-zinc-500 text-xs">{def}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-white font-medium text-sm mb-3">Response</h3>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto">
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{listResponse}</pre>
          </div>
        </div>

        {/* Create property */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Create Property</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative mb-4">
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`POST /v1/properties
Content-Type: application/json`}</pre>
          </div>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode(createBody, 'create')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'create' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{createBody}</pre>
          </div>
        </div>

        {/* Search */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Search Properties</h2>
          <p className="text-zinc-400 text-sm mb-4">
            The <code className="text-emerald-400 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">/v1/properties/search</code> endpoint performs full-text search across title, location, description, neighborhood, and city fields.
          </p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto">
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`GET /v1/properties/search?q=penthouse+manhattan&min_price=500000&property_type=apartment&sort=price&order=desc

// Supports all the same filter parameters as GET /v1/properties
// Plus the "q" parameter for full-text search`}</pre>
          </div>
        </div>

        {/* Get single */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Get Property Details</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto">
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`GET /v1/properties/:id

// Response includes the property plus related generated content and leads:
{
  "success": true,
  "data": {
    "id": "prop_abc123",
    "title": "Luxury Penthouse...",
    // ... all property fields ...
    "generated_content": [...],  // AI-generated content for this property
    "leads": [...]               // Leads associated with this property
  }
}`}</pre>
          </div>
        </div>

        {/* Update and Delete */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Update & Delete</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-2">Update Property</h3>
              <code className="text-sky-400 text-xs block mb-2">PUT /v1/properties/:id</code>
              <p className="text-zinc-400 text-xs">Send partial or full property object. Only included fields will be updated.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-2">Delete Property</h3>
              <code className="text-red-400 text-xs block mb-2">DELETE /v1/properties/:id</code>
              <p className="text-zinc-400 text-xs">Hard delete. Associated generated content and leads are preserved but unlinked.</p>
            </div>
          </div>
        </div>

        {/* Try in playground */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Test the Properties API</h3>
            <p className="text-zinc-400 text-sm">Create and search properties in the API Playground.</p>
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
