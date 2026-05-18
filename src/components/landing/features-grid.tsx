'use client'

import { motion } from 'framer-motion'
import { Brain, Globe, Building2, Target, Zap, Code2, Shield, MapPin } from 'lucide-react'

const features = [
  { icon: Brain, title: 'AI Content Generation', desc: 'Property descriptions, social posts, WhatsApp messages, email campaigns, and ad copy — all generated in seconds with a single API call.' },
  { icon: Globe, title: '10 Global Languages', desc: 'English, Spanish, French, German, Portuguese, Arabic, Chinese, Japanese, Korean, Hindi — content that speaks your market.' },
  { icon: Building2, title: 'Property Management API', desc: 'Full CRUD for properties with search, filtering, and pagination. Store and manage your entire property catalog.' },
  { icon: Target, title: 'Lead Tracking', desc: 'Capture and manage leads from any source through a unified API. Track the full funnel from inquiry to close.' },
  { icon: Zap, title: 'Real-Time Webhooks', desc: 'Get notified instantly when events happen — lead captured, content generated, quota warnings. Never miss a beat.' },
  { icon: Code2, title: 'Developer-First', desc: 'RESTful API, comprehensive docs, code examples in 4 languages, interactive playground. Built by devs, for devs.' },
  { icon: Shield, title: '99.9% Uptime SLA', desc: 'Enterprise-grade infrastructure with automatic failover, rate limiting, and monitoring. Your app stays up.' },
  { icon: MapPin, title: 'Global Coverage', desc: 'From Manhattan to Dubai, London to Singapore. Multi-currency, multi-language, every market covered.' },
]

export function FeaturesGrid() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything You Need to Build</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">One API. Infinite possibilities. Stop building AI from scratch — start shipping your real estate app today.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/30 hover:bg-zinc-900/80 transition-all duration-300"
            >
              <feature.icon className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
