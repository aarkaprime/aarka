import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess } from '@/lib/api-response'
import { db } from '@/lib/db'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const [totalLeads, leadsByStatus, leadsBySource] = await Promise.all([
    db.lead.count({ where: { developerId } }),
    db.lead.groupBy({
      by: ['status'],
      where: { developerId },
      _count: { status: true },
    }),
    db.lead.groupBy({
      by: ['source'],
      where: { developerId },
      _count: { source: true },
    }),
  ])

  const statusCounts: Record<string, number> = {}
  for (const item of leadsByStatus) {
    statusCounts[item.status] = item._count.status
  }

  const sourceCounts: Record<string, number> = {}
  for (const item of leadsBySource) {
    sourceCounts[item.source] = item._count.source
  }

  const conversionRate = totalLeads > 0
    ? ((statusCounts['closed'] || 0) / totalLeads) * 100
    : 0

  return apiSuccess({
    total_leads: totalLeads,
    by_status: statusCounts,
    by_source: sourceCounts,
    conversion_rate: Math.round(conversionRate * 100) / 100,
  }, { creditsRemaining })
})
