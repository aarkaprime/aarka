'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Loader2, Users, Search, X } from 'lucide-react'
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

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  source: string
  status: string
  message: string
  property_id: string | null
  created_at: string
}

interface LeadStats {
  total: number
  by_status: Record<string, number>
  by_source: Record<string, number>
  conversion_rate: number
}

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<LeadStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const addToast = useAppStore((s) => s.addToast)

  // Form state
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formSource, setFormSource] = useState('website')
  const [formMessage, setFormMessage] = useState('')

  const fetchData = async () => {
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const headers = { Authorization: `Bearer ${apiKey}` }

      const [leadsRes, statsRes] = await Promise.all([
        fetch('/api/v1/leads', { headers }),
        fetch('/api/v1/leads/stats', { headers }),
      ])

      const leadsResult = await leadsRes.json()
      const statsResult = await statsRes.json()

      if (leadsResult.success) {
        setLeads(Array.isArray(leadsResult.data) ? leadsResult.data : leadsResult.data?.leads || [])
      }
      if (statsResult.success) {
        setStats(statsResult.data)
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreate = async () => {
    if (!formName.trim() || !formEmail.trim()) {
      addToast('Please enter name and email.', 'error')
      return
    }
    setCreateLoading(true)
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch('/api/v1/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          name: formName.trim(),
          email: formEmail.trim(),
          phone: formPhone.trim() || undefined,
          source: formSource,
          message: formMessage.trim() || undefined,
        }),
      })
      const result = await res.json()
      if (result.success) {
        addToast('Lead created successfully!', 'success')
        setCreateDialogOpen(false)
        resetForm()
        fetchData()
      } else {
        addToast(result.error?.message || 'Failed to create lead.', 'error')
      }
    } catch {
      addToast('An error occurred while creating the lead.', 'error')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch(`/api/v1/leads/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      const result = await res.json()
      if (result.success) {
        addToast('Lead deleted.', 'success')
        fetchData()
      } else {
        addToast(result.error?.message || 'Failed to delete lead.', 'error')
      }
    } catch {
      addToast('An error occurred.', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch(`/api/v1/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      const result = await res.json()
      if (result.success) {
        addToast(`Lead status updated to ${newStatus}.`, 'success')
        fetchData()
      } else {
        addToast(result.error?.message || 'Failed to update lead.', 'error')
      }
    } catch {
      addToast('An error occurred.', 'error')
    }
  }

  const resetForm = () => {
    setFormName('')
    setFormEmail('')
    setFormPhone('')
    setFormSource('website')
    setFormMessage('')
  }

  const statusColors: Record<string, string> = {
    new: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    contacted: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    qualified: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    converted: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    lost: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }

  const filteredLeads = leads.filter((l) => {
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter
    const matchesSearch = !search.trim() ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Leads</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage and track your leads</p>
        </div>
        <button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
            <div className="text-xs text-zinc-500 mb-1">Total Leads</div>
            <div className="text-xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
            <div className="text-xs text-zinc-500 mb-1">Conversion Rate</div>
            <div className="text-xl font-bold text-emerald-400">{stats.conversion_rate?.toFixed(1) || 0}%</div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
            <div className="text-xs text-zinc-500 mb-1">New</div>
            <div className="text-xl font-bold text-sky-400">{stats.by_status?.new || 0}</div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
            <div className="text-xs text-zinc-500 mb-1">Qualified</div>
            <div className="text-xl font-bold text-amber-400">{stats.by_status?.qualified || 0}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search leads..."
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-700 cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm font-medium">{search || statusFilter !== 'all' ? 'No leads match your filters' : 'No leads yet'}</p>
            <p className="text-zinc-600 text-xs mt-1">
              {search || statusFilter !== 'all' ? 'Try different filters' : 'Add your first lead to get started.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-900">
                  <TableHead className="text-zinc-400">Name</TableHead>
                  <TableHead className="text-zinc-400 hidden sm:table-cell">Email</TableHead>
                  <TableHead className="text-zinc-400 hidden md:table-cell">Source</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="border-zinc-800 hover:bg-zinc-900/30">
                    <TableCell>
                      <div>
                        <div className="text-white font-medium text-sm">{lead.name}</div>
                        <div className="text-zinc-500 text-xs sm:hidden">{lead.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-400 text-xs hidden sm:table-cell">{lead.email}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 capitalize">{lead.source}</span>
                    </TableCell>
                    <TableCell>
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                        className={`text-xs px-2 py-0.5 rounded-full border-0 cursor-pointer appearance-none ${statusColors[lead.status] || 'bg-zinc-700 text-zinc-400'}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => handleDelete(lead.id)}
                        disabled={deletingId === lead.id}
                        className="text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer p-1"
                        title="Delete"
                      >
                        {deletingId === lead.id ? (
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

      {/* Create Lead Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={(v) => !v && setCreateDialogOpen(false)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Add Lead</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Create a new lead entry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">Name *</label>
              <input
                placeholder="John Smith"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">Email *</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">Phone</label>
              <input
                placeholder="+1 234 567 890"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">Source</label>
              <select
                value={formSource}
                onChange={(e) => setFormSource(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social_media">Social Media</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="walk_in">Walk-in</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">Message</label>
              <textarea
                placeholder="Lead message..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-y"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={createLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {createLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Lead
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
