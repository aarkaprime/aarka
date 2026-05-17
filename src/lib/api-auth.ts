import { db } from '@/lib/db'
import { createHash, randomBytes } from 'crypto'
import { API_ERRORS } from './api-errors'
import { apiError } from './api-response'

// In-memory rate limiter
const rateLimitStore = new Map<string, { timestamps: number[] }>()

export function generateApiKey(): { fullKey: string; keyPrefix: string; keyHash: string } {
  const randomPart = randomBytes(32).toString('hex')
  const fullKey = `ei_sk_${randomPart}`
  const keyPrefix = fullKey.substring(0, 12)
  const keyHash = createHash('sha256').update(fullKey).digest('hex')
  return { fullKey, keyPrefix, keyHash }
}

export async function validateApiKey(request: Request): Promise<{
  valid: boolean
  apiKey?: Awaited<ReturnType<typeof db.apiKey.findUnique>> & { developer: Awaited<ReturnType<typeof db.developer.findUnique>> }
  developer?: Awaited<ReturnType<typeof db.developer.findUnique>>
  error?: { code: string; message: string; status: number }
}> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: API_ERRORS.MISSING_API_KEY }
  }

  const key = authHeader.substring(7)
  const keyHash = createHash('sha256').update(key).digest('hex')

  const apiKey = await db.apiKey.findFirst({ where: { keyHash }, include: { developer: true } })
  if (!apiKey) return { valid: false, error: API_ERRORS.INVALID_API_KEY }
  if (apiKey.status === 'revoked' || apiKey.status === 'suspended') return { valid: false, error: API_ERRORS.API_KEY_REVOKED }
  if (apiKey.developer.status === 'suspended') return { valid: false, error: API_ERRORS.ACCOUNT_SUSPENDED }
  if (apiKey.monthlyCallsUsed >= apiKey.monthlyCallsLimit) return { valid: false, error: API_ERRORS.MONTHLY_QUOTA_EXCEEDED }

  // Update last used
  await db.apiKey.update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } })

  return { valid: true, apiKey, developer: apiKey.developer }
}

export function rateLimitCheck(apiKeyId: string, limit: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const windowMs = 60_000 // 1 minute
  const entry = rateLimitStore.get(apiKeyId) || { timestamps: [] }

  // Clean old timestamps
  entry.timestamps = entry.timestamps.filter((t: number) => now - t < windowMs)

  if (entry.timestamps.length >= limit) {
    const oldestInWindow = entry.timestamps[0]
    const resetAt = oldestInWindow + windowMs
    rateLimitStore.set(apiKeyId, entry)
    return { allowed: false, remaining: 0, resetAt: Math.floor(resetAt / 1000) }
  }

  entry.timestamps.push(now)
  rateLimitStore.set(apiKeyId, entry)
  return { allowed: true, remaining: limit - entry.timestamps.length, resetAt: Math.floor((now + windowMs) / 1000) }
}

export async function logUsage(apiKeyId: string, developerId: string, data: {
  endpoint: string; method: string; statusCode: number; tokensUsed: number; responseTimeMs: number; ipAddress?: string; userAgent?: string;
}): Promise<void> {
  try {
    await db.usageLog.create({
      data: { apiKeyId, developerId, ...data },
    })
    await db.apiKey.update({
      where: { id: apiKeyId },
      data: { monthlyCallsUsed: { increment: 1 } },
    })
    await db.developer.update({
      where: { id: developerId },
      data: { monthlyCallsUsed: { increment: 1 }, totalCallsAllTime: { increment: 1 } },
    })
  } catch (e) {
    console.error('Failed to log usage:', e)
  }
}

export function withApiAuth(
  handler: (request: Request, context: { developer: Record<string, unknown>; apiKey: Record<string, unknown>; params?: Record<string, string> }) => Promise<Response>
) {
  return async (request: Request, routeContext?: { params?: Promise<Record<string, string>> | Record<string, string> }) => {
    const startTime = Date.now()
    const authResult = await validateApiKey(request)

    if (!authResult.valid) {
      return apiError(authResult.error!.code, authResult.error!.message, authResult.error!.status)
    }

    // Rate limiting
    const plan = await db.plan.findUnique({ where: { slug: authResult.developer!.plan as string } })
    const rateLimit = plan?.rateLimitPerMin ?? 60
    const rateResult = rateLimitCheck(authResult.apiKey!.id, rateLimit)

    if (!rateResult.allowed) {
      const response = apiError(API_ERRORS.RATE_LIMIT_EXCEEDED.code, API_ERRORS.RATE_LIMIT_EXCEEDED.message, 429)
      // Log the rate limited request
      logUsage(authResult.apiKey!.id, authResult.developer!.id as string, {
        endpoint: new URL(request.url).pathname,
        method: request.method,
        statusCode: 429,
        tokensUsed: 0,
        responseTimeMs: Date.now() - startTime,
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      })
      return response
    }

    // Resolve params — Next.js 16 passes params as a Promise
    let resolvedParams: Record<string, string> | undefined
    if (routeContext?.params) {
      resolvedParams = routeContext.params instanceof Promise
        ? await routeContext.params
        : routeContext.params
    }

    try {
      const result = await handler(request, { developer: authResult.developer as Record<string, unknown>, apiKey: authResult.apiKey as Record<string, unknown>, params: resolvedParams })

      // Log successful usage
      logUsage(authResult.apiKey!.id, authResult.developer!.id as string, {
        endpoint: new URL(request.url).pathname,
        method: request.method,
        statusCode: result.status,
        tokensUsed: 0,
        responseTimeMs: Date.now() - startTime,
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      })

      // Add rate limit headers
      const headers = new Headers(result.headers)
      headers.set('X-RateLimit-Limit', rateLimit.toString())
      headers.set('X-RateLimit-Remaining', rateResult.remaining.toString())
      headers.set('X-RateLimit-Reset', rateResult.resetAt.toString())
      headers.set('X-Request-ID', crypto.randomUUID())
      headers.set('X-Response-Time', `${Date.now() - startTime}ms`)

      return new Response(result.body, { status: result.status, statusText: result.statusText, headers })
    } catch (error) {
      logUsage(authResult.apiKey!.id, authResult.developer!.id as string, {
        endpoint: new URL(request.url).pathname,
        method: request.method,
        statusCode: 500,
        tokensUsed: 0,
        responseTimeMs: Date.now() - startTime,
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      })
      return apiError('INTERNAL_ERROR', 'An internal error occurred.', 500)
    }
  }
}
