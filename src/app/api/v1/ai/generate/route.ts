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

export const POST = withApiAuth(async (request, context) => {
  const developerId = context.developer.id as string
  const creditsRemaining = (context.developer.monthlyCallsLimit as number) - (context.developer.monthlyCallsUsed as number)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError(API_ERRORS.INVALID_REQUEST_BODY.code, API_ERRORS.INVALID_REQUEST_BODY.message, 400)
  }

  const parsed = AIGenerateSchema.safeParse(body)
  if (!parsed.success) {
    return apiError(
      API_ERRORS.INVALID_REQUEST_BODY.code,
      API_ERRORS.INVALID_REQUEST_BODY.message,
      400,
      parsed.error.flatten()
    )
  }

  const { content_type, property, options } = parsed.data
  const language = options.language ?? 'english'
  const tone = options.tone
  const platform = options.platform
  const customPrompt = options.custom_prompt
  const save = options.save ?? true
  const webhookUrl = options.webhook_url

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
        if (!platform) {
          return apiError(API_ERRORS.MISSING_REQUIRED_FIELD.code, 'Platform is required for ad_copy content type.', 400)
        }
        results = await generateAdCopy(propertyData, platform, language)
        break
      case 'custom':
        if (!customPrompt) {
          return apiError(API_ERRORS.MISSING_REQUIRED_FIELD.code, 'custom_prompt is required for custom content type.', 400)
        }
        const customResult = await generateCustomContent(customPrompt, `Property: ${property.title}, ${property.location}`)
        results = [{
          title: 'Custom Content',
          body: customResult.content,
          contentType: 'custom',
          language,
          tone,
          tokensUsed: customResult.tokensUsed,
        }]
        break
    }
  } catch {
    return apiError(API_ERRORS.AI_GENERATION_FAILED.code, API_ERRORS.AI_GENERATION_FAILED.message, 500)
  }

  const totalTokensUsed = results.reduce((sum, r) => sum + r.tokensUsed, 0)

  // Save to GeneratedContent if requested
  let savedPropertyId: string | null = null
  if (save) {
    // Create or find the property
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

  // Trigger webhook if URL is provided
  if (webhookUrl) {
    try {
      await triggerWebhook(developerId, 'content.generated', {
        content_type,
        property_id: savedPropertyId,
        results_count: results.length,
        tokens_used: totalTokensUsed,
      })
    } catch {
      // Webhook failure is non-blocking
    }
  }

  return apiSuccess(
    {
      results: results.map(r => ({
        title: r.title,
        body: r.body,
        content_type: r.contentType,
        platform: r.platform,
        language: r.language,
        tone: r.tone,
        tokens_used: r.tokensUsed,
      })),
      total_results: results.length,
      total_tokens_used: totalTokensUsed,
      property_id: savedPropertyId,
    },
    { tokensUsed: totalTokensUsed, creditsRemaining }
  )
})
