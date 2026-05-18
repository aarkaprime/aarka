import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess } from '@/lib/api-response'
import { db } from '@/lib/db'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const now = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Daily API call counts for last 30 days
  const usageLogs = await db.usageLog.findMany({
    where: { developerId, createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true, tokensUsed: true, endpoint: true, responseTimeMs: true },
  })

  // Group by day
  const dailyCalls: Record<string, number> = {}
  for (const log of usageLogs) {
    const day = log.createdAt.toISOString().split('T')[0]
    dailyCalls[day] = (dailyCalls[day] || 0) + 1
  }

  const dailyApiCalls = Object.entries(dailyCalls)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Total tokens used
  const totalTokensUsed = usageLogs.reduce((sum, l) => sum + l.tokensUsed, 0)

  // Most popular endpoints
  const endpointCounts: Record<string, { count: number; avg_response_time_ms: number; total_response_time: number }> = {}
  for (const log of usageLogs) {
    if (!endpointCounts[log.endpoint]) {
      endpointCounts[log.endpoint] = { count: 0, avg_response_time_ms: 0, total_response_time: 0 }
    }
    endpointCounts[log.endpoint].count += 1
    endpointCounts[log.endpoint].total_response_time += log.responseTimeMs
  }

  const popularEndpoints = Object.entries(endpointCounts)
    .map(([endpoint, data]) => ({
      endpoint,
      count: data.count,
      avg_response_time_ms: data.count > 0 ? Math.round(data.total_response_time / data.count) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  // Average response time per endpoint
  const avgResponseTimePerEndpoint = popularEndpoints.map(e => ({
    endpoint: e.endpoint,
    avg_response_time_ms: e.avg_response_time_ms,
  }))

  return apiSuccess({
    daily_api_calls: dailyApiCalls,
    total_tokens_used: totalTokensUsed,
    popular_endpoints: popularEndpoints,
    avg_response_time_per_endpoint: avgResponseTimePerEndpoint,
  }, { creditsRemaining })
})
