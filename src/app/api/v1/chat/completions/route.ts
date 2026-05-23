import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { chatCompletion } from '@/lib/ai'
import { API_ERRORS } from '@/lib/api-errors'

export const POST = withApiAuth(async (request, context) => {
  try {
    const body = await request.json()
    const { model, messages, temperature, max_tokens, stream } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return apiError(API_ERRORS.INVALID_MESSAGES_FORMAT, context.creditsRemaining)
    }

    const result = await chatCompletion({
      model: model || 'deepseek-chat',
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content,
      })),
      temperature: temperature ?? 0.7,
      maxTokens: max_tokens ?? 2048,
      stream: stream ?? false,
    })

    return apiSuccess({
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: result.model,
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: result.content,
        },
        finish_reason: result.finishReason,
      }],
      usage: {
        prompt_tokens: Math.round(result.tokensUsed * 0.3),
        completion_tokens: Math.round(result.tokensUsed * 0.7),
        total_tokens: result.tokensUsed,
      },
    }, { creditsRemaining: context.creditsRemaining })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'

    if (msg.includes('not supported')) {
      return apiError(API_ERRORS.INVALID_MODEL, context.creditsRemaining)
    }

    return apiError(API_ERRORS.AI_GENERATION_FAILED, context.creditsRemaining)
  }
})
