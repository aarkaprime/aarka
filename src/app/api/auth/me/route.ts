import { apiError, apiSuccess } from '@/lib/api-response'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return apiError('UNAUTHORIZED', 'You must be signed in to access this endpoint.', 401)
  }

  const userId = (session.user as Record<string, unknown>).id as string
  const developer = await db.developer.findUnique({ where: { id: userId } })

  if (!developer) {
    return apiError('NOT_FOUND', 'Developer account not found.', 404)
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
  })
}
