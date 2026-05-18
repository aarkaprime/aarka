'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Globe, LayoutDashboard, Smartphone, BarChart3, Send } from 'lucide-react'

const useCases = [
  { icon: MessageCircle, title: 'WhatsApp Property Bot', desc: 'Automate property inquiries and send AI-generated listings on WhatsApp.' },
  { icon: Globe, title: 'Property Listing Website', desc: 'Power your listings with AI-generated descriptions in any language.' },
  { icon: LayoutDashboard, title: 'Agency Dashboard', desc: 'Manage multiple clients and properties through one unified API.' },
  { icon: Smartphone, title: 'Mobile Property App', desc: 'AI-powered search, recommendations, and instant content generation.' },
  { icon: BarChart3, title: 'Market Analysis Tool', desc: 'Aggregate and analyze property data across markets and regions.' },
  { icon: Send, title: 'SMS Marketing', desc: 'Send AI-generated property alerts and campaigns via SMS at scale.' },
]

export function UseCases() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Build Anything. Anywhere.</h2>
          <p className="text-zinc-400 text-lg">Developers are using EstateIQ to power these apps and more.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/20 transition-all"
            >
              <uc.icon className="w-6 h-6 text-emerald-500 mb-3" />
              <h3 className="text-white font-semibold mb-1">{uc.title}</h3>
              <p className="text-zinc-500 text-sm">{uc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
