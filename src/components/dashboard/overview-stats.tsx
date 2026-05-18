'use client'

import { useEffect, useState } from 'react'
import { Activity, Database, Building2, Users } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

interface OverviewData {
  total_properties: number
  total_leads: number
  total_content: number
  api_calls_this_month: number
  conversion_rate: number
  average_response_time_ms: number
}

function SkeletonCard() {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-28 bg-zinc-800 rounded" />
        <div className="h-4 w-4 bg-zinc-800 rounded" />
      </div>
      <div className="h-8 w-20 bg-zinc-800 rounded mb-2" />
      <div className="h-3 w-24 bg-zinc-800 rounded" />
    </div>
  )
}

export function OverviewStats() {
  const developer = useAppStore((s) => s.developer)
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)

  const monthlyUsed = (developer as Record<string, unknown>)?.monthly_calls_used as number || 0
  const monthlyLimit = (developer as Record<string, unknown>)?.monthly_calls_limit as number || 100
  const creditsRemaining = monthlyLimit - monthlyUsed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = localStorage.getItem('eq_api_key') || ''
        const res = await fetch('/api/v1/analytics/overview', {
          headers: { Authorization: `Bearer ${apiKey}` },
        })
        const result = await res.json()
        if (result.success) {
          setData(result.data)
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  const stats = [
    {
      title: 'API Calls This Month',
      value: (data?.api_calls_this_month ?? monthlyUsed).toLocaleString(),
      subtitle: `of ${monthlyLimit.toLocaleString()} limit`,
      icon: Activity,
      progress: monthlyLimit > 0 ? ((data?.api_calls_this_month ?? monthlyUsed) / monthlyLimit) * 100 : 0,
    },
    {
      title: 'Credits Remaining',
      value: creditsRemaining.toLocaleString(),
      subtitle: 'resets monthly',
      icon: Database,
      progress: monthlyLimit > 0 ? (creditsRemaining / monthlyLimit) * 100 : 100,
    },
    {
      title: 'Properties Stored',
      value: (data?.total_properties ?? 0).toLocaleString(),
      subtitle: 'active listings',
      icon: Building2,
      progress: undefined,
    },
    {
      title: 'Total Leads',
      value: (data?.total_leads ?? 0).toLocaleString(),
      subtitle: `${(data?.conversion_rate ?? 0).toFixed(1)}% conversion`,
      icon: Users,
      progress: undefined,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-zinc-400">{stat.title}</span>
            <stat.icon className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-2xl font-bold text-white">{stat.value}</div>
          <p className="text-xs text-zinc-500 mt-1">{stat.subtitle}</p>
          {stat.progress !== undefined && (
            <div className="mt-3">
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(stat.progress, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
