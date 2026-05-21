'use client'

import { motion } from 'framer-motion'
import { Brain, Globe, Layers, DollarSign, Zap, Code2, Shield, Cpu } from 'lucide-react'

const features = [
  { icon: Brain, title: 'Chat Completions', desc: 'Access DeepSeek, Qwen, GLM, Moonshot, Yi, Baichuan — all through one OpenAI-compatible API endpoint. Switch models instantly.' },
  { icon: DollarSign, title: 'Lowest Prices', desc: 'Chinese AI models at a fraction of GPT-4 costs. DeepSeek at $0.27/M tokens vs GPT-4 at $30/M tokens. Save 90%+ on AI spend.' },
  { icon: Layers, title: 'Unified API', desc: 'One API key, one integration, all models. OpenAI-compatible format — migrate your existing code in minutes, not days.' },
  { icon: Cpu, title: 'Model Router', desc: 'Automatically route requests to the best model based on cost, speed, or capability. Optimize without code changes.' },
  { icon: Zap, title: 'Real-Time Webhooks', desc: 'Get notified on usage events, quota warnings, and model status changes. Build reactive systems effortlessly.' },
  { icon: Code2, title: 'Developer-First', desc: 'RESTful API, comprehensive docs, code examples in 4 languages, interactive playground. Built by devs, for devs.' },
  { icon: Shield, title: '99.9% Uptime SLA', desc: 'Enterprise-grade infrastructure with automatic failover, rate limiting, and monitoring. Your app stays up.' },
  { icon: Globe, title: 'Global Edge Network', desc: 'Low-latency access from anywhere. Automatic failover between model providers ensures continuous availability.' },
]

export function FeaturesGrid() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything You Need to Build</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">One API for all AI models. Stop paying premium prices — access the cheapest, most powerful models through a single interface.</p>
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
