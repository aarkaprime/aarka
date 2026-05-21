'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useAppStore } from '@/store/app-store'
import { Zap, Mail, Lock, User, Building2, ArrowRight, Loader2, Copy, Check } from 'lucide-react'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const setView = useAppStore((s) => s.setView)
  const setIsAuthenticated = useAppStore((s) => s.setIsAuthenticated)
  const setDeveloper = useAppStore((s) => s.setDeveloper)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error?.message || 'Registration failed')
        return
      }
      // Show the API key
      if (data.data?.api_key) {
        setCreatedKey(data.data.api_key as string)
      } else {
        // Auto-login
        await signIn('credentials', { email, password, redirect: false })
        const meRes = await fetch('/api/auth/me')
        const meData = await meRes.json()
        if (meData.success) {
          setIsAuthenticated(true)
          setDeveloper(meData.data)
          setView('dashboard')
        }
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyKey = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleContinue = async () => {
    await signIn('credentials', { email, password, redirect: false })
    const meRes = await fetch('/api/auth/me')
    const meData = await meRes.json()
    if (meData.success) {
      setIsAuthenticated(true)
      setDeveloper(meData.data)
      setView('dashboard')
    }
  }

  // API Key reveal screen
  if (createdKey) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-zinc-400 text-sm">Your API key has been generated. Copy it now — you won&apos;t see it again.</p>
          </div>
          <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <code className="text-emerald-400 text-sm font-mono flex-1 text-left break-all">{createdKey}</code>
              <button onClick={handleCopyKey} className="p-1.5 hover:bg-zinc-800 rounded transition-colors cursor-pointer">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              </button>
            </div>
          </div>
          <p className="text-amber-400/80 text-xs mb-6">⚠ Store this key securely. It will not be shown again.</p>
          <button
            onClick={handleContinue}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-all cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-emerald-500" />
            <span className="text-2xl font-bold text-white">NexusAPI</span>
          </div>
          <h1 className="text-xl font-semibold text-white">Create your account</h1>
          <p className="text-zinc-500 text-sm mt-1">Start building with the unified AI API</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors" />
          </div>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company (optional)"
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 8 chars)" required minLength={8}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-black font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Already have an account?{' '}
          <button onClick={() => setView('login')} className="text-emerald-400 hover:text-emerald-300 cursor-pointer">Sign in</button>
        </p>
      </div>
    </div>
  )
}
