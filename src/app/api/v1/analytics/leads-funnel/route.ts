import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess } from '@/lib/api-response'
import { db } from '@/lib/db'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [dailyCalls, callsByEndpoint, callsByStatus] = await Promise.all([
    db.usageLog.groupBy({
      by: ['createdAt'],
      where: { developerId, createdAt: { gte: sevenDaysAgo } },
      _count: { createdAt: true },
    }),
    db.usageLog.groupBy({
      by: ['endpoint'],
      where: { developerId, createdAt: { gte: startOfMonth } },
      _count: { endpoint: true },
      _avg: { responseTimeMs: true },
      orderBy: { _count: { endpoint: 'desc' } },
      take: 10,
    }),
    db.usageLog.groupBy({
      by: ['statusCode'],
      where: { developerId, createdAt: { gte: startOfMonth } },
      _count: { statusCode: true },
    }),
  ])

  // Group daily calls by date
  const callsByDay: Record<string, number> = {}
  for (const item of dailyCalls) {
    const dateKey = new Date(item.createdAt).toISOString().split('T')[0]
    callsByDay[dateKey] = (callsByDay[dateKey] || 0) + item._count.createdAt
  }

  // Calls by endpoint with avg response time
  const endpointStats = callsByEndpoint.map(item => ({
    endpoint: item.endpoint,
    count: item._count.endpoint,
    avg_response_time_ms: item._avg.responseTimeMs ? Math.round(item._avg.responseTimeMs) : 0,
  }))

  // Status code distribution
  const statusDistribution: Record<string, number> = {}
  for (const item of callsByStatus) {
    const statusGroup = `${Math.floor(item.statusCode / 100)}xx`
    statusDistribution[statusGroup] = (statusDistribution[statusGroup] || 0) + item._count.statusCode
  }

  return apiSuccess({
    calls_by_day: callsByDay,
    endpoint_stats: endpointStats,
    status_distribution: statusDistribution,
  }, { creditsRemaining })
})
