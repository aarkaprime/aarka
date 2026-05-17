import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess } from '@/lib/api-response'

export const POST = withApiAuth(async (request, context) => {
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  return apiSuccess({
    valid: true,
    key_info: {
      id: context.apiKey.id,
      name: context.apiKey.name,
      prefix: context.apiKey.keyPrefix,
      environment: context.apiKey.environment,
      status: context.apiKey.status,
      monthly_calls_used: context.apiKey.monthlyCallsUsed,
      monthly_calls_limit: context.apiKey.monthlyCallsLimit,
      last_used_at: context.apiKey.lastUsedAt,
      created_at: context.apiKey.createdAt,
    },
    developer_info: {
      id: context.developer.id,
      name: context.developer.name,
      plan: context.developer.plan,
      status: context.developer.status,
    },
  }, { creditsRemaining })
})
