'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Terminal } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

export function Hero() {
  const setView = useAppStore((s) => s.setView)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[#09090b]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),transparent)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          API v1.0 — Now Live
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6"
        >
          The AI Engine Behind
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
            The World&apos;s Real Estate Apps
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Generate property descriptions, social media content, WhatsApp messages, email campaigns, and ad copy — through one powerful API. Build your real estate app in hours, not months.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={() => setView('register')}
            className="group px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            Get Your Free API Key
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => setView('docs-getting-started')}
            className="px-8 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium rounded-lg transition-all cursor-pointer"
          >
            Read the Docs
          </button>
        </motion.div>

        {/* Code preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-zinc-500 font-mono">terminal</span>
            </div>
            <div className="p-4 font-mono text-sm text-left">
              <div className="text-zinc-500">$ curl -X POST https://api.estateiq.com/v1/ai/generate \</div>
              <div className="text-zinc-500 ml-4">-H <span className="text-emerald-400">&quot;Authorization: Bearer ei_sk_...&quot;</span> \</div>
              <div className="text-zinc-500 ml-4">-d <span className="text-amber-300">{`'{ "content_type": "property_description" }'`}</span></div>
              <div className="mt-2 text-zinc-500">{'}'}</div>
              <div className="mt-2 text-emerald-400">{'{'}</div>
              <div className="text-zinc-300 ml-2">&quot;data&quot;: {'{'}</div>
              <div className="text-zinc-300 ml-4">&quot;results&quot;: [<span className="text-emerald-400">3 AI descriptions</span>],</div>
              <div className="text-zinc-300 ml-4">&quot;tokens_used&quot;: 847</div>
              <div className="text-zinc-300 ml-2">{'}'}</div>
              <div className="text-emerald-400">{'}'}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
