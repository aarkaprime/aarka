'use client'

import { useAppStore } from '@/store/app-store'
import { Zap } from 'lucide-react'

export function Footer() {
  const setView = useAppStore((s) => s.setView)

  return (
    <footer className="py-12 px-4 border-t border-zinc-800/50 bg-[#09090b]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-white">EstateIQ</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <button onClick={() => setView('landing')} className="hover:text-white transition-colors cursor-pointer">API</button>
            <button onClick={() => setView('docs-getting-started')} className="hover:text-white transition-colors cursor-pointer">Docs</button>
            <button onClick={() => setView('pricing')} className="hover:text-white transition-colors cursor-pointer">Pricing</button>
            <button onClick={() => setView('register')} className="hover:text-white transition-colors cursor-pointer">Sign Up</button>
          </div>
          <div className="text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} EstateIQ. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
