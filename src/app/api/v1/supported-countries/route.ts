import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess } from '@/lib/api-response'

const SUPPORTED_COUNTRIES = [
  { code: 'KE', name: 'Kenya', currency: 'KES' },
  { code: 'ET', name: 'Ethiopia', currency: 'ETB' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS' },
  { code: 'UG', name: 'Uganda', currency: 'UGX' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
  { code: 'GH', name: 'Ghana', currency: 'GHS' },
  { code: 'RW', name: 'Rwanda', currency: 'RWF' },
  { code: 'MW', name: 'Malawi', currency: 'MWK' },
  { code: 'ZM', name: 'Zambia', currency: 'ZMW' },
]

export const GET = withApiAuth(async (request, context) => {
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  return apiSuccess(SUPPORTED_COUNTRIES, { creditsRemaining })
})
