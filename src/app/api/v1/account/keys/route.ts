import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess, apiCreated, apiError } from '@/lib/api-response'
import { API_ERRORS } from '@/lib/api-errors'
import { db } from '@/lib/db'
import { generateApiKey } from '@/lib/api-auth'
import { canCreateApiKey } from '@/lib/db-helpers'
import { z } from 'zod'

const CreateApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  environment: z.enum(['test', 'live']).default('test'),
})

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const apiKeys = await db.apiKey.findMany({
    where: { developerId },
    orderBy: { createdAt: 'desc' },
  })

  const formatted = apiKeys.map(key => ({
    id: key.id,
    name: key.name,
    key_prefix: key.keyPrefix + '***', // Show prefix, mask the rest
    environment: key.environment,
    status: key.status,
    monthly_calls_used: key.monthlyCallsUsed,
    monthly_calls_limit: key.monthlyCallsLimit,
    last_used_at: key.lastUsedAt,
    created_at: key.createdAt,
    expires_at: key.expiresAt,
  }))

  return apiSuccess(formatted, { creditsRemaining })
})

export const POST = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  // Check plan limits
  const canCreate = await canCreateApiKey(developerId)
  if (!canCreate) {
    return apiError('API_KEY_LIMIT_EXCEEDED', 'You have reached the maximum number of API keys for your plan.', 400)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400)
  }

  const parsed = CreateApiKeySchema.safeParse(body)
  if (!parsed.success) {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400, parsed.error.flatten())
  }

  const data = parsed.data
  const { fullKey, keyPrefix, keyHash } = generateApiKey()

  const apiKey = await db.apiKey.create({
    data: {
      developerId,
      name: data.name,
      keyPrefix,
      keyHash,
      environment: data.environment,
      status: 'active',
      monthlyCallsLimit: (context.developer.monthlyCallsLimit as number) || 100,
    },
  })

  return apiCreated({
    id: apiKey.id,
    name: apiKey.name,
    key: fullKey, // Return full key only once on creation
    key_prefix: keyPrefix,
    environment: apiKey.environment,
    status: apiKey.status,
    created_at: apiKey.createdAt,
  }, { creditsRemaining })
})
