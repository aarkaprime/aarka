'use client'

import { useAppStore } from '@/store/app-store'

export function Footer() {
  const setView = useAppStore((s) => s.setView)

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">EQ</span>
            </div>
            <span className="text-white font-semibold text-lg">EstateIQ</span>
          </div>

          <nav className="flex items-center gap-6 sm:gap-8">
            <button
              onClick={() => setView('landing')}
              className="text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              API
            </button>
            <button
              onClick={() => setView('docs')}
              className="text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Docs
            </button>
            <button
              onClick={() => setView('pricing')}
              className="text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Pricing
            </button>
            <span className="text-sm text-zinc-400">Status</span>
          </nav>

          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} EstateIQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
