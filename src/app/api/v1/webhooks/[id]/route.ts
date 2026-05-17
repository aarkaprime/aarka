import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { API_ERRORS } from '@/lib/api-errors'
import { UpdateWebhookSchema } from '@/lib/schemas'
import { db } from '@/lib/db'

export const PUT = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)
  const id = context.params?.id

  const existing = await db.webhook.findFirst({ where: { id, developerId } })
  if (!existing) {
    return apiError(API_ERRORS.WEBHOOK_NOT_FOUND.code, API_ERRORS.WEBHOOK_NOT_FOUND.message, 404)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400)
  }

  const parsed = UpdateWebhookSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400, parsed.error.flatten())
  }

  const data = parsed.data
  const updateData: Record<string, unknown> = {}
  if (data.url !== undefined) updateData.url = data.url
  if (data.events !== undefined) updateData.events = data.events.join(',')
  if (data.status !== undefined) updateData.status = data.status

  const webhook = await db.webhook.update({
    where: { id },
    data: updateData,
  })

  return apiSuccess({
    id: webhook.id,
    url: webhook.url,
    events: webhook.events.split(','),
    status: webhook.status,
    success_count: webhook.successCount,
    failure_count: webhook.failureCount,
    last_triggered_at: webhook.lastTriggeredAt,
    created_at: webhook.createdAt,
    updated_at: webhook.updatedAt,
  }, { creditsRemaining })
})

export const DELETE = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const id = context.params?.id

  const existing = await db.webhook.findFirst({ where: { id, developerId } })
  if (!existing) {
    return apiError(API_ERRORS.WEBHOOK_NOT_FOUND.code, API_ERRORS.WEBHOOK_NOT_FOUND.message, 404)
  }

  await db.webhook.delete({ where: { id } })

  return apiSuccess({ deleted: true, id })
})
