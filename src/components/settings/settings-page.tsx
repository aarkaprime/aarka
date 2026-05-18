'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save, AlertTriangle, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useAppStore } from '@/store/app-store'

interface AccountData {
  id: string
  name: string
  email: string
  company: string
  plan: string
  created_at: string
}

export function SettingsPage() {
  const developer = useAppStore((s) => s.developer)
  const setDeveloper = useAppStore((s) => s.setDeveloper)
  const addToast = useAppStore((s) => s.addToast)

  const [account, setAccount] = useState<AccountData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)

  // Delete account dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const apiKey = localStorage.getItem('eq_api_key') || ''
        const res = await fetch('/api/v1/account', {
          headers: { Authorization: `Bearer ${apiKey}` },
        })
        const result = await res.json()
        if (result.success && result.data) {
          setAccount(result.data)
          setName(result.data.name || '')
          setEmail(result.data.email || '')
          setCompany(result.data.company || '')
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchAccount()
  }, [])

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      addToast('Name is required.', 'error')
      return
    }
    setSaving(true)
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch('/api/v1/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
        }),
      })
      const result = await res.json()
      if (result.success) {
        addToast('Profile updated successfully!', 'success')
        setAccount(result.data)
        // Update store
        if (developer) {
          setDeveloper({ ...developer, name: name.trim(), email: email.trim(), company: company.trim() })
        }
      } else {
        addToast(result.error?.message || 'Failed to update profile.', 'error')
      }
    } catch {
      addToast('An error occurred while saving.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast('Please fill in all password fields.', 'error')
      return
    }
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match.', 'error')
      return
    }
    if (newPassword.length < 8) {
      addToast('Password must be at least 8 characters.', 'error')
      return
    }
    setPasswordSaving(true)
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch('/api/v1/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      })
      const result = await res.json()
      if (result.success) {
        addToast('Password changed successfully!', 'success')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        addToast(result.error?.message || 'Failed to change password.', 'error')
      }
    } catch {
      addToast('An error occurred.', 'error')
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      addToast('Please type DELETE to confirm.', 'error')
      return
    }
    addToast('Account deletion is not available in the demo.', 'info')
    setDeleteDialogOpen(false)
    setDeleteConfirm('')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-24 bg-zinc-800 rounded animate-pulse" />
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-10 bg-zinc-800/50 rounded" />
            <div className="h-10 bg-zinc-800/50 rounded" />
            <div className="h-10 bg-zinc-800/50 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
        <h3 className="text-white font-semibold mb-4">Profile</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-zinc-300 font-medium">Company</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your company name"
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          {account?.plan && (
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">Plan</label>
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm">
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                  account.plan === 'pro' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  account.plan === 'business' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                  account.plan === 'starter' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-zinc-700 text-zinc-300'
                }`}>
                  {account.plan}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
        <h3 className="text-white font-semibold mb-4">Change Password</h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-zinc-300 font-medium">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
          <button
            onClick={handleChangePassword}
            disabled={passwordSaving}
            className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer bg-transparent"
          >
            {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Change Password
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-zinc-900/50 border border-red-500/20 rounded-xl p-6">
        <h3 className="text-red-400 font-semibold mb-2">Danger Zone</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={() => setDeleteDialogOpen(true)}
          className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={(v) => !v && setDeleteDialogOpen(false)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Delete Account
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              This action is permanent and cannot be undone. All your data will be deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300 font-medium">
                Type <span className="text-red-400 font-bold">DELETE</span> to confirm
              </label>
              <input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-medium text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer bg-transparent"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE'}
                className="flex-1 bg-red-500 hover:bg-red-400 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
