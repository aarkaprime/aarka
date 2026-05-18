'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Loader2, Search, Building2, Eye, X } from 'lucide-react'
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

interface Property {
  id: string
  title: string
  property_type: string
  status: string
  price: number
  currency: string
  city: string
  country: string
  bedrooms: number
  bathrooms: number
  area_sqft: number
  address: string
  neighborhood: string
  description: string
  created_at: string
  updated_at: string
}

interface PropertyDetail extends Property {
  generated_content: Array<{ id: string; content_type: string; language: string }>
  leads: Array<{ id: string; name: string; status: string }>
}

export function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const addToast = useAppStore((s) => s.addToast)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formType, setFormType] = useState('apartment')
  const [formPrice, setFormPrice] = useState('')
  const [formCity, setFormCity] = useState('')
  const [formBedrooms, setFormBedrooms] = useState('')
  const [formBathrooms, setFormBathrooms] = useState('')
  const [formArea, setFormArea] = useState('')
  const [formDescription, setFormDescription] = useState('')

  const fetchProperties = async () => {
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch('/api/v1/properties', {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      const result = await res.json()
      if (result.success) {
        setProperties(Array.isArray(result.data) ? result.data : result.data?.properties || [])
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleCreate = async () => {
    if (!formTitle.trim()) {
      addToast('Please enter a property title.', 'error')
      return
    }
    setCreateLoading(true)
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch('/api/v1/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          title: formTitle.trim(),
          property_type: formType,
          price: formPrice ? Number(formPrice) : 0,
          currency: 'USD',
          city: formCity.trim() || undefined,
          bedrooms: formBedrooms ? Number(formBedrooms) : undefined,
          bathrooms: formBathrooms ? Number(formBathrooms) : undefined,
          area_sqft: formArea ? Number(formArea) : undefined,
          description: formDescription.trim() || undefined,
          status: 'available',
          country: 'US',
        }),
      })
      const result = await res.json()
      if (result.success) {
        addToast('Property created successfully!', 'success')
        setCreateDialogOpen(false)
        resetForm()
        fetchProperties()
      } else {
        addToast(result.error?.message || 'Failed to create property.', 'error')
      }
    } catch {
      addToast('An error occurred while creating the property.', 'error')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch(`/api/v1/properties/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      const result = await res.json()
      if (result.success) {
        addToast('Property deleted.', 'success')
        fetchProperties()
      } else {
        addToast(result.error?.message || 'Failed to delete property.', 'error')
      }
    } catch {
      addToast('An error occurred.', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const handleViewDetail = async (id: string) => {
    setDetailLoading(true)
    setDetailDialogOpen(true)
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch(`/api/v1/properties/${id}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      const result = await res.json()
      if (result.success) {
        setSelectedProperty(result.data)
      }
    } catch {
      addToast('Failed to load property details.', 'error')
    } finally {
      setDetailLoading(false)
    }
  }

  const resetForm = () => {
    setFormTitle('')
    setFormType('apartment')
    setFormPrice('')
    setFormCity('')
    setFormBedrooms('')
    setFormBathrooms('')
    setFormArea('')
    setFormDescription('')
  }

  const filteredProperties = properties.filter((p) =>
    !search.trim() ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase()) ||
    p.property_type?.toLowerCase().includes(search.toLowerCase())
  )

  const statusColors: Record<string, string> = {
    available: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    sold: 'bg-red-500/10 text-red-400 border border-red-500/20',
    rented: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Properties</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage your property listings</p>
        </div>
        <button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          placeholder="Search properties..."
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

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm font-medium">{search ? 'No properties match your search' : 'No properties yet'}</p>
            <p className="text-zinc-600 text-xs mt-1">
              {search ? 'Try a different search term' : 'Add your first property to get started.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-900">
                  <TableHead className="text-zinc-400">Title</TableHead>
                  <TableHead className="text-zinc-400">Type</TableHead>
                  <TableHead className="text-zinc-400">Price</TableHead>
                  <TableHead className="text-zinc-400 hidden md:table-cell">Location</TableHead>
                  <TableHead className="text-zinc-400 hidden sm:table-cell">Beds</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((prop) => (
                  <TableRow key={prop.id} className="border-zinc-800 hover:bg-zinc-900/30">
                    <TableCell className="text-white font-medium">{prop.title}</TableCell>
                    <TableCell className="text-zinc-400 text-xs capitalize">{prop.property_type}</TableCell>
                    <TableCell className="text-zinc-300 text-sm">
                      {prop.currency === 'USD' ? '$' : prop.currency}{prop.price?.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-zinc-400 text-xs hidden md:table-cell">
                      {prop.city}{prop.country ? `, ${prop.country}` : ''}
                    </TableCell>
                    <TableCell className="text-zinc-400 text-xs hidden sm:table-cell">{prop.bedrooms || '—'}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[prop.status] || statusColors.available}`}>
                        {prop.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewDetail(prop.id)}
                          className="text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer p-1"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id)}
                          disabled={deletingId === prop.id}
                          className="text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer p-1"
                          title="Delete"
                        >
                          {deletingId === prop.id ? (
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

      {/* Create Property Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={(v) => !v && setCreateDialogOpen(false)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Add Property</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Create a new property listing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">Title *</label>
              <input
                placeholder="e.g., Luxury Penthouse in Manhattan"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm text-zinc-300 font-medium">Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-zinc-300 font-medium">Price (USD)</label>
                <input
                  type="number"
                  placeholder="850000"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm text-zinc-300 font-medium">City</label>
                <input
                  placeholder="New York"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-zinc-300 font-medium">Bedrooms</label>
                <input
                  type="number"
                  placeholder="3"
                  value={formBedrooms}
                  onChange={(e) => setFormBedrooms(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-zinc-300 font-medium">Bathrooms</label>
                <input
                  type="number"
                  placeholder="2"
                  value={formBathrooms}
                  onChange={(e) => setFormBathrooms(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">Area (sqft)</label>
              <input
                type="number"
                placeholder="2200"
                value={formArea}
                onChange={(e) => setFormArea(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">Description</label>
              <textarea
                placeholder="Describe the property..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
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
              Create Property
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Property Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={(v) => !v && setDetailDialogOpen(false)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedProperty?.title || 'Property Details'}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Property information, generated content, and leads
            </DialogDescription>
          </DialogHeader>
          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
            </div>
          ) : selectedProperty ? (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-xs text-zinc-500 mb-1">Type</div>
                  <div className="text-sm text-white capitalize">{selectedProperty.property_type}</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-xs text-zinc-500 mb-1">Status</div>
                  <div className="text-sm">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[selectedProperty.status] || statusColors.available}`}>
                      {selectedProperty.status}
                    </span>
                  </div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-xs text-zinc-500 mb-1">Price</div>
                  <div className="text-sm text-white">${selectedProperty.price?.toLocaleString()}</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-xs text-zinc-500 mb-1">Location</div>
                  <div className="text-sm text-white">{selectedProperty.city}, {selectedProperty.country}</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-xs text-zinc-500 mb-1">Bedrooms</div>
                  <div className="text-sm text-white">{selectedProperty.bedrooms || '—'}</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-xs text-zinc-500 mb-1">Area</div>
                  <div className="text-sm text-white">{selectedProperty.area_sqft ? `${selectedProperty.area_sqft} sqft` : '—'}</div>
                </div>
              </div>
              {selectedProperty.description && (
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <div className="text-xs text-zinc-500 mb-1">Description</div>
                  <div className="text-sm text-zinc-300">{selectedProperty.description}</div>
                </div>
              )}
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <div className="text-xs text-zinc-500 mb-2">Generated Content ({selectedProperty.generated_content?.length || 0})</div>
                {selectedProperty.generated_content?.length > 0 ? (
                  <div className="space-y-1">
                    {selectedProperty.generated_content.map((c) => (
                      <div key={c.id} className="text-xs text-zinc-400 flex items-center gap-2">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-300">{c.content_type}</span>
                        <span>{c.language}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-600">No generated content yet</p>
                )}
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <div className="text-xs text-zinc-500 mb-2">Leads ({selectedProperty.leads?.length || 0})</div>
                {selectedProperty.leads?.length > 0 ? (
                  <div className="space-y-1">
                    {selectedProperty.leads.map((l) => (
                      <div key={l.id} className="text-xs text-zinc-400 flex items-center gap-2">
                        <span className="text-zinc-300">{l.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusColors[l.status] || 'bg-zinc-700 text-zinc-400'}`}>
                          {l.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-600">No leads yet</p>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
