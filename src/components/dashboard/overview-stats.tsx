'use client'

import { useEffect, useState } from 'react'
import { Activity, Coins, Building, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAppStore } from '@/store/app-store'

interface OverviewData {
  total_properties: number
  total_leads: number
  total_content: number
  api_calls_this_month: number
  conversion_rate: number
  average_response_time_ms: number
  leads_by_status: Record<string, number>
}

export function OverviewStats() {
  const developer = useAppStore((s) => s.developer)
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)

  const monthlyUsed = (developer?.monthly_calls_used as number) || 0
  const monthlyLimit = (developer?.monthly_calls_limit as number) || 100
  const creditsRemaining = monthlyLimit - monthlyUsed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/v1/analytics/overview', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('eq_api_key') || ''}`,
          },
        })
        const result = await res.json()
        if (result.success) {
          setData(result.data)
        }
      } catch {
        // Silently fail — data will show defaults
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    {
      title: 'API Calls This Month',
      value: monthlyUsed.toLocaleString(),
      subtitle: `of ${monthlyLimit.toLocaleString()} limit`,
      icon: Activity,
      progress: monthlyLimit > 0 ? (monthlyUsed / monthlyLimit) * 100 : 0,
    },
    {
      title: 'Credits Remaining',
      value: creditsRemaining.toLocaleString(),
      subtitle: `resets monthly`,
      icon: Coins,
      progress: monthlyLimit > 0 ? (creditsRemaining / monthlyLimit) * 100 : 100,
    },
    {
      title: 'Properties Stored',
      value: data?.total_properties?.toLocaleString() || '0',
      subtitle: 'active listings',
      icon: Building,
      progress: undefined,
    },
    {
      title: 'Total Leads',
      value: data?.total_leads?.toLocaleString() || '0',
      subtitle: `${data?.conversion_rate || 0}% conversion`,
      icon: Users,
      progress: undefined,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              {stat.title}
            </CardTitle>
            <stat.icon className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <p className="text-xs text-zinc-500 mt-1">{stat.subtitle}</p>
            {stat.progress !== undefined && (
              <Progress
                value={stat.progress}
                className="mt-3 h-1.5 bg-zinc-800 [&>div]:bg-emerald-500"
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
