'use client'

import { useState } from 'react'
import { Copy, Check, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
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
      const res = await fetch('/api/v1/account/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('eq_api_key') || ''}`,
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
                Generate a new API key for accessing the EstateIQ API.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="key-name" className="text-zinc-300">
                  Key Name
                </Label>
                <Input
                  id="key-name"
                  placeholder="e.g., Production API Key"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Environment</Label>
                <Select value={environment} onValueChange={setEnvironment}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white focus:border-emerald-500 focus:ring-emerald-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="test" className="text-zinc-300 focus:bg-zinc-800 focus:text-white">
                      Test
                    </SelectItem>
                    <SelectItem value="live" className="text-zinc-300 focus:bg-zinc-800 focus:text-white">
                      Production
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleCreate}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                Create Key
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Your API Key
              </DialogTitle>
              <DialogDescription className="text-amber-400 font-medium">
                IMPORTANT: Copy this key NOW. You will NEVER be able to see it again.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <code className="text-sm text-emerald-400 font-mono break-all select-all">
                  {createdKey}
                </code>
              </div>
              <Button
                variant="outline"
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-2 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirm-saved"
                  checked={confirmed}
                  onCheckedChange={(v) => setConfirmed(v === true)}
                  className="border-zinc-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <Label htmlFor="confirm-saved" className="text-sm text-zinc-400 cursor-pointer">
                  I have saved this key in a secure location
                </Label>
              </div>
              <Button
                onClick={handleClose}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                disabled={!confirmed}
              >
                Done
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
