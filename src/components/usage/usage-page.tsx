'use client'

import { useEffect, useState } from 'react'
import { Loader2, BarChart3 } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { useAppStore } from '@/store/app-store'

interface DailyCall {
  date: string
  calls: number
}

interface EndpointUsage {
  endpoint: string
  method: string
  count: number
}

interface UsageData {
  total_calls: number
  daily_calls: DailyCall[]
  usage_breakdown: EndpointUsage[]
  total_tokens: number
  average_response_time: number
}

interface OverviewData {
  api_calls_this_month: number
  total_properties: number
  total_leads: number
  total_content: number
}

export function UsagePage() {
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const developer = useAppStore((s) => s.developer)

  const monthlyUsed = (developer as Record<string, unknown>)?.monthly_calls_used as number || 0
  const monthlyLimit = (developer as Record<string, unknown>)?.monthly_calls_limit as number || 100

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = localStorage.getItem('eq_api_key') || ''
        const headers = { Authorization: `Bearer ${apiKey}` }

        const [usageRes, overviewRes] = await Promise.all([
          fetch('/api/v1/analytics/usage', { headers }),
          fetch('/api/v1/analytics/overview', { headers }),
        ])

        const usageResult = await usageRes.json()
        const overviewResult = await overviewRes.json()

        if (usageResult.success) {
          setUsageData(usageResult.data)
        }
        if (overviewResult.success) {
          setOverviewData(overviewResult.data)
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
      <div className="space-y-6">
        <div>
          <div className="h-7 w-32 bg-zinc-800 rounded animate-pulse mb-2" />
          <div className="h-4 w-56 bg-zinc-800/50 rounded animate-pulse" />
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 animate-pulse">
          <div className="h-20 bg-zinc-800/50 rounded mb-6" />
          <div className="h-[300px] bg-zinc-800/50 rounded" />
        </div>
      </div>
    )
  }

  const totalCalls = overviewData?.api_calls_this_month ?? monthlyUsed
  const dailyCalls = usageData?.daily_calls?.length > 0 ? usageData.daily_calls : []
  const breakdown = usageData?.usage_breakdown || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Usage Analytics</h2>
        <p className="text-sm text-zinc-400 mt-1">Track your API usage and performance metrics</p>
      </div>

      {/* Big number card */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-zinc-400">Total API Calls This Month</span>
          <BarChart3 className="w-4 h-4 text-zinc-500" />
        </div>
        <div className="text-3xl font-bold text-white">{totalCalls.toLocaleString()}</div>
        <p className="text-xs text-zinc-500 mt-1">of {monthlyLimit.toLocaleString()} monthly limit</p>
        <div className="mt-3">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${monthlyLimit > 0 ? Math.min((totalCalls / monthlyLimit) * 100, 100) : 0}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-zinc-500">{monthlyLimit > 0 ? ((totalCalls / monthlyLimit) * 100).toFixed(1) : 0}% used</span>
            <span className="text-xs text-zinc-500">{(monthlyLimit - totalCalls).toLocaleString()} remaining</span>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily calls chart */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
          <h3 className="text-white font-semibold mb-4">Daily API Calls</h3>
          {dailyCalls.length > 0 ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyCalls} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="usageEmeraldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#71717a', fontSize: 10 }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={{ stroke: '#27272a' }}
                  />
                  <YAxis
                    tick={{ fill: '#71717a', fontSize: 10 }}
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
                    fill="url(#usageEmeraldGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[280px] flex items-center justify-center">
              <p className="text-zinc-500 text-sm">No usage data available yet</p>
            </div>
          )}
        </div>

        {/* Breakdown by endpoint */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
          <h3 className="text-white font-semibold mb-4">Breakdown by Endpoint</h3>
          {breakdown.length > 0 ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdown.slice(0, 8)} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    dataKey="endpoint"
                    tick={{ fill: '#71717a', fontSize: 9 }}
                    axisLine={{ stroke: '#27272a' }}
                    tickLine={{ stroke: '#27272a' }}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fill: '#71717a', fontSize: 10 }}
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
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[280px] flex items-center justify-center">
              <p className="text-zinc-500 text-sm">No breakdown data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Model usage table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
        <h3 className="text-white font-semibold mb-4">Usage Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="text-sm text-zinc-400 mb-1">Total API Calls</div>
            <div className="text-xl font-bold text-white">{totalCalls.toLocaleString()}</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="text-sm text-zinc-400 mb-1">Total Tokens Used</div>
            <div className="text-xl font-bold text-white">{(usageData?.total_tokens ?? 0).toLocaleString()}</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="text-sm text-zinc-400 mb-1">Avg Response Time</div>
            <div className="text-xl font-bold text-white">{Math.round(usageData?.average_response_time ?? 0)}ms</div>
          </div>
        </div>
      </div>
    </div>
  )
}
