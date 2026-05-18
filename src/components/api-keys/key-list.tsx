'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Loader2, Key } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppStore } from '@/store/app-store'
import { CreateKeyDialog } from './create-key-dialog'

interface ApiKeyItem {
  id: string
  name: string
  key_prefix: string
  environment: string
  status: string
  monthly_calls_used: number
  monthly_calls_limit: number
  last_used_at: string | null
  created_at: string
}

export function KeyList() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const addToast = useAppStore((s) => s.addToast)

  const fetchKeys = async () => {
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch('/api/v1/account/keys', {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      const result = await res.json()
      if (result.success) {
        setKeys(Array.isArray(result.data) ? result.data : [])
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKeys()
  }, [])

  const handleRevoke = async (id: string) => {
    setRevokingId(id)
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch(`/api/v1/account/keys/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      const result = await res.json()
      if (result.success) {
        addToast('API key revoked successfully.', 'success')
        fetchKeys()
      } else {
        addToast(result.error?.message || 'Failed to revoke key.', 'error')
      }
    } catch {
      addToast('An error occurred while revoking the key.', 'error')
    } finally {
      setRevokingId(null)
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">API Keys</h2>
            <p className="text-sm text-zinc-400 mt-1">Manage your API keys for authentication</p>
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New Key
          </button>
        </div>

        {/* Content */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-12">
              <Key className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm font-medium">No API keys yet</p>
              <p className="text-zinc-600 text-xs mt-1">
                Create your first API key to start making requests.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-900">
                    <TableHead className="text-zinc-400">Name</TableHead>
                    <TableHead className="text-zinc-400">Environment</TableHead>
                    <TableHead className="text-zinc-400">Key</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                    <TableHead className="text-zinc-400 hidden sm:table-cell">Last Used</TableHead>
                    <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.map((key) => (
                    <TableRow key={key.id} className="border-zinc-800 hover:bg-zinc-900/30">
                      <TableCell className="text-white font-medium">
                        {key.name}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            key.environment === 'production' || key.environment === 'live'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {key.environment === 'live' ? 'production' : key.environment}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-zinc-400">
                        {key.key_prefix}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            key.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {key.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-500 text-xs hidden sm:table-cell">
                        {key.last_used_at
                          ? new Date(key.last_used_at).toLocaleDateString()
                          : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => handleRevoke(key.id)}
                          disabled={key.status === 'revoked' || revokingId === key.id}
                          className="text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer p-1"
                        >
                          {revokingId === key.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <CreateKeyDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={fetchKeys}
      />
    </>
  )
}
