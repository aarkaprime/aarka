'use client'

import { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ChartData {
  date: string
  calls: number
}

function SkeletonChart() {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 animate-pulse">
      <div className="h-6 w-48 bg-zinc-800 rounded mb-6" />
      <div className="h-[250px] sm:h-[300px] bg-zinc-800/50 rounded" />
    </div>
  )
}

export function QuickChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = localStorage.getItem('eq_api_key') || ''
        const res = await fetch('/api/v1/analytics/usage', {
          headers: { Authorization: `Bearer ${apiKey}` },
        })
        const result = await res.json()
        if (result.success && result.data?.daily_calls?.length > 0) {
          const daily = result.data.daily_calls.slice(-14)
          setData(daily)
        } else {
          setData(generatePlaceholder())
        }
      } catch {
        setData(generatePlaceholder())
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <SkeletonChart />

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
      <h3 className="text-white font-semibold mb-6">API Calls (Last 14 Days)</h3>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#71717a', fontSize: 11 }}
              axisLine={{ stroke: '#27272a' }}
              tickLine={{ stroke: '#27272a' }}
            />
            <YAxis
              tick={{ fill: '#71717a', fontSize: 11 }}
              axisLine={{ stroke: '#27272a' }}
              tickLine={{ stroke: '#27272a' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                color: '#fafafa',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#a1a1aa' }}
            />
            <Area
              type="monotone"
              dataKey="calls"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#emeraldGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function generatePlaceholder(): ChartData[] {
  const placeholder: ChartData[] = []
  for (let i = 13; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    placeholder.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calls: 0,
    })
  }
  return placeholder
}
