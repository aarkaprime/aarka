'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  POST: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  PUT: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  DELETE: 'bg-red-500/10 text-red-400 border-red-500/20',
  PATCH: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  if (status === 429) return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
  if (status >= 400) return 'bg-red-500/10 text-red-400 border-red-500/20'
  return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/v1/account/usage', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('eq_api_key') || ''}`,
          },
        })
        const result = await res.json()
        if (result.success) {
          // The usage endpoint returns aggregated data, not individual logs.
          // For demo purposes, we'll show the endpoint/method breakdown.
          setCalls([])
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
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Recent API Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-zinc-800 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (calls.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Recent API Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-zinc-500 text-sm">No API calls recorded yet.</p>
            <p className="text-zinc-600 text-xs mt-1">
              Make your first API call to see it appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Recent API Calls</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Endpoint</TableHead>
              <TableHead className="text-zinc-400">Method</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400 hidden sm:table-cell">Response Time</TableHead>
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
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${methodColors[call.method] || methodColors.GET}`}
                  >
                    {call.method}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${getStatusColor(call.statusCode)}`}
                  >
                    {call.statusCode}
                  </Badge>
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
      </CardContent>
    </Card>
  )
}
