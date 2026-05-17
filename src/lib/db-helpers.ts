import { db } from '@/lib/db'

// Get developer's plan details
export async function getDeveloperPlan(developerId: string) {
  const developer = await db.developer.findUnique({ where: { id: developerId } })
  if (!developer) return null
  return db.plan.findUnique({ where: { slug: developer.plan } })
}

// Get developer's API key count
export async function getDeveloperApiKeyCount(developerId: string) {
  return db.apiKey.count({ where: { developerId, status: { not: 'revoked' } } })
}

// Get developer's webhook count
export async function getDeveloperWebhookCount(developerId: string) {
  return db.webhook.count({ where: { developerId } })
}

// Check if developer can create more API keys
export async function canCreateApiKey(developerId: string): Promise<boolean> {
  const plan = await getDeveloperPlan(developerId)
  if (!plan) return false
  const count = await getDeveloperApiKeyCount(developerId)
  return count < plan.maxApiKeys
}

// Check if developer can create more webhooks
export async function canCreateWebhook(developerId: string): Promise<boolean> {
  const plan = await getDeveloperPlan(developerId)
  if (!plan) return false
  const count = await getDeveloperWebhookCount(developerId)
  return count < plan.maxWebhooks
}

// Get usage stats for a developer
export async function getDeveloperUsageStats(developerId: string) {
  const developer = await db.developer.findUnique({ where: { id: developerId } })
  if (!developer) return null

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [totalCalls, recentCalls, totalProperties, totalLeads, totalContent] = await Promise.all([
    db.usageLog.count({ where: { developerId } }),
    db.usageLog.count({ where: { developerId, createdAt: { gte: thirtyDaysAgo } } }),
    db.property.count({ where: { developerId } }),
    db.lead.count({ where: { developerId } }),
    db.generatedContent.count({ where: { developerId } }),
  ])

  return {
    monthlyCallsUsed: developer.monthlyCallsUsed,
    monthlyCallsLimit: developer.monthlyCallsLimit,
    totalCallsAllTime: developer.totalCallsAllTime,
    recentCalls,
    totalProperties,
    totalLeads,
    totalContent,
  }
}
