import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { API_ERRORS } from '@/lib/api-errors'
import { UpdatePropertySchema } from '@/lib/schemas'
import { db } from '@/lib/db'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)
  const id = context.params?.id

  const property = await db.property.findFirst({
    where: { id, developerId },
  })

  if (!property) {
    return apiError(API_ERRORS.PROPERTY_NOT_FOUND.code, API_ERRORS.PROPERTY_NOT_FOUND.message, 404)
  }

  // Get generated content for this property
  const generatedContent = await db.generatedContent.findMany({
    where: { propertyId: id, developerId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  // Get leads for this property
  const leads = await db.lead.findMany({
    where: { propertyId: id, developerId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return apiSuccess({
    id: property.id,
    title: property.title,
    property_type: property.propertyType,
    location: property.location,
    neighborhood: property.neighborhood,
    city: property.city,
    country: property.country,
    price: property.price,
    currency: property.currency,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area_sqm: property.areaSqm,
    features: JSON.parse(property.features || '[]'),
    description: property.description,
    status: property.status,
    created_at: property.createdAt,
    updated_at: property.updatedAt,
    generated_content: generatedContent.map(c => ({
      id: c.id,
      content_type: c.contentType,
      platform: c.platform,
      language: c.language,
      tone: c.tone,
      title: c.title,
      tokens_used: c.tokensUsed,
      created_at: c.createdAt,
    })),
    leads: leads.map(l => ({
      id: l.id,
      name: l.name,
      email: l.email,
      phone: l.phone,
      source: l.source,
      status: l.status,
      created_at: l.createdAt,
    })),
    _count: {
      leads: leads.length,
    },
  }, { creditsRemaining })
})

export const PUT = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)
  const id = context.params?.id

  const existing = await db.property.findFirst({ where: { id, developerId } })
  if (!existing) {
    return apiError(API_ERRORS.PROPERTY_NOT_FOUND.code, API_ERRORS.PROPERTY_NOT_FOUND.message, 404)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400)
  }

  const parsed = UpdatePropertySchema.safeParse(body)
  if (!parsed.success) {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400, parsed.error.flatten())
  }

  const data = parsed.data
  const updateData: Record<string, unknown> = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.property_type !== undefined) updateData.propertyType = data.property_type
  if (data.location !== undefined) updateData.location = data.location
  if (data.neighborhood !== undefined) updateData.neighborhood = data.neighborhood
  if (data.city !== undefined) updateData.city = data.city
  if (data.country !== undefined) updateData.country = data.country
  if (data.price !== undefined) updateData.price = data.price
  if (data.currency !== undefined) updateData.currency = data.currency
  if (data.bedrooms !== undefined) updateData.bedrooms = data.bedrooms
  if (data.bathrooms !== undefined) updateData.bathrooms = data.bathrooms
  if (data.area_sqm !== undefined) updateData.areaSqm = data.area_sqm
  if (data.features !== undefined) updateData.features = JSON.stringify(data.features)
  if (data.description !== undefined) updateData.description = data.description

  const property = await db.property.update({
    where: { id },
    data: updateData,
  })

  return apiSuccess({
    id: property.id,
    title: property.title,
    property_type: property.propertyType,
    location: property.location,
    neighborhood: property.neighborhood,
    city: property.city,
    country: property.country,
    price: property.price,
    currency: property.currency,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area_sqm: property.areaSqm,
    features: JSON.parse(property.features || '[]'),
    description: property.description,
    status: property.status,
    created_at: property.createdAt,
    updated_at: property.updatedAt,
  }, { creditsRemaining })
})

export const DELETE = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const id = context.params?.id

  const existing = await db.property.findFirst({ where: { id, developerId } })
  if (!existing) {
    return apiError(API_ERRORS.PROPERTY_NOT_FOUND.code, API_ERRORS.PROPERTY_NOT_FOUND.message, 404)
  }

  await db.property.delete({ where: { id } })

  return apiSuccess({ deleted: true, id })
})
