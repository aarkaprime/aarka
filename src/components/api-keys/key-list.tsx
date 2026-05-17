'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  const addToast = useAppStore((s) => s.addToast)

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/v1/account/keys', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('eq_api_key') || ''}`,
        },
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
    try {
      const res = await fetch(`/api/v1/account/keys/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('eq_api_key') || ''}`,
        },
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
    }
  }

  return (
    <>
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">API Keys</CardTitle>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Key
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-500 text-sm">No API keys yet.</p>
              <p className="text-zinc-600 text-xs mt-1">
                Create your first API key to start making requests.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
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
                    <TableRow key={key.id} className="border-zinc-800">
                      <TableCell className="text-white font-medium">
                        {key.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            key.environment === 'live'
                              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                              : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                          }`}
                        >
                          {key.environment}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-zinc-400">
                        {key.key_prefix}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            key.status === 'active'
                              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                              : 'border-red-500/30 text-red-400 bg-red-500/10'
                          }`}
                        >
                          {key.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-500 text-xs hidden sm:table-cell">
                        {key.last_used_at
                          ? new Date(key.last_used_at).toLocaleDateString()
                          : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRevoke(key.id)}
                          className="text-zinc-400 hover:text-red-400 cursor-pointer"
                          disabled={key.status === 'revoked'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateKeyDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={fetchKeys}
      />
    </>
  )
}
