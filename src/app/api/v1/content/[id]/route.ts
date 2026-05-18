import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { API_ERRORS } from '@/lib/api-errors'
import { db } from '@/lib/db'

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)
  const id = context.params?.id

  const content = await db.generatedContent.findFirst({ where: { id, developerId } })

  if (!content) {
    return apiError(API_ERRORS.CONTENT_NOT_FOUND.code, API_ERRORS.CONTENT_NOT_FOUND.message, 404)
  }

  return apiSuccess({
    id: content.id,
    property_id: content.propertyId,
    content_type: content.contentType,
    platform: content.platform,
    language: content.language,
    tone: content.tone,
    title: content.title,
    body: content.body,
    tokens_used: content.tokensUsed,
    ai_model: content.aiModel,
    created_at: content.createdAt,
  }, { creditsRemaining })
})

export const DELETE = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const id = context.params?.id

  const existing = await db.generatedContent.findFirst({ where: { id, developerId } })
  if (!existing) {
    return apiError(API_ERRORS.CONTENT_NOT_FOUND.code, API_ERRORS.CONTENT_NOT_FOUND.message, 404)
  }

  await db.generatedContent.delete({ where: { id } })

  return apiSuccess({ deleted: true, id })
})
