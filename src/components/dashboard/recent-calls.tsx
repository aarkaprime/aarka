'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface UsageLog {
  id: string
  endpoint: string
  method: string
  statusCode: number
  responseTimeMs: number
  createdAt: string
}

interface UsageEntry {
  endpoint: string
  method: string
  count: number
}

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  POST: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  PUT: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  DELETE: 'bg-red-500/10 text-red-400 border border-red-500/20',
  PATCH: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
}

function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
  if (status === 429) return 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
  if (status >= 400) return 'bg-red-500/10 text-red-400 border border-red-500/20'
  return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function RecentCalls() {
  const [calls, setCalls] = useState<UsageLog[]>([])
  const [usageBreakdown, setUsageBreakdown] = useState<UsageEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = localStorage.getItem('eq_api_key') || ''
        const res = await fetch('/api/v1/account/usage', {
          headers: { Authorization: `Bearer ${apiKey}` },
        })
        const result = await res.json()
        if (result.success) {
          if (result.data?.usage_breakdown) {
            setUsageBreakdown(result.data.usage_breakdown)
          }
          if (result.data?.recent_calls) {
            setCalls(result.data.recent_calls.slice(0, 10))
          }
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 animate-pulse">
        <div className="h-6 w-36 bg-zinc-800 rounded mb-6" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-zinc-800/50 rounded" />
          ))}
        </div>
      </div>
    )
  }

  // If we have recent calls, show them in a table
  if (calls.length > 0) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
        <h3 className="text-white font-semibold mb-4">Recent API Calls</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Endpoint</TableHead>
                <TableHead className="text-zinc-400">Method</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400 hidden sm:table-cell">Latency</TableHead>
                <TableHead className="text-zinc-400">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call) => (
                <TableRow key={call.id} className="border-zinc-800">
                  <TableCell className="text-zinc-300 font-mono text-xs">
                    {call.endpoint}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${methodColors[call.method] || methodColors.GET}`}>
                      {call.method}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(call.statusCode)}`}>
                      {call.statusCode}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-400 text-xs hidden sm:table-cell">
                    {call.responseTimeMs}ms
                  </TableCell>
                  <TableCell className="text-zinc-500 text-xs">
                    {timeAgo(call.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  // If we have usage breakdown but no individual calls, show the breakdown
  if (usageBreakdown.length > 0) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
        <h3 className="text-white font-semibold mb-4">API Usage Breakdown</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Endpoint</TableHead>
                <TableHead className="text-zinc-400">Method</TableHead>
                <TableHead className="text-zinc-400 text-right">Calls</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usageBreakdown.map((entry, i) => (
                <TableRow key={`${entry.endpoint}-${entry.method}-${i}`} className="border-zinc-800">
                  <TableCell className="text-zinc-300 font-mono text-xs">
                    {entry.endpoint}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${methodColors[entry.method] || methodColors.GET}`}>
                      {entry.method}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-400 text-xs text-right">
                    {entry.count.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  // Empty state
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
      <h3 className="text-white font-semibold mb-4">Recent API Calls</h3>
      <div className="text-center py-8">
        <p className="text-zinc-500 text-sm">No API calls recorded yet.</p>
        <p className="text-zinc-600 text-xs mt-1">
          Make your first API call to see it appear here.
        </p>
      </div>
    </div>
  )
}
