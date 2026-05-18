import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess } from '@/lib/api-response'
import { db } from '@/lib/db'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalCalls, callsByEndpoint, callsByMethod] = await Promise.all([
    db.usageLog.count({ where: { developerId, createdAt: { gte: startOfMonth } } }),
    db.usageLog.groupBy({
      by: ['endpoint'],
      where: { developerId, createdAt: { gte: startOfMonth } },
      _count: { endpoint: true },
      orderBy: { _count: { endpoint: 'desc' } },
    }),
    db.usageLog.groupBy({
      by: ['method'],
      where: { developerId, createdAt: { gte: startOfMonth } },
      _count: { method: true },
    }),
  ])

  return apiSuccess({
    period: {
      start: startOfMonth.toISOString(),
      end: now.toISOString(),
    },
    total_calls: totalCalls,
    by_endpoint: callsByEndpoint.map(item => ({
      endpoint: item.endpoint,
      count: item._count.endpoint,
    })),
    by_method: callsByMethod.map(item => ({
      method: item.method,
      count: item._count.method,
    })),
    monthly_calls_used: context.developer.monthlyCallsUsed,
    monthly_calls_limit: context.developer.monthlyCallsLimit,
    credits_remaining: creditsRemaining,
  }, { creditsRemaining })
})
