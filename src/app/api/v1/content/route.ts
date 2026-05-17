import { withApiAuth } from '@/lib/api-auth'
import { apiPaginated } from '@/lib/api-response'
import { db } from '@/lib/db'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const url = new URL(request.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get('per_page') || '20')))
  const contentType = url.searchParams.get('content_type')
  const language = url.searchParams.get('language')
  const propertyId = url.searchParams.get('property_id')

  const where: Record<string, unknown> = { developerId }
  if (contentType) where.contentType = contentType
  if (language) where.language = language
  if (propertyId) where.propertyId = propertyId

  const [content, total] = await Promise.all([
    db.generatedContent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.generatedContent.count({ where }),
  ])

  const formatted = content.map(c => ({
    id: c.id,
    property_id: c.propertyId,
    content_type: c.contentType,
    platform: c.platform,
    language: c.language,
    tone: c.tone,
    title: c.title,
    body: c.body,
    tokens_used: c.tokensUsed,
    ai_model: c.aiModel,
    created_at: c.createdAt,
  }))

  return apiPaginated(formatted, page, perPage, total, { creditsRemaining })
})
