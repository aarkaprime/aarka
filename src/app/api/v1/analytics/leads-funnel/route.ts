import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess } from '@/lib/api-response'
import { db } from '@/lib/db'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const [leadsByStatus, leadsBySource, leadsWithProperty] = await Promise.all([
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
    db.lead.findMany({
      where: { developerId, propertyId: { not: null } },
      select: { propertyId: true, status: true },
    }),
  ])

  // Leads by status
  const byStatus: Record<string, number> = {}
  for (const item of leadsByStatus) {
    byStatus[item.status] = item._count.status
  }

  // Leads by source
  const bySource: Record<string, number> = {}
  for (const item of leadsBySource) {
    bySource[item.source] = item._count.source
  }

  // Leads by property type
  const propertyIds = [...new Set(leadsWithProperty.map(l => l.propertyId).filter(Boolean))] as string[]
  const properties = await db.property.findMany({
    where: { id: { in: propertyIds } },
    select: { id: true, propertyType: true },
  })

  const propertyTypeMap = new Map(properties.map(p => [p.id, p.propertyType]))
  const byPropertyType: Record<string, number> = {}
  for (const lead of leadsWithProperty) {
    if (lead.propertyId) {
      const propType = propertyTypeMap.get(lead.propertyId) || 'unknown'
      byPropertyType[propType] = (byPropertyType[propType] || 0) + 1
    }
  }

  // Conversion rates
  const totalLeads = Object.values(byStatus).reduce((sum, count) => sum + count, 0)
  const closedLeads = byStatus['closed'] || 0
  const qualifiedLeads = byStatus['qualified'] || 0
  const contactedLeads = byStatus['contacted'] || 0

  const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0
  const qualificationRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0
  const contactRate = totalLeads > 0 ? (contactedLeads / totalLeads) * 100 : 0

  return apiSuccess({
    by_status: byStatus,
    by_source: bySource,
    by_property_type: byPropertyType,
    conversion_rates: {
      overall: Math.round(conversionRate * 100) / 100,
      qualification: Math.round(qualificationRate * 100) / 100,
      contact: Math.round(contactRate * 100) / 100,
    },
    total_leads: totalLeads,
  }, { creditsRemaining })
})
