import { apiSuccess, apiError } from '@/lib/api-response'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth-helpers'
import { generateApiKey } from '@/lib/api-auth'
import { z } from 'zod'

const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  company: z.string().max(200).optional(),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError('INVALID_REQUEST_BODY', 'The request body is invalid or malformed.', 400)
  }

  const parsed = RegisterSchema.safeParse(body)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || 'Invalid input'
    return apiError('INVALID_REQUEST_BODY', firstError, 400, parsed.error.flatten())
  }

  const { name, email, password, company } = parsed.data

  try {
    // Check if email already exists
    const existing = await db.developer.findUnique({ where: { email } })
    if (existing) {
      return apiError('EMAIL_TAKEN', 'An account with this email already exists.', 409)
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Get the free plan details (fallback to defaults if no plan found)
    const freePlan = await db.plan.findUnique({ where: { slug: 'free' } })
    const callsLimit = freePlan?.callsPerMonth ?? 100

    // Create developer
    const developer = await db.developer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        company: company || null,
        role: 'developer',
        plan: 'free',
        status: 'active',
        monthlyCallsLimit: callsLimit,
      },
    })

    // Create a default API key
    const { fullKey, keyPrefix, keyHash } = generateApiKey()

    await db.apiKey.create({
      data: {
        developerId: developer.id,
        name: 'Default API Key',
        keyPrefix,
        keyHash,
        environment: 'test',
        status: 'active',
        monthlyCallsLimit: callsLimit,
      },
    })

    return apiSuccess({
      id: developer.id,
      name: developer.name,
      email: developer.email,
      company: developer.company,
      plan: developer.plan,
      api_key: fullKey,
      api_key_prefix: keyPrefix,
    })
  } catch (error: unknown) {
    console.error('Registration error:', error)

    // Handle Prisma unique constraint violation (P2002)
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return apiError('EMAIL_TAKEN', 'An account with this email already exists.', 409)
    }

    return apiError('INTERNAL_ERROR', 'Something went wrong creating your account. Please try again.', 500)
  }
}
