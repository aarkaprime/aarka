import { z } from 'zod'

export const ChatCompletionSchema = z.object({
  model: z.string().min(1).default('deepseek-chat'),
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string().min(1).max(32000),
  })).min(1).max(100),
  temperature: z.number().min(0).max(2).default(0.7),
  max_tokens: z.number().int().min(1).max(32768).default(2048),
  stream: z.boolean().default(false),
})

export const WebhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1).max(20),
})

export const UpdateWebhookSchema = z.object({
  url: z.string().url().optional(),
  events: z.array(z.string()).min(1).max(20).optional(),
  status: z.enum(['active', 'paused']).optional(),
})
