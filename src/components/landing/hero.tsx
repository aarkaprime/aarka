'use client'

import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/app-store'

export function Hero() {
  const setView = useAppStore((s) => s.setView)

  const codeSnippet = `curl -X POST https://api.estateiq.africa/v1/ai/generate \\
  -H "Authorization: Bearer ei_sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content_type": "property_description",
    "property": {
      "title": "3BR Apartment in Kilimani",
      "location": "Kilimani, Nairobi",
      "price": 45000,
      "currency": "KES",
      "bedrooms": 3,
      "type": "apartment"
    },
    "language": "en",
    "tone": "professional"
  }'`

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[#09090b]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[80px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8">
              <Zap className="w-4 h-4" />
              <span>Now serving developers across Africa</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight"
          >
            The AI Engine Behind
            <br />
            <span className="text-emerald-400">Africa&apos;s Next</span>
            <br />
            Real Estate Apps
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Generate property descriptions, social media content, WhatsApp messages, and more — through one powerful API.
            Build your real estate app in hours, not months.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg cursor-pointer"
              onClick={() => setView('register')}
            >
              Get Your Free API Key
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-8 py-6 text-lg cursor-pointer"
              onClick={() => setView('docs')}
            >
              <BookOpen className="mr-2 w-5 h-5" />
              Read the Docs
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <span className="ml-3 text-xs text-zinc-500 font-mono">Terminal</span>
              </div>
              <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-zinc-300 overflow-x-auto">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
