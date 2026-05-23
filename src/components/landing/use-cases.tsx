'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Globe, LayoutDashboard, Smartphone, BarChart3, Bot } from 'lucide-react'

const useCases = [
  { icon: Bot, title: 'AI Chatbot SaaS', desc: 'Build your own chatbot platform using the cheapest AI models via one API.' },
  { icon: Globe, title: 'AI-Powered Website', desc: 'Add intelligent search, summarization, and content generation to any website.' },
  { icon: LayoutDashboard, title: 'Developer Dashboard', desc: 'Manage multiple AI providers through one unified API with key management and analytics.' },
  { icon: Smartphone, title: 'Mobile AI App', desc: 'Power mobile apps with affordable AI — chat, translation, code assistance at scale.' },
  { icon: BarChart3, title: 'Data Analysis Tool', desc: 'Aggregate AI-powered insights across datasets with smart model routing.' },
  { icon: MessageCircle, title: 'WhatsApp/Telegram Bot', desc: 'Deploy AI bots on messaging platforms at 95% lower cost than GPT-4.' },
]

export function UseCases() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Build Anything. Anywhere.</h2>
          <p className="text-zinc-400 text-lg">Developers are using NexusAPI to power these apps and more.</p>
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
