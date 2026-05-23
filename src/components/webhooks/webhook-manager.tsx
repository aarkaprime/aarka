'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Loader2, Zap, Globe, CheckCircle2, XCircle, Webhook as WebhookIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppStore } from '@/store/app-store'

interface WebhookItem {
  id: string
  url: string
  events: string[]
  status: string
  success_count: number
  failure_count: number
  secret: string
  created_at: string
}

const EVENT_OPTIONS = [
  'chat.completion',
  'chat.failed',
  'api_key.created',
  'api_key.revoked',
  'account.upgraded',
  'usage.alert',
  'model.available',
  'model.degraded',
]

export function WebhookManager() {
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [testLoadingId, setTestLoadingId] = useState<string | null>(null)
  const [newUrl, setNewUrl] = useState('')
  const [newEvents, setNewEvents] = useState<string[]>(['chat.completion'])
  const addToast = useAppStore((s) => s.addToast)

  const fetchWebhooks = async () => {
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch('/api/v1/webhooks', {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      const result = await res.json()
      if (result.success) {
        setWebhooks(Array.isArray(result.data) ? result.data : [])
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWebhooks()
  }, [])

  const handleCreate = async () => {
    if (!newUrl.trim()) {
      addToast('Please enter a webhook URL.', 'error')
      return
    }
    if (newEvents.length === 0) {
      addToast('Please select at least one event.', 'error')
      return
    }

    setCreateLoading(true)
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch('/api/v1/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ url: newUrl.trim(), events: newEvents }),
      })
      const result = await res.json()
      if (result.success) {
        addToast('Webhook created successfully!', 'success')
        setDialogOpen(false)
        setNewUrl('')
        setNewEvents(['chat.completion'])
        fetchWebhooks()
      } else {
        addToast(result.error?.message || 'Failed to create webhook.', 'error')
      }
    } catch {
      addToast('An error occurred while creating the webhook.', 'error')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch(`/api/v1/webhooks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      const result = await res.json()
      if (result.success) {
        addToast('Webhook deleted.', 'success')
        fetchWebhooks()
      } else {
        addToast(result.error?.message || 'Failed to delete webhook.', 'error')
      }
    } catch {
      addToast('An error occurred while deleting the webhook.', 'error')
    }
  }

  const handleTest = async (id: string) => {
    setTestLoadingId(id)
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch(`/api/v1/webhooks/${id}/test`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      const result = await res.json()
      if (result.success) {
        addToast('Test event sent successfully!', 'success')
      } else {
        addToast(result.error?.message || 'Test event failed.', 'error')
      }
    } catch {
      addToast('Failed to send test event.', 'error')
    } finally {
      setTestLoadingId(null)
    }
  }

  const toggleEvent = (event: string) => {
    setNewEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Webhooks</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage webhook endpoints for real-time event notifications</p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Webhook
        </button>
      </div>

      {/* Content */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        ) : webhooks.length === 0 ? (
          <div className="text-center py-12">
            <WebhookIcon className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm font-medium">No webhooks configured</p>
            <p className="text-zinc-600 text-xs mt-1">
              Add a webhook to receive real-time event notifications.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-900">
                  <TableHead className="text-zinc-400">URL</TableHead>
                  <TableHead className="text-zinc-400">Events</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400 hidden sm:table-cell">Success / Fail</TableHead>
                  <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((wh) => (
                  <TableRow key={wh.id} className="border-zinc-800 hover:bg-zinc-900/30">
                    <TableCell className="font-mono text-xs text-zinc-300 max-w-[200px] truncate">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                        <span className="truncate">{wh.url}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {wh.events.slice(0, 2).map((ev) => (
                          <span key={ev} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            {ev.split('.')[1]}
                          </span>
                        ))}
                        {wh.events.length > 2 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">
                            +{wh.events.length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          wh.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                        }`}
                      >
                        {wh.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />{wh.success_count}
                        </span>
                        <span className="flex items-center gap-1 text-red-400">
                          <XCircle className="w-3 h-3" />{wh.failure_count}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTest(wh.id)}
                          disabled={testLoadingId === wh.id}
                          className="text-zinc-400 hover:text-emerald-400 transition-colors disabled:opacity-50 cursor-pointer p-1"
                          title="Send test event"
                        >
                          {testLoadingId === wh.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Zap className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(wh.id)}
                          className="text-zinc-400 hover:text-red-400 transition-colors cursor-pointer p-1"
                          title="Delete webhook"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create Webhook Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(v) => !v && setDialogOpen(false)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Add Webhook</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Create a new webhook endpoint to receive event notifications.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-300 font-medium">Webhook URL</label>
              <input
                placeholder="https://your-app.com/api/webhooks"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-300 font-medium">Events</label>
              <div className="grid grid-cols-2 gap-2">
                {EVENT_OPTIONS.map((event) => (
                  <label
                    key={event}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                      newEvents.includes(event)
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={newEvents.includes(event)}
                      onChange={() => toggleEvent(event)}
                      className="sr-only"
                    />
                    {event.split('.')[1]}
                  </label>
                ))}
              </div>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3">
              <p className="text-xs text-zinc-400">
                <span className="text-zinc-300 font-medium">Auto-generated secret:</span> A webhook signing secret will be generated automatically. Use it to verify incoming payloads.
              </p>
            </div>
            <button
              onClick={handleCreate}
              disabled={createLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {createLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Webhook
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
