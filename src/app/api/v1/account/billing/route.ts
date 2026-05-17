import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess } from '@/lib/api-response'
import { db } from '@/lib/db'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const developer = await db.developer.findUnique({ where: { id: developerId } })
  if (!developer) {
    return apiSuccess(null)
  }

  const plan = await db.plan.findUnique({ where: { slug: developer.plan } })

  return apiSuccess({
    current_plan: {
      slug: developer.plan,
      name: plan?.name ?? developer.plan,
      price_monthly: plan?.priceMonthly ?? 0,
      calls_per_month: plan?.callsPerMonth ?? developer.monthlyCallsLimit,
      max_api_keys: plan?.maxApiKeys ?? 2,
      max_webhooks: plan?.maxWebhooks ?? 2,
      features: plan?.features ? plan.features.split(',') : [],
      ai_models_available: plan?.aiModelsAvailable ? plan.aiModelsAvailable.split(',') : [],
      rate_limit_per_min: plan?.rateLimitPerMin ?? 60,
      support_level: plan?.supportLevel ?? 'community',
    },
    usage: {
      monthly_calls_used: developer.monthlyCallsUsed,
      monthly_calls_limit: developer.monthlyCallsLimit,
      usage_percentage: developer.monthlyCallsLimit > 0
        ? Math.round((developer.monthlyCallsUsed / developer.monthlyCallsLimit) * 100)
        : 0,
      total_calls_all_time: developer.totalCallsAllTime,
    },
  }, { creditsRemaining })
})
