'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: 10000000, suffix: '+', label: 'Properties Described' },
  { value: 50000, suffix: '+', label: 'API Calls Daily' },
  { value: 200, suffix: '+', label: 'Developers' },
  { value: 99.9, suffix: '%', label: 'Uptime' },
]

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(eased * value)
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [isInView, value, duration])

  const formatted =
    value >= 1000000
      ? `${(count / 1000000).toFixed(0)}M`
      : value >= 1000
        ? `${(count / 1000).toFixed(value >= 10000 ? 0 : 1)}K`
        : count.toFixed(1)

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="py-16 sm:py-20 bg-[#09090b] border-y border-zinc-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-400">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-sm sm:text-base text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
