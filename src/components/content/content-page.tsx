'use client'

import { useEffect, useState } from 'react'
import { Trash2, Loader2, FileText, Search, X, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
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

interface ContentItem {
  id: string
  content_type: string
  language: string
  tone: string
  tokens_used: number
  model: string
  body: string
  property_id: string | null
  created_at: string
}

export function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const addToast = useAppStore((s) => s.addToast)

  const fetchContent = async () => {
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch('/api/v1/content', {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      const result = await res.json()
      if (result.success) {
        setContent(Array.isArray(result.data) ? result.data : result.data?.content || [])
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch(`/api/v1/content/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      const result = await res.json()
      if (result.success) {
        addToast('Content deleted.', 'success')
        fetchContent()
      } else {
        addToast(result.error?.message || 'Failed to delete content.', 'error')
      }
    } catch {
      addToast('An error occurred.', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const handleView = (item: ContentItem) => {
    setSelectedContent(item)
    setViewDialogOpen(true)
  }

  const contentTypeLabels: Record<string, string> = {
    property_description: 'Description',
    social_post: 'Social Post',
    whatsapp_msg: 'WhatsApp',
    email_campaign: 'Email',
    ad_copy: 'Ad Copy',
    custom: 'Custom',
  }

  const contentTypeColors: Record<string, string> = {
    property_description: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    social_post: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    whatsapp_msg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    email_campaign: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    ad_copy: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    custom: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
  }

  const filteredContent = content.filter((c) => {
    const matchesType = typeFilter === 'all' || c.content_type === typeFilter
    const matchesSearch = !search.trim() ||
      c.content_type.toLowerCase().includes(search.toLowerCase()) ||
      c.body?.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Generated Content</h2>
        <p className="text-sm text-zinc-400 mt-1">View and manage AI-generated content history</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-700 cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="property_description">Description</option>
          <option value="social_post">Social Post</option>
          <option value="whatsapp_msg">WhatsApp</option>
          <option value="email_campaign">Email</option>
          <option value="ad_copy">Ad Copy</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm font-medium">{search || typeFilter !== 'all' ? 'No content matches your filters' : 'No content generated yet'}</p>
            <p className="text-zinc-600 text-xs mt-1">
              {search || typeFilter !== 'all' ? 'Try different filters' : 'Use the AI generation API to create content.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-900">
                  <TableHead className="text-zinc-400">Type</TableHead>
                  <TableHead className="text-zinc-400 hidden sm:table-cell">Language</TableHead>
                  <TableHead className="text-zinc-400 hidden md:table-cell">Tone</TableHead>
                  <TableHead className="text-zinc-400 hidden sm:table-cell">Tokens</TableHead>
                  <TableHead className="text-zinc-400 hidden lg:table-cell">Date</TableHead>
                  <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.map((item) => (
                  <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-900/30">
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${contentTypeColors[item.content_type] || contentTypeColors.custom}`}>
                        {contentTypeLabels[item.content_type] || item.content_type}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-400 text-xs capitalize hidden sm:table-cell">{item.language}</TableCell>
                    <TableCell className="text-zinc-400 text-xs capitalize hidden md:table-cell">{item.tone}</TableCell>
                    <TableCell className="text-zinc-400 text-xs hidden sm:table-cell">{item.tokens_used?.toLocaleString() || '—'}</TableCell>
                    <TableCell className="text-zinc-500 text-xs hidden lg:table-cell">
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleView(item)}
                          className="text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer p-1"
                          title="View content"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer p-1"
                          title="Delete"
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
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

      {/* View Content Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={(v) => !v && setViewDialogOpen(false)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedContent ? contentTypeLabels[selectedContent.content_type] || selectedContent.content_type : 'Content Details'}
            </DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-4 mt-4">
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${contentTypeColors[selectedContent.content_type] || contentTypeColors.custom}`}>
                  {contentTypeLabels[selectedContent.content_type] || selectedContent.content_type}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 capitalize">{selectedContent.language}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 capitalize">{selectedContent.tone}</span>
                {selectedContent.tokens_used && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{selectedContent.tokens_used} tokens</span>
                )}
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                <pre className="text-sm text-zinc-300 font-sans whitespace-pre-wrap break-words">
                  {selectedContent.body || 'No content body available.'}
                </pre>
              </div>
              <div className="text-xs text-zinc-500">
                Created {new Date(selectedContent.created_at).toLocaleString()} • Model: {selectedContent.model || 'deepseek-chat'}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
