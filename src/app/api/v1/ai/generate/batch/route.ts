import { withApiAuth } from '@/lib/api-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { API_ERRORS } from '@/lib/api-errors'
import { AIGenerateSchema } from '@/lib/schemas'
import { db } from '@/lib/db'
import {
  generatePropertyDescription,
  generateSocialMediaPosts,
  generateWhatsAppMessages,
  generateEmailCampaign,
  generateAdCopy,
  generateCustomContent,
} from '@/lib/ai'
import { triggerWebhook } from '@/lib/webhooks'
import { z } from 'zod'

const BatchGenerateSchema = z.object({
  items: z.array(z.object({
    content_type: AIGenerateSchema.shape.content_type,
    property: AIGenerateSchema.shape.property,
    options: AIGenerateSchema.shape.options,
  })).min(1).max(10),
})

export const POST = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400)
  }

  const parsed = BatchGenerateSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(
      API_ERRORS.INVALID_REQUEST_BODY.code,
      API_ERRORS.INVALID_REQUEST_BODY.message,
      400,
      parsed.error.flatten()
    )
  }

  const { items } = parsed.data
  const allResults: Array<{
    item_index: number
    content_type: string
    results: Array<{
      title: string
      body: string
      content_type: string
      platform?: string
      language: string
      tone?: string
      tokens_used: number
    }>
    total_tokens_used: number
    property_id?: string
    error?: string
  }> = []

  let totalTokensUsed = 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const { content_type, property, options } = item
    const language = options.language ?? 'english'
    const platform = options.platform
    const customPrompt = options.custom_prompt
    const save = options.save ?? true

    const propertyData = {
      title: property.title,
      propertyType: property.property_type,
      location: property.location,
      neighborhood: property.neighborhood,
      city: property.city,
      country: property.country,
      price: property.price,
      currency: property.currency,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      areaSqm: property.area_sqm,
      features: property.features ?? [],
      description: property.description,
    }

    let results: Array<{
      title: string
      body: string
      contentType: string
      platform?: string
      language: string
      tone?: string
      tokensUsed: number
    }> = []

    try {
      switch (content_type) {
        case 'property_description':
          results = await generatePropertyDescription(propertyData, language)
          break
        case 'social_post':
          results = await generateSocialMediaPosts(propertyData, language)
          break
        case 'whatsapp_msg':
          results = await generateWhatsAppMessages(propertyData, language)
          break
        case 'email_campaign':
          results = await generateEmailCampaign(propertyData, language)
          break
        case 'ad_copy':
          results = await generateAdCopy(propertyData, platform ?? 'facebook', language)
          break
        case 'custom':
          if (!customPrompt) {
            allResults.push({ item_index: i, content_type, results: [], total_tokens_used: 0, error: 'custom_prompt is required' })
            continue
          }
          const customResult = await generateCustomContent(customPrompt, `Property: ${property.title}, ${property.location}`)
          results = [{
            title: 'Custom Content',
            body: customResult.content,
            contentType: 'custom',
            language,
            tokensUsed: customResult.tokensUsed,
          }]
          break
      }
    } catch {
      allResults.push({ item_index: i, content_type, results: [], total_tokens_used: 0, error: API_ERRORS.AI_GENERATION_FAILED.message })
      continue
    }

    const itemTokensUsed = results.reduce((sum, r) => sum + r.tokensUsed, 0)
    totalTokensUsed += itemTokensUsed

    let savedPropertyId: string | undefined
    if (save) {
      const savedProperty = await db.property.create({
        data: {
          developerId,
          title: property.title,
          propertyType: property.property_type,
          location: property.location,
          neighborhood: property.neighborhood,
          city: property.city,
          country: property.country,
          price: property.price,
          currency: property.currency,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          areaSqm: property.area_sqm,
          features: JSON.stringify(property.features ?? []),
          description: property.description,
          status: 'active',
        },
      })
      savedPropertyId = savedProperty.id

      for (const result of results) {
        await db.generatedContent.create({
          data: {
            developerId,
            propertyId: savedPropertyId,
            contentType: result.contentType,
            platform: result.platform,
            language: result.language,
            tone: result.tone,
            title: result.title,
            body: result.body,
            tokensUsed: result.tokensUsed,
            aiModel: 'deepseek-chat',
          },
        })
      }
    }

    allResults.push({
      item_index: i,
      content_type,
      results: results.map(r => ({
        title: r.title,
        body: r.body,
        content_type: r.contentType,
        platform: r.platform,
        language: r.language,
        tone: r.tone,
        tokens_used: r.tokensUsed,
      })),
      total_tokens_used: itemTokensUsed,
      property_id: savedPropertyId,
    })
  }

  // Trigger webhook for batch
  try {
    await triggerWebhook(developerId, 'content.batch_generated', {
      items_count: items.length,
      total_tokens_used: totalTokensUsed,
    })
  } catch {
    // Non-blocking
  }

  return apiSuccess(
    {
      items: allResults,
      total_items: allResults.length,
      total_tokens_used: totalTokensUsed,
    },
    { tokensUsed: totalTokensUsed, creditsRemaining }
  )
})
