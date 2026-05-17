'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Globe, LayoutDashboard, Smartphone, TrendingUp, Megaphone } from 'lucide-react'

const useCases = [
  {
    icon: MessageSquare,
    title: 'WhatsApp Property Bot',
    description: 'Build a WhatsApp bot that auto-generates property descriptions and sends them to interested buyers in real time.',
  },
  {
    icon: Globe,
    title: 'Property Listing Website',
    description: 'Create a full listing site with AI-generated content, search, and lead capture — launch in days.',
  },
  {
    icon: LayoutDashboard,
    title: 'Agency Dashboard',
    description: 'Build an internal dashboard for agencies to manage listings, track leads, and generate marketing content.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Property App',
    description: 'Power your mobile app with property data, AI content, and real-time notifications via webhooks.',
  },
  {
    icon: TrendingUp,
    title: 'Market Analysis Tool',
    description: 'Analyze property trends, track leads through the funnel, and generate market reports with analytics data.',
  },
  {
    icon: Megaphone,
    title: 'SMS Marketing',
    description: 'Generate compelling SMS campaigns for property listings and deliver them through your preferred SMS gateway.',
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

export function UseCases() {
  return (
    <section className="py-20 sm:py-28 bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Built for <span className="text-emerald-400">every use case</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">
            From chatbots to dashboards, EstateIQ powers the full spectrum of real estate technology.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {useCases.map((useCase) => (
            <motion.div
              key={useCase.title}
              variants={itemVariants}
              className="group p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <useCase.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{useCase.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{useCase.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
