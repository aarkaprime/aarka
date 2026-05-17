'use client'

import { motion } from 'framer-motion'
import { Brain, Globe, Building, Target, Zap, Code, Shield, MapPin } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Content Generation',
    description: 'Generate property descriptions, social posts, WhatsApp messages, and email campaigns with a single API call.',
  },
  {
    icon: Globe,
    title: '5 African Languages',
    description: 'Support for English, Swahili, Amharic, French, and Arabic — reach buyers in their preferred language.',
  },
  {
    icon: Building,
    title: 'Property Management API',
    description: 'Full CRUD operations for property listings with search, filtering, and AI-powered content generation.',
  },
  {
    icon: Target,
    title: 'Lead Tracking',
    description: 'Track leads from inquiry to close with status management, source tracking, and conversion analytics.',
  },
  {
    icon: Zap,
    title: 'Real-Time Webhooks',
    description: 'Get instant notifications for lead events, content generation, and property changes via webhooks.',
  },
  {
    icon: Code,
    title: 'Developer-First',
    description: 'RESTful API with comprehensive docs, SDKs, and a playground for testing. Built by developers, for developers.',
  },
  {
    icon: Shield,
    title: '99.9% Uptime',
    description: 'Enterprise-grade infrastructure with redundant systems, automatic failover, and guaranteed uptime SLA.',
  },
  {
    icon: MapPin,
    title: 'Africa-Native',
    description: 'Built for African markets with local currencies, neighborhoods, and cultural nuances baked in.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function FeaturesGrid() {
  return (
    <section className="py-20 sm:py-28 bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Everything you need to build <span className="text-emerald-400">real estate apps</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">
            A comprehensive API platform designed specifically for African real estate — from AI content to lead management.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
