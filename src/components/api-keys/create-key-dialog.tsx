'use client'

import { useState } from 'react'
import { Copy, Check, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppStore } from '@/store/app-store'

interface CreateKeyDialogProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

type Step = 'form' | 'reveal'

export function CreateKeyDialog({ open, onClose, onCreated }: CreateKeyDialogProps) {
  const [step, setStep] = useState<Step>('form')
  const [name, setName] = useState('')
  const [environment, setEnvironment] = useState('test')
  const [loading, setLoading] = useState(false)
  const [createdKey, setCreatedKey] = useState('')
  const [copied, setCopied] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const addToast = useAppStore((s) => s.addToast)

  const handleCreate = async () => {
    if (!name.trim()) {
      addToast('Please enter a key name.', 'error')
      return
    }

    setLoading(true)
    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch('/api/v1/account/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ name: name.trim(), environment }),
      })

      const result = await res.json()
      if (result.success && result.data?.key) {
        setCreatedKey(result.data.key)
        setStep('reveal')
      } else {
        addToast(result.error?.message || 'Failed to create API key.', 'error')
      }
    } catch {
      addToast('An error occurred while creating the key.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (step === 'reveal' && !confirmed) {
      addToast('Please confirm you have saved your API key.', 'error')
      return
    }
    setStep('form')
    setName('')
    setEnvironment('test')
    setCreatedKey('')
    setCopied(false)
    setConfirmed(false)
    onCreated()
    onClose()
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(createdKey)
    setCopied(true)
    addToast('API key copied to clipboard!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-white">Create New API Key</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Generate a new API key for accessing the NexusAPI API.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-300 font-medium">Key Name</label>
                <input
                  placeholder="e.g., Production API Key"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-300 font-medium">Environment</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEnvironment('test')}
                    className={`flex-1 text-sm px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                      environment === 'test'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    Test
                  </button>
                  <button
                    onClick={() => setEnvironment('production')}
                    className={`flex-1 text-sm px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                      environment === 'production'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    Production
                  </button>
                </div>
              </div>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Key
              </button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Your API Key
              </DialogTitle>
              <DialogDescription className="text-amber-400 font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Copy this key NOW. You will NEVER be able to see it again.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <code className="text-sm text-emerald-400 font-mono break-all select-all">
                  {createdKey}
                </code>
              </div>
              <button
                className="w-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-medium text-sm px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer bg-transparent"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setConfirmed(!confirmed)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                    confirmed
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-zinc-600 hover:border-zinc-500'
                  }`}
                >
                  {confirmed && <Check className="w-3 h-3 text-black" />}
                </div>
                <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  I have saved this key in a secure location
                </span>
              </label>
              <button
                onClick={handleClose}
                disabled={!confirmed}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                Done
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
