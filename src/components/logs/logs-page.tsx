'use client'

import { useEffect, useState } from 'react'
import { Loader2, FileText, Clock, Zap, Hash } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

interface UsageLogItem {
  id: string
  endpoint: string
  method: string
  statusCode: number
  tokensUsed: number
  responseTimeMs: number
  createdAt: string
}

export function LogsPage() {
  const [logs, setLogs] = useState<UsageLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const addToast = useAppStore((s) => s.addToast)

  useEffect(() => {
    fetchLogs()
  }, [page])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch(`/api/v1/account/usage?page=${page}&limit=50`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      const result = await res.json()
      if (result.success) {
        setLogs(Array.isArray(result.data?.logs) ? result.data.logs : Array.isArray(result.data) ? result.data : [])
      }
    } catch {
      addToast('Failed to load logs', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return 'text-emerald-400 bg-emerald-500/10'
    if (code >= 400 && code < 500) return 'text-amber-400 bg-amber-500/10'
    if (code >= 500) return 'text-red-400 bg-red-500/10'
    return 'text-zinc-400 bg-zinc-500/10'
  }

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'text-emerald-400',
      POST: 'text-amber-400',
      PUT: 'text-sky-400',
      DELETE: 'text-red-400',
      PATCH: 'text-amber-400',
    }
    return colors[method] || 'text-zinc-400'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">API Logs</h2>
        <p className="text-sm text-zinc-400 mt-1">Recent API call history and details</p>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm font-medium">No API logs yet</p>
          <p className="text-zinc-600 text-xs mt-1">Make API calls to see logs here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono font-bold ${getMethodColor(log.method)}`}>
                    {log.method}
                  </span>
                  <span className="text-sm text-zinc-300 font-mono">{log.endpoint}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${getStatusColor(log.statusCode)}`}>
                  {log.statusCode}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{log.responseTimeMs}ms</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>{log.tokensUsed} tokens</span>
                </div>
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  <span>{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="text-xs text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer px-3 py-1.5 rounded bg-zinc-800 border border-zinc-700"
            >
              Previous
            </button>
            <span className="text-xs text-zinc-500">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              className="text-xs text-zinc-400 hover:text-white cursor-pointer px-3 py-1.5 rounded bg-zinc-800 border border-zinc-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
