import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess } from '@/lib/api-response'
import { db } from '@/lib/db'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [tokensByEndpoint, tokensByDay, topSlowEndpoints] = await Promise.all([
    db.usageLog.groupBy({
      by: ['endpoint'],
      where: { developerId, createdAt: { gte: startOfMonth }, tokensUsed: { gt: 0 } },
      _sum: { tokensUsed: true },
      _count: { endpoint: true },
      orderBy: { _sum: { tokensUsed: 'desc' } },
      take: 10,
    }),
    db.usageLog.groupBy({
      by: ['createdAt'],
      where: { developerId, createdAt: { gte: startOfMonth }, tokensUsed: { gt: 0 } },
      _sum: { tokensUsed: true },
    }),
    db.usageLog.groupBy({
      by: ['endpoint'],
      where: { developerId, createdAt: { gte: startOfMonth } },
      _avg: { responseTimeMs: true },
      _count: { endpoint: true },
      orderBy: { _avg: { responseTimeMs: 'desc' } },
      take: 5,
    }),
  ])

  // Token usage by endpoint
  const tokenStats = tokensByEndpoint.map(item => ({
    endpoint: item.endpoint,
    total_tokens: item._sum.tokensUsed || 0,
    call_count: item._count.endpoint,
    avg_tokens_per_call: item._sum.tokensUsed && item._count.endpoint
      ? Math.round(item._sum.tokensUsed / item._count.endpoint)
      : 0,
  }))

  // Token usage by day
  const tokensByDayMap: Record<string, number> = {}
  for (const item of tokensByDay) {
    const dateKey = new Date(item.createdAt).toISOString().split('T')[0]
    tokensByDayMap[dateKey] = (tokensByDayMap[dateKey] || 0) + (item._sum.tokensUsed || 0)
  }

  // Slowest endpoints
  const slowEndpoints = topSlowEndpoints.map(item => ({
    endpoint: item.endpoint,
    avg_response_time_ms: item._avg.responseTimeMs ? Math.round(item._avg.responseTimeMs) : 0,
    call_count: item._count.endpoint,
  }))

  return apiSuccess({
    token_usage_by_endpoint: tokenStats,
    token_usage_by_day: tokensByDayMap,
    slowest_endpoints: slowEndpoints,
  }, { creditsRemaining })
})
