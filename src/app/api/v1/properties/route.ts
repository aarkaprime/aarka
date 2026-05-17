import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess, apiCreated, apiError } from '@/lib/api-response'
import { API_ERRORS } from '@/lib/api-errors'
import { PropertySchema } from '@/lib/schemas'
import { db } from '@/lib/db'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const url = new URL(request.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get('per_page') || '20')))
  const status = url.searchParams.get('status')
  const type = url.searchParams.get('type')
  const city = url.searchParams.get('city')
  const minPrice = url.searchParams.get('min_price') ? parseFloat(url.searchParams.get('min_price')!) : undefined
  const maxPrice = url.searchParams.get('max_price') ? parseFloat(url.searchParams.get('max_price')!) : undefined
  const minBedrooms = url.searchParams.get('min_bedrooms') ? parseInt(url.searchParams.get('min_bedrooms')!) : undefined
  const maxBedrooms = url.searchParams.get('max_bedrooms') ? parseInt(url.searchParams.get('max_bedrooms')!) : undefined
  const search = url.searchParams.get('search')
  const sort = url.searchParams.get('sort') || 'created_at_desc'

  const where: Record<string, unknown> = { developerId }

  if (status) where.status = status
  if (type) where.propertyType = type
  if (city) where.city = city
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) (where.price as Record<string, unknown>).gte = minPrice
    if (maxPrice !== undefined) (where.price as Record<string, unknown>).lte = maxPrice
  }
  if (minBedrooms !== undefined || maxBedrooms !== undefined) {
    where.bedrooms = {}
    if (minBedrooms !== undefined) (where.bedrooms as Record<string, unknown>).gte = minBedrooms
    if (maxBedrooms !== undefined) (where.bedrooms as Record<string, unknown>).lte = maxBedrooms
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { location: { contains: search } },
      { description: { contains: search } },
      { neighborhood: { contains: search } },
    ]
  }

  const orderBy: Record<string, string> = {}
  switch (sort) {
    case 'price_asc': orderBy.price = 'asc'; break
    case 'price_desc': orderBy.price = 'desc'; break
    case 'created_at_asc': orderBy.createdAt = 'asc'; break
    case 'title_asc': orderBy.title = 'asc'; break
    default: orderBy.createdAt = 'desc'; break
  }

  const [properties, total] = await Promise.all([
    db.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.property.count({ where }),
  ])

  const formatted = properties.map(p => ({
    id: p.id,
    title: p.title,
    property_type: p.propertyType,
    location: p.location,
    neighborhood: p.neighborhood,
    city: p.city,
    country: p.country,
    price: p.price,
    currency: p.currency,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area_sqm: p.areaSqm,
    features: JSON.parse(p.features || '[]'),
    description: p.description,
    status: p.status,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  }))

  const { apiPaginated } = await import('@/lib/api-response')
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

  const parsed = PropertySchema.safeParse(body)
  if (!parsed.success) {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400, parsed.error.flatten())
  }

  const data = parsed.data
  const property = await db.property.create({
    data: {
      developerId,
      title: data.title,
      propertyType: data.property_type,
      location: data.location,
      neighborhood: data.neighborhood,
      city: data.city,
      country: data.country,
      price: data.price,
      currency: data.currency,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      areaSqm: data.area_sqm,
      features: JSON.stringify(data.features ?? []),
      description: data.description,
      status: 'active',
    },
  })

  return apiCreated({
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
