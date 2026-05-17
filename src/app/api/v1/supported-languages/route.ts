import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess } from '@/lib/api-response'

const SUPPORTED_LANGUAGES = [
  { code: 'english', name: 'English', native_name: 'English' },
  { code: 'swahili', name: 'Swahili', native_name: 'Kiswahili' },
  { code: 'amharic', name: 'Amharic', native_name: 'አማርኛ' },
  { code: 'french', name: 'French', native_name: 'Français' },
  { code: 'arabic', name: 'Arabic', native_name: 'العربية' },
]

export const GET = withApiAuth(async (request, context) => {
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  return apiSuccess(SUPPORTED_LANGUAGES, { creditsRemaining })
})
