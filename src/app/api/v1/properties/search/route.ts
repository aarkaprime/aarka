import { withApiAuth } from '@/lib/api-auth'
import { apiPaginated } from '@/lib/api-response'
import { db } from '@/lib/db'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const url = new URL(request.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get('per_page') || '20')))
  const search = url.searchParams.get('q') || url.searchParams.get('search') || ''
  const status = url.searchParams.get('status')
  const type = url.searchParams.get('type')
  const city = url.searchParams.get('city')
  const minPrice = url.searchParams.get('min_price') ? parseFloat(url.searchParams.get('min_price')!) : undefined
  const maxPrice = url.searchParams.get('max_price') ? parseFloat(url.searchParams.get('max_price')!) : undefined
  const minBedrooms = url.searchParams.get('min_bedrooms') ? parseInt(url.searchParams.get('min_bedrooms')!) : undefined
  const maxBedrooms = url.searchParams.get('max_bedrooms') ? parseInt(url.searchParams.get('max_bedrooms')!) : undefined

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
      { city: { contains: search } },
    ]
  }

  const [properties, total] = await Promise.all([
    db.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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

  return apiPaginated(formatted, page, perPage, total, { creditsRemaining })
})
