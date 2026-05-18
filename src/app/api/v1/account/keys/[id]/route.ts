import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { db } from '@/lib/db'

export const DELETE = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const id = context.params?.id

  const apiKey = await db.apiKey.findFirst({ where: { id, developerId } })
  if (!apiKey) {
    return apiError('API_KEY_NOT_FOUND', 'API key not found.', 404)
  }

  if (apiKey.status === 'revoked') {
    return apiError('API_KEY_ALREADY_REVOKED', 'This API key has already been revoked.', 400)
  }

  await db.apiKey.update({
    where: { id },
    data: { status: 'revoked' },
  })

  return apiSuccess({ revoked: true, id, key_prefix: apiKey.keyPrefix })
})
