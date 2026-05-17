import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess } from '@/lib/api-response'
import { db } from '@/lib/db'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalProperties, totalLeads, totalContent, apiCallsThisMonth, leadsByStatus] = await Promise.all([
    db.property.count({ where: { developerId } }),
    db.lead.count({ where: { developerId } }),
    db.generatedContent.count({ where: { developerId } }),
    db.usageLog.count({ where: { developerId, createdAt: { gte: startOfMonth } } }),
    db.lead.groupBy({
      by: ['status'],
      where: { developerId },
      _count: { status: true },
    }),
  ])

  const statusCounts: Record<string, number> = {}
  for (const item of leadsByStatus) {
    statusCounts[item.status] = item._count.status
  }

  const closedLeads = statusCounts['closed'] || 0
  const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0

  // Average response time from usage logs
  const usageLogs = await db.usageLog.findMany({
    where: { developerId, createdAt: { gte: startOfMonth } },
    select: { responseTimeMs: true },
  })

  const avgResponseTime = usageLogs.length > 0
    ? Math.round(usageLogs.reduce((sum, l) => sum + l.responseTimeMs, 0) / usageLogs.length)
    : 0

  return apiSuccess({
    total_properties: totalProperties,
    total_leads: totalLeads,
    total_content: totalContent,
    api_calls_this_month: apiCallsThisMonth,
    conversion_rate: Math.round(conversionRate * 100) / 100,
    average_response_time_ms: avgResponseTime,
    leads_by_status: statusCounts,
  }, { creditsRemaining })
})
