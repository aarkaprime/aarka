import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { db } from '@/lib/db'
import { z } from 'zod'

const UpgradePlanSchema = z.object({
  plan: z.enum(['free', 'starter', 'professional', 'business', 'enterprise']),
})

export const POST = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError('INVALID_REQUEST_BODY', 'The request body is invalid or malformed.', 400)
  }

  const parsed = UpgradePlanSchema.safeParse(body)
  if (!parsed.success) {
    return apiError('INVALID_REQUEST_BODY', 'The request body is invalid or malformed.', 400, parsed.error.flatten())
  }

  const { plan: planSlug } = parsed.data

  // Verify plan exists
  const plan = await db.plan.findUnique({ where: { slug: planSlug } })
  if (!plan) {
    return apiError('INVALID_PLAN', 'The specified plan does not exist.', 400)
  }

  // Update developer's plan and limits
  const developer = await db.developer.update({
    where: { id: developerId },
    data: {
      plan: planSlug,
      monthlyCallsLimit: plan.callsPerMonth,
    },
  })

  // Update all active API keys with new limits
  await db.apiKey.updateMany({
    where: { developerId, status: 'active' },
    data: { monthlyCallsLimit: plan.callsPerMonth },
  })

  return apiSuccess({
    previous_plan: context.developer.plan,
    new_plan: planSlug,
    new_monthly_limit: plan.callsPerMonth,
    plan_details: {
      name: plan.name,
      price_monthly: plan.priceMonthly,
      calls_per_month: plan.callsPerMonth,
      max_api_keys: plan.maxApiKeys,
      max_webhooks: plan.maxWebhooks,
    },
  }, { creditsRemaining })
})
