'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/store/app-store'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const setView = useAppStore((s) => s.setView)
  const setIsAuthenticated = useAppStore((s) => s.setIsAuthenticated)
  const setDeveloper = useAppStore((s) => s.setDeveloper)
  const addToast = useAppStore((s) => s.addToast)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, company: company || undefined }),
      })

      const data = await res.json()

      if (!data.success) {
        const msg =
          data.error?.code === 'EMAIL_TAKEN'
            ? 'An account with this email already exists.'
            : data.error?.message || 'Registration failed. Please try again.'
        addToast(msg, 'error')
        return
      }

      // Show the API key
      if (data.data?.api_key) {
        setApiKey(data.data.api_key)
        setShowApiKey(true)
      }

      // Auto-login
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        const meRes = await fetch('/api/auth/me')
        const meData = await meRes.json()
        if (meData.success) {
          setDeveloper(meData.data)
          setIsAuthenticated(true)
        }
      }
    } catch {
      addToast('An unexpected error occurred. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    setShowApiKey(false)
    setView('dashboard')
    addToast('Account created successfully! Welcome to EstateIQ.', 'success')
  }

  if (showApiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4">
        <div className="w-full max-w-md">
          <Card className="bg-zinc-900 border-emerald-500/30">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">Your API Key</CardTitle>
              <CardDescription className="text-zinc-400">
                IMPORTANT: Copy this key NOW. You will NEVER be able to see it again.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <code className="text-sm text-emerald-400 font-mono break-all">{apiKey}</code>
              </div>
              <Button
                variant="outline"
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                onClick={async () => {
                  await navigator.clipboard.writeText(apiKey)
                  addToast('API key copied to clipboard!', 'success')
                }}
              >
                Copy API Key
              </Button>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                onClick={handleContinue}
              >
                I&apos;ve Saved My Key — Continue to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">EQ</span>
            </div>
            <span className="text-white font-semibold text-xl">EstateIQ</span>
          </div>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Create Account</CardTitle>
            <CardDescription className="text-zinc-400">
              Start building with the EstateIQ API — free
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email" className="text-zinc-300">
                  Email
                </Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-zinc-300">
                  Company <span className="text-zinc-500">(optional)</span>
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password" className="text-zinc-300">
                  Password
                </Label>
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-400">
              Already have an account?{' '}
              <button
                onClick={() => setView('login')}
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
