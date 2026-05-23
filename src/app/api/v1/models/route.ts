import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess } from '@/lib/api-response'
import { getAvailableModels } from '@/lib/ai'

export const GET = withApiAuth(async (_request, context) => {
  const models = getAvailableModels()

  const modelDetails = models.map(m => ({
    id: m.slug,
    object: 'model' as const,
    created: Math.floor(Date.now() / 1000),
    owned_by: m.provider,
    permission: [],
    root: m.slug,
    parent: null,
  }))

  return apiSuccess({
    object: 'list',
    data: modelDetails,
  }, { creditsRemaining: context.creditsRemaining })
})
