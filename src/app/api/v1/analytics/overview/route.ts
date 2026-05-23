import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess } from '@/lib/api-response'
import { db } from '@/lib/db'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [apiCallsThisMonth, totalApiKeys, totalWebhooks, usageByEndpoint, usageByMethod] = await Promise.all([
    db.usageLog.count({ where: { developerId, createdAt: { gte: startOfMonth } } }),
    db.apiKey.count({ where: { developerId, status: { not: 'revoked' } } }),
    db.webhook.count({ where: { developerId } }),
    db.usageLog.groupBy({
      by: ['endpoint'],
      where: { developerId, createdAt: { gte: startOfMonth } },
      _count: { endpoint: true },
      orderBy: { _count: { endpoint: 'desc' } },
      take: 10,
    }),
    db.usageLog.groupBy({
      by: ['method'],
      where: { developerId, createdAt: { gte: startOfMonth } },
      _count: { method: true },
    }),
  ])

  // Average response time from usage logs
  const usageLogs = await db.usageLog.findMany({
    where: { developerId, createdAt: { gte: startOfMonth } },
    select: { responseTimeMs: true, tokensUsed: true, statusCode: true },
  })

  const avgResponseTime = usageLogs.length > 0
    ? Math.round(usageLogs.reduce((sum, l) => sum + l.responseTimeMs, 0) / usageLogs.length)
    : 0

  const totalTokensUsed = usageLogs.reduce((sum, l) => sum + l.tokensUsed, 0)
  const errorCount = usageLogs.filter(l => l.statusCode >= 400).length
  const successRate = usageLogs.length > 0
    ? Math.round(((usageLogs.length - errorCount) / usageLogs.length) * 100 * 100) / 100
    : 100

  const byEndpoint: Record<string, number> = {}
  for (const item of usageByEndpoint) {
    byEndpoint[item.endpoint] = item._count.endpoint
  }

  const byMethod: Record<string, number> = {}
  for (const item of usageByMethod) {
    byMethod[item.method] = item._count.method
  }

  return apiSuccess({
    api_calls_this_month: apiCallsThisMonth,
    total_api_keys: totalApiKeys,
    total_webhooks: totalWebhooks,
    average_response_time_ms: avgResponseTime,
    total_tokens_used: totalTokensUsed,
    success_rate: successRate,
    calls_by_endpoint: byEndpoint,
    calls_by_method: byMethod,
  }, { creditsRemaining })
})
