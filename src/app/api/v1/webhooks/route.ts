import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess, apiCreated, apiError } from '@/lib/api-response'
import { API_ERRORS } from '@/lib/api-errors'
import { WebhookSchema } from '@/lib/schemas'
import { db } from '@/lib/db'
import { generateWebhookSecret } from '@/lib/webhooks'
import { canCreateWebhook } from '@/lib/db-helpers'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const webhooks = await db.webhook.findMany({
    where: { developerId },
    orderBy: { createdAt: 'desc' },
  })

  const formatted = webhooks.map(w => ({
    id: w.id,
    url: w.url,
    events: w.events.split(','),
    status: w.status,
    secret: `***${w.secret.slice(-8)}`,
    success_count: w.successCount,
    failure_count: w.failureCount,
    last_triggered_at: w.lastTriggeredAt,
    created_at: w.createdAt,
    updated_at: w.updatedAt,
  }))

  return apiSuccess(formatted, { creditsRemaining })
})

export const POST = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  // Check plan limits
  const canCreate = await canCreateWebhook(developerId)
  if (!canCreate) {
    return apiError(API_ERRORS.WEBHOOK_LIMIT_EXCEEDED.code, API_ERRORS.WEBHOOK_LIMIT_EXCEEDED.message, 400)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400)
  }

  const parsed = WebhookSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400, parsed.error.flatten())
  }

  const data = parsed.data
  const secret = generateWebhookSecret()

  const webhook = await db.webhook.create({
    data: {
      developerId,
      url: data.url,
      events: data.events.join(','),
      secret,
      status: 'active',
    },
  })

  return apiCreated({
    id: webhook.id,
    url: webhook.url,
    events: webhook.events.split(','),
    status: webhook.status,
    secret, // Return full secret only on creation
    created_at: webhook.createdAt,
  }, { creditsRemaining })
})
