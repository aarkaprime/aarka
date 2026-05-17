'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

export function QuickChart() {
  const [data, setData] = useState<ChartData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/v1/analytics/usage', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('eq_api_key') || ''}`,
          },
        })
        const result = await res.json()
        if (result.success && result.data?.daily_calls) {
          setData(result.data.daily_calls)
        } else {
          // Generate placeholder data for the last 14 days
          const placeholder: ChartData[] = []
          for (let i = 13; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            placeholder.push({
              date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              calls: 0,
            })
          }
          setData(placeholder)
        }
      } catch {
        // Generate placeholder data
        const placeholder: ChartData[] = []
        for (let i = 13; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          placeholder.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            calls: 0,
          })
        }
        setData(placeholder)
      }
    }
    fetchData()
  }, [])

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">API Calls (Last 14 Days)</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
