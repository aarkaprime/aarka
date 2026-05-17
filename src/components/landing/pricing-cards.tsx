'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/app-store'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for exploring the API and building prototypes.',
    features: [
      '100 API calls/month',
      '1 API key',
      'Property CRUD',
      'AI content generation',
      '1 webhook',
      'Community support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '$49',
    period: '/mo',
    description: 'For small agencies and indie developers building real products.',
    features: [
      '1,000 API calls/month',
      '3 API keys',
      'Property CRUD + search',
      'AI content generation',
      '5 webhooks',
      'Email support',
      'Lead management',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$199',
    period: '/mo',
    description: 'For growing businesses that need more power and flexibility.',
    features: [
      '10,000 API calls/month',
      '10 API keys',
      'Full property + search',
      'AI content + batch',
      '25 webhooks',
      'Priority support',
      'Lead management + stats',
      'Analytics dashboard',
    ],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '$499',
    period: '/mo',
    description: 'For enterprises and high-volume applications.',
    features: [
      '50,000 API calls/month',
      'Unlimited API keys',
      'Full property + search',
      'AI content + batch',
      'Unlimited webhooks',
      'Dedicated support',
      'Lead management + stats',
      'Advanced analytics',
      'Custom rate limits',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
]

export function PricingCards() {
  const setView = useAppStore((s) => s.setView)

  return (
    <section className="py-20 sm:py-28 bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Simple, transparent <span className="text-emerald-400">pricing</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-xl bg-zinc-900/50 border transition-all duration-300 ${
                plan.highlighted
                  ? 'border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="ml-1 text-zinc-500">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-zinc-400">{plan.description}</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full mt-8 cursor-pointer ${
                  plan.highlighted
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                }`}
                onClick={() => setView('register')}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-zinc-400">
            Need more?{' '}
            <button
              onClick={() => setView('docs')}
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer"
            >
              Contact us for Enterprise pricing
            </button>
          </p>
        </div>
      </div>
    </section>
  )
}
