import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { API_ERRORS } from '@/lib/api-errors'
import { UpdateLeadSchema } from '@/lib/schemas'
import { db } from '@/lib/db'
import { triggerWebhook } from '@/lib/webhooks'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)
  const id = context.params?.id

  const lead = await db.lead.findFirst({ where: { id, developerId } })

  if (!lead) {
    return apiError(API_ERRORS.LEAD_NOT_FOUND.code, API_ERRORS.LEAD_NOT_FOUND.message, 404)
  }

  return apiSuccess({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message,
    property_id: lead.propertyId,
    source: lead.source,
    status: lead.status,
    created_at: lead.createdAt,
    updated_at: lead.updatedAt,
  }, { creditsRemaining })
})

export const PUT = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)
  const id = context.params?.id

  const existing = await db.lead.findFirst({ where: { id, developerId } })
  if (!existing) {
    return apiError(API_ERRORS.LEAD_NOT_FOUND.code, API_ERRORS.LEAD_NOT_FOUND.message, 404)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400)
  }

  const parsed = UpdateLeadSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400, parsed.error.flatten())
  }

  const data = parsed.data
  const updateData: Record<string, unknown> = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.email !== undefined) updateData.email = data.email
  if (data.phone !== undefined) updateData.phone = data.phone
  if (data.message !== undefined) updateData.message = data.message
  if (data.property_id !== undefined) updateData.propertyId = data.property_id
  if (data.source !== undefined) updateData.source = data.source

  const previousStatus = existing.status

  const lead = await db.lead.update({
    where: { id },
    data: updateData,
  })

  // Trigger lead.status_changed webhook if status changed
  if (previousStatus !== lead.status) {
    try {
      await triggerWebhook(developerId, 'lead.status_changed', {
        id: lead.id,
        previous_status: previousStatus,
        new_status: lead.status,
        name: lead.name,
        updated_at: lead.updatedAt,
      })
    } catch {
      // Non-blocking
    }
  }

  return apiSuccess({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message,
    property_id: lead.propertyId,
    source: lead.source,
    status: lead.status,
    created_at: lead.createdAt,
    updated_at: lead.updatedAt,
  }, { creditsRemaining })
})

export const DELETE = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const id = context.params?.id

  const existing = await db.lead.findFirst({ where: { id, developerId } })
  if (!existing) {
    return apiError(API_ERRORS.LEAD_NOT_FOUND.code, API_ERRORS.LEAD_NOT_FOUND.message, 404)
  }

  await db.lead.delete({ where: { id } })

  return apiSuccess({ deleted: true, id })
})
