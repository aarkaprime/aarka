import { apiSuccess, apiError } from '@/lib/api-response'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth-helpers'
import { z } from 'zod'

const RegisterSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  password: z.string().min(8).max(100),
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
    return apiError('INVALID_REQUEST_BODY', 'The request body is invalid or malformed.', 400, parsed.error.flatten())
  }

  const { name, email, password, company } = parsed.data

  // Check if email already exists
  const existing = await db.developer.findUnique({ where: { email } })
  if (existing) {
    return apiError('EMAIL_TAKEN', 'An account with this email already exists.', 409)
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Get the free plan details
  const freePlan = await db.plan.findUnique({ where: { slug: 'free' } })

  // Create developer
  const developer = await db.developer.create({
    data: {
      name,
      email,
      password: hashedPassword,
      company,
      role: 'developer',
      plan: 'free',
      status: 'active',
      monthlyCallsLimit: freePlan?.callsPerMonth ?? 100,
    },
  })

  // Create a default API key
  const { generateApiKey } = await import('@/lib/api-auth')
  const { fullKey, keyPrefix, keyHash } = generateApiKey()

  await db.apiKey.create({
    data: {
      developerId: developer.id,
      name: 'Default API Key',
      keyPrefix,
      keyHash,
      environment: 'test',
      status: 'active',
      monthlyCallsLimit: freePlan?.callsPerMonth ?? 100,
    },
  })

  return apiSuccess({
    id: developer.id,
    name: developer.name,
    email: developer.email,
    company: developer.company,
    plan: developer.plan,
    api_key: fullKey, // Return API key on registration
    api_key_prefix: keyPrefix,
  })
}
