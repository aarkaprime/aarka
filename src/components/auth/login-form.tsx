'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/store/app-store'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const setView = useAppStore((s) => s.setView)
  const setIsAuthenticated = useAppStore((s) => s.setIsAuthenticated)
  const setDeveloper = useAppStore((s) => s.setDeveloper)
  const addToast = useAppStore((s) => s.addToast)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        addToast('Invalid email or password. Please try again.', 'error')
        return
      }

      // Fetch developer data
      const res = await fetch('/api/auth/me')
      const data = await res.json()

      if (data.success) {
        setDeveloper(data.data)
        setIsAuthenticated(true)
        setView('dashboard')
        addToast('Welcome back!', 'success')
      } else {
        addToast('Failed to fetch account data.', 'error')
      }
    } catch {
      addToast('An unexpected error occurred. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
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
            <CardTitle className="text-white text-2xl">Sign In</CardTitle>
            <CardDescription className="text-zinc-400">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-400">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setView('register')}
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer"
              >
                Sign up
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
