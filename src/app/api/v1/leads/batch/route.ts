import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess, apiError, apiCreated } from '@/lib/api-response'
import { API_ERRORS } from '@/lib/api-errors'
import { LeadSchema } from '@/lib/schemas'
import { db } from '@/lib/db'
import { triggerWebhook } from '@/lib/webhooks'
import { z } from 'zod'

const BatchLeadSchema = z.object({
  leads: z.array(LeadSchema).min(1).max(100),
})

export const POST = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400)
  }

  const parsed = BatchLeadSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400, parsed.error.flatten())
  }

  const { leads: leadsData } = parsed.data
  const created: Array<Record<string, unknown>> = []
  const errors: Array<{ index: number; error: string }> = []

  for (let i = 0; i < leadsData.length; i++) {
    const data = leadsData[i]
    try {
      const lead = await db.lead.create({
        data: {
          developerId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          propertyId: data.property_id,
          source: data.source,
          status: 'new',
        },
      })

      created.push({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        message: lead.message,
        property_id: lead.propertyId,
        source: lead.source,
        status: lead.status,
        created_at: lead.createdAt,
      })
    } catch {
      errors.push({ index: i, error: 'Failed to create lead' })
    }
  }

  // Trigger webhook for batch
  if (created.length > 0) {
    try {
      await triggerWebhook(developerId, 'lead.batch_created', {
        count: created.length,
        lead_ids: created.map(l => l.id),
      })
    } catch {
      // Non-blocking
    }
  }

  return apiCreated({
    created,
    errors,
    total_requested: leadsData.length,
    total_created: created.length,
    total_errors: errors.length,
  }, { creditsRemaining })
})
