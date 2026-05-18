'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

const plans = [
  { name: 'Free', price: '$0', period: '/mo', calls: '100', keys: '1', webhooks: '0', support: 'Community', cta: 'Get Started', popular: false },
  { name: 'Starter', price: '$49', period: '/mo', calls: '1,000', keys: '3', webhooks: '2', support: 'Email', cta: 'Start Building', popular: false },
  { name: 'Professional', price: '$199', period: '/mo', calls: '10,000', keys: '10', webhooks: '10', support: 'Priority', cta: 'Go Pro', popular: true },
  { name: 'Business', price: '$499', period: '/mo', calls: '50,000', keys: '50', webhooks: '50', support: 'Dedicated', cta: 'Scale Up', popular: false },
]

export function PricingCards() {
  const setView = useAppStore((s) => s.setView)

  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-zinc-400 text-lg">Start free. Scale as you grow. No hidden fees.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative p-6 rounded-xl border transition-all duration-300 ${
                plan.popular
                  ? 'border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/10'
                  : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-emerald-500 text-black text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-white font-semibold text-lg mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-zinc-500">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  `${plan.calls} API calls/month`,
                  `${plan.keys} API key${plan.keys !== '1' ? 's' : ''}`,
                  `${plan.webhooks} webhook${plan.webhooks !== '1' ? 's' : ''}`,
                  `${plan.support} support`,
                  'All AI models',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setView('register')}
                className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                  plan.popular
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                    : 'border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-zinc-500">Need more? <button onClick={() => setView('landing')} className="text-emerald-400 hover:text-emerald-300 cursor-pointer">Contact us for Enterprise pricing</button></p>
        </div>
      </div>
    </section>
  )
}
