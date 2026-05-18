import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess, apiCreated, apiError, apiPaginated } from '@/lib/api-response'
import { API_ERRORS } from '@/lib/api-errors'
import { LeadSchema } from '@/lib/schemas'
import { db } from '@/lib/db'
import { triggerWebhook } from '@/lib/webhooks'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const url = new URL(request.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get('per_page') || '20')))
  const status = url.searchParams.get('status')
  const source = url.searchParams.get('source')
  const propertyId = url.searchParams.get('property_id')

  const where: Record<string, unknown> = { developerId }
  if (status) where.status = status
  if (source) where.source = source
  if (propertyId) where.propertyId = propertyId

  const [leads, total] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.lead.count({ where }),
  ])

  const formatted = leads.map(l => ({
    id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone,
    message: l.message,
    property_id: l.propertyId,
    source: l.source,
    status: l.status,
    created_at: l.createdAt,
    updated_at: l.updatedAt,
  }))

  return apiPaginated(formatted, page, perPage, total, { creditsRemaining })
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

  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400, parsed.error.flatten())
  }

  const data = parsed.data

  // Validate property_id if provided
  if (data.property_id) {
    const property = await db.property.findFirst({ where: { id: data.property_id, developerId } })
    if (!property) {
      return apiError(API_ERRORS.PROPERTY_NOT_FOUND.code, API_ERRORS.PROPERTY_NOT_FOUND.message, 404)
    }
  }

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

  // Trigger lead.created webhook
  try {
    await triggerWebhook(developerId, 'lead.created', {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      property_id: lead.propertyId,
      source: lead.source,
      created_at: lead.createdAt,
    })
  } catch {
    // Non-blocking
  }

  return apiCreated({
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
