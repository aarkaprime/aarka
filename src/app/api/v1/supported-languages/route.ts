import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess } from '@/lib/api-response'

const SUPPORTED_LANGUAGES = [
  { code: 'english', name: 'English', native_name: 'English' },
  { code: 'spanish', name: 'Spanish', native_name: 'Español' },
  { code: 'french', name: 'French', native_name: 'Français' },
  { code: 'german', name: 'German', native_name: 'Deutsch' },
  { code: 'portuguese', name: 'Portuguese', native_name: 'Português' },
  { code: 'arabic', name: 'Arabic', native_name: 'العربية' },
  { code: 'chinese', name: 'Chinese', native_name: '中文' },
  { code: 'japanese', name: 'Japanese', native_name: '日本語' },
  { code: 'korean', name: 'Korean', native_name: '한국어' },
  { code: 'hindi', name: 'Hindi', native_name: 'हिन्दी' },
]

export const GET = withApiAuth(async (request, context) => {
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  return apiSuccess(SUPPORTED_LANGUAGES, { creditsRemaining })
})
