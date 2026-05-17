import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { API_ERRORS } from '@/lib/api-errors'
import { db } from '@/lib/db'
import { z } from 'zod'

const UpdateAccountSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  company: z.string().max(200).optional(),
  email: z.string().email().optional(),
})

export const GET = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  const developer = await db.developer.findUnique({ where: { id: developerId } })
  if (!developer) {
    return apiError('ACCOUNT_NOT_FOUND', 'Account not found.', 404)
  }

  return apiSuccess({
    id: developer.id,
    email: developer.email,
    name: developer.name,
    company: developer.company,
    role: developer.role,
    plan: developer.plan,
    status: developer.status,
    monthly_calls_used: developer.monthlyCallsUsed,
    monthly_calls_limit: developer.monthlyCallsLimit,
    total_calls_all_time: developer.totalCallsAllTime,
    created_at: developer.createdAt,
    updated_at: developer.updatedAt,
  }, { creditsRemaining })
})

export const PUT = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400)
  }

  const parsed = UpdateAccountSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400, parsed.error.flatten())
  }

  const data = parsed.data

  // Check email uniqueness if changing email
  if (data.email) {
    const existing = await db.developer.findFirst({
      where: { email: data.email, NOT: { id: developerId } },
    })
    if (existing) {
      return apiError('EMAIL_TAKEN', 'This email is already in use.', 409)
    }
  }

  const updateData: Record<string, unknown> = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.company !== undefined) updateData.company = data.company
  if (data.email !== undefined) updateData.email = data.email

  const developer = await db.developer.update({
    where: { id: developerId },
    data: updateData,
  })

  return apiSuccess({
    id: developer.id,
    email: developer.email,
    name: developer.name,
    company: developer.company,
    role: developer.role,
    plan: developer.plan,
    status: developer.status,
    monthly_calls_used: developer.monthlyCallsUsed,
    monthly_calls_limit: developer.monthlyCallsLimit,
    total_calls_all_time: developer.totalCallsAllTime,
    created_at: developer.createdAt,
    updated_at: developer.updatedAt,
  }, { creditsRemaining })
})
