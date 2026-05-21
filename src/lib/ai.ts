// NexusAPI - AI API Aggregation Platform
// Routes requests to multiple AI providers (DeepSeek, Qwen, GLM, Moonshot, etc.)

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatCompletionOptions {
  model?: string
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

interface ChatCompletionResult {
  content: string
  model: string
  tokensUsed: number
  finishReason: string
}

// Model routing configuration
const MODEL_PROVIDERS: Record<string, { provider: string; baseUrl: string; model: string }> = {
  'deepseek-chat': { provider: 'deepseek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  'deepseek-reasoner': { provider: 'deepseek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-reasoner' },
  'qwen-turbo': { provider: 'dashscope', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-turbo' },
  'qwen-plus': { provider: 'dashscope', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
  'glm-4': { provider: 'zhipu', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4' },
  'moonshot-v1-8k': { provider: 'moonshot', baseUrl: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k' },
  'yi-lightning': { provider: 'yi', baseUrl: 'https://api.lingyiwanwu.com/v1', model: 'yi-lightning' },
  'baichuan2-turbo': { provider: 'baichuan', baseUrl: 'https://api.baichuan-ai.com/v1', model: 'Baichuan4' },
}

// Fallback AI using z-ai-web-dev-sdk
async function callFallbackAI(systemPrompt: string, userPrompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<{ content: string; tokensUsed: number }> {
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000,
    })
    const content = completion.choices?.[0]?.message?.content || ''
    const tokensUsed = completion.usage?.total_tokens ?? 0
    return { content, tokensUsed }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Fallback AI also failed: ${msg}`)
  }
}

// Call a specific AI provider
async function callProvider(
  provider: string,
  baseUrl: string,
  model: string,
  messages: ChatMessage[],
  apiKey: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<{ content: string; tokensUsed: number }> {
  const body = {
    model,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 2000,
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Provider ${provider} API error ${response.status}: ${errText}`)
  }

  const data = await response.json()
  return {
    content: data.choices?.[0]?.message?.content || '',
    tokensUsed: data.usage?.total_tokens ?? 0,
  }
}

// Main chat completion function with automatic fallback
export async function chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResult> {
  const requestedModel = options.model || 'deepseek-chat'
  const modelConfig = MODEL_PROVIDERS[requestedModel]

  if (!modelConfig) {
    throw new Error(`Model "${requestedModel}" is not supported. Available models: ${Object.keys(MODEL_PROVIDERS).join(', ')}`)
  }

  // Try DeepSeek first (primary provider)
  const deepseekKey = process.env.DEEPSEEK_API_KEY
  if (deepseekKey && modelConfig.provider === 'deepseek') {
    try {
      const result = await callProvider(
        modelConfig.provider,
        modelConfig.baseUrl,
        modelConfig.model,
        options.messages,
        deepseekKey,
        { temperature: options.temperature, maxTokens: options.maxTokens }
      )
      return {
        content: result.content,
        model: requestedModel,
        tokensUsed: result.tokensUsed,
        finishReason: 'stop',
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error'
      if (errMsg.includes('402') || errMsg.includes('401') || errMsg.includes('Insufficient Balance')) {
        console.log('DeepSeek auth/balance error, falling back to alternate provider')
      } else {
        console.error('DeepSeek call failed:', errMsg)
        // Retry once
        try {
          const result = await callProvider(
            modelConfig.provider,
            modelConfig.baseUrl,
            modelConfig.model,
            options.messages,
            deepseekKey,
            { temperature: options.temperature, maxTokens: options.maxTokens }
          )
          return { content: result.content, model: requestedModel, tokensUsed: result.tokensUsed, finishReason: 'stop' }
        } catch {
          console.log('DeepSeek retry failed, using fallback')
        }
      }
    }
  }

  // Fallback to z-ai-web-dev-sdk
  const systemMsg = options.messages.find(m => m.role === 'system')?.content || ''
  const userMsg = options.messages.filter(m => m.role !== 'system').map(m => m.content).join('\n')

  const result = await callFallbackAI(systemMsg, userMsg, {
    temperature: options.temperature,
    maxTokens: options.maxTokens,
  })

  return {
    content: result.content,
    model: requestedModel,
    tokensUsed: result.tokensUsed,
    finishReason: 'stop',
  }
}

// Get available models
export function getAvailableModels() {
  return Object.entries(MODEL_PROVIDERS).map(([slug, config]) => ({
    slug,
    provider: config.provider,
    model: config.model,
  }))
}

// Legacy support - generate custom content
export async function generateCustomContent(prompt: string, context?: string): Promise<{ content: string; tokensUsed: number }> {
  const systemPrompt = context || 'You are a helpful AI assistant.'
  return callFallbackAI(systemPrompt, prompt, { maxTokens: 3000 })
}
