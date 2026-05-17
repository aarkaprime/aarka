import ZAI from 'z-ai-web-dev-sdk'

interface PropertyData {
  title: string
  propertyType: string
  location: string
  neighborhood?: string
  city?: string
  country?: string
  price: number
  currency?: string
  bedrooms: number
  bathrooms: number
  areaSqm?: number
  features: string[]
  description?: string
}

interface ContentResult {
  title: string
  body: string
  contentType: string
  platform?: string
  language: string
  tone?: string
  tokensUsed: number
}

const REAL_ESTATE_SYSTEM_PROMPT = `You are an elite real estate marketing copywriter. You specialize in the East African property market — Kenya, Ethiopia, Tanzania, Uganda, Nigeria, South Africa, Ghana. You understand local buyer psychology, neighborhood dynamics, investment potential, and cultural nuances.

Rules:
- Use metric system (square meters, not square feet)
- Reference local landmarks, neighborhoods, and amenities
- Highlight investment potential (appreciation, rental yield, capital gains)
- Use the local currency when mentioned
- Be warm and inviting but professional
- Create emotional connection with the property
- Always include a clear call-to-action
- For Swahili: use natural Swahili, not translated English
- For Amharic: use natural Amharic, not translated English
- Never use American/British real estate clichés that don't apply in Africa`

async function callAI(systemPrompt: string, userPrompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<{ content: string; tokensUsed: number }> {
  try {
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000,
    })
    const content = completion.choices[0]?.message?.content || ''
    const tokensUsed = completion.usage?.total_tokens ?? 0
    return { content, tokensUsed }
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('AI call failed:', errMsg)
    // Retry once
    try {
      const zai = await ZAI.create()
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
      })
      const content = completion.choices[0]?.message?.content || ''
      const tokensUsed = completion.usage?.total_tokens ?? 0
      return { content, tokensUsed }
    } catch (retryError: unknown) {
      const retryMsg = retryError instanceof Error ? retryError.message : 'Unknown error'
      throw new Error(`AI generation failed: ${retryMsg}`)
    }
  }
}

export async function generatePropertyDescription(data: PropertyData, language: string = 'english'): Promise<ContentResult[]> {
  const tones = ['professional', 'lifestyle', 'short'] as const
  const results: ContentResult[] = []

  for (const tone of tones) {
    const toneInstructions: Record<string, string> = {
      professional: 'Write a formal, data-driven, investment-focused property description. Include market data references and ROI potential.',
      lifestyle: 'Write a warm, emotional property description focusing on the living experience, family life, and lifestyle benefits.',
      short: 'Write a punchy, social-media-ready property description under 100 words. Brief and compelling.',
    }

    const { content, tokensUsed } = await callAI(
      REAL_ESTATE_SYSTEM_PROMPT,
      `Generate a ${tone} property description in ${language} for this property:\n\nTitle: ${data.title}\nType: ${data.propertyType}\nLocation: ${data.location}${data.neighborhood ? ', ' + data.neighborhood : ''}\nCity: ${data.city || 'Nairobi'}\nCountry: ${data.country || 'Kenya'}\nPrice: ${data.price} ${data.currency || 'KES'}\nBedrooms: ${data.bedrooms}\nBathrooms: ${data.bathrooms}${data.areaSqm ? '\nArea: ' + data.areaSqm + ' sqm' : ''}\nFeatures: ${data.features.join(', ') || 'None specified'}\n\n${toneInstructions[tone]}`
    )

    results.push({
      title: `${tone.charAt(0).toUpperCase() + tone.slice(1)} Property Description`,
      body: content,
      contentType: 'property_description',
      language,
      tone,
      tokensUsed,
    })
  }

  return results
}

export async function generateSocialMediaPosts(data: PropertyData, language: string = 'english'): Promise<ContentResult[]> {
  const prompt = `Generate 5 social media posts in ${language} for this property. Format each post with a label:

FACEBOOK POST 1: (longer, engaging, with questions)
FACEBOOK POST 2: (longer, engaging, with questions)
INSTAGRAM POST 1: (visual-first, hashtag-heavy)
INSTAGRAM POST 2: (visual-first, hashtag-heavy, story-prompt style)
TWITTER/X POST: (concise, 280 chars max, thread-style)

Property Details:
Title: ${data.title}
Type: ${data.propertyType}
Location: ${data.location}${data.neighborhood ? ', ' + data.neighborhood : ''}
Price: ${data.price} ${data.currency || 'KES'}
Bedrooms: ${data.bedrooms}, Bathrooms: ${data.bathrooms}
${data.areaSqm ? 'Area: ' + data.areaSqm + ' sqm' : ''}
Features: ${data.features.join(', ') || 'None specified'}

Include relevant hashtags for the local African market.`

  const { content, tokensUsed } = await callAI(REAL_ESTATE_SYSTEM_PROMPT, prompt, { maxTokens: 3000 })

  const posts = content.split(/\n(?=FACEBOOK|INSTAGRAM|TWITTER)/i).filter(p => p.trim())
  const platforms = ['facebook', 'facebook', 'instagram', 'instagram', 'twitter']

  return posts.slice(0, 5).map((post, i) => ({
    title: `Social Media Post ${i + 1}`,
    body: post.replace(/^(FACEBOOK|INSTAGRAM|TWITTER\/X)\s+POST\s*\d*:\s*/i, '').trim(),
    contentType: 'social_post' as const,
    platform: platforms[i] || 'facebook',
    language,
    tokensUsed: Math.floor(tokensUsed / 5),
  }))
}

export async function generateWhatsAppMessages(data: PropertyData, language: string = 'english'): Promise<ContentResult[]> {
  const prompt = `Generate 3 WhatsApp messages in ${language} for this property:

1. PROFESSIONAL: Formal property listing for serious buyers
2. CASUAL: Friendly, conversational, like a friend recommending
3. URGENT: Price drop, limited availability, FOMO-driven

Property Details:
Title: ${data.title}
Type: ${data.propertyType}
Location: ${data.location}${data.neighborhood ? ', ' + data.neighborhood : ''}
Price: ${data.price} ${data.currency || 'KES'}
Bedrooms: ${data.bedrooms}, Bathrooms: ${data.bathrooms}
${data.areaSqm ? 'Area: ' + data.areaSqm + ' sqm' : ''}
Features: ${data.features.join(', ') || 'None specified'}

Keep each message short, punchy, optimized for WhatsApp reading.`

  const { content, tokensUsed } = await callAI(REAL_ESTATE_SYSTEM_PROMPT, prompt, { maxTokens: 2000 })

  const messages = content.split(/\n(?=\d\.|\nPROFESSIONAL|\nCASUAL|\nURGENT)/i).filter(m => m.trim())
  const tones = ['professional', 'casual', 'urgent']

  return messages.slice(0, 3).map((msg, i) => ({
    title: `WhatsApp Message - ${tones[i]}`,
    body: msg.replace(/^\d+\.\s*(PROFESSIONAL|CASUAL|URGENT):\s*/i, '').trim(),
    contentType: 'whatsapp_msg' as const,
    platform: 'whatsapp',
    language,
    tone: tones[i],
    tokensUsed: Math.floor(tokensUsed / 3),
  }))
}

export async function generateEmailCampaign(data: PropertyData, language: string = 'english'): Promise<ContentResult[]> {
  const prompt = `Generate 3 complete email templates in ${language} for this property:

EMAIL 1 - NEW LISTING ANNOUNCEMENT:
Subject Line: [subject]
Preheader: [short preview text]
Body: [full email body]

EMAIL 2 - OPEN HOUSE INVITATION:
Subject Line: [subject]
Preheader: [short preview text]
Body: [full email body]

EMAIL 3 - PRICE DROP ALERT:
Subject Line: [subject]
Preheader: [short preview text]
Body: [full email body]

Property Details:
Title: ${data.title}
Type: ${data.propertyType}
Location: ${data.location}${data.neighborhood ? ', ' + data.neighborhood : ''}
Price: ${data.price} ${data.currency || 'KES'}
Bedrooms: ${data.bedrooms}, Bathrooms: ${data.bathrooms}
Features: ${data.features.join(', ') || 'None specified'}`

  const { content, tokensUsed } = await callAI(REAL_ESTATE_SYSTEM_PROMPT, prompt, { maxTokens: 4000 })

  const emails = content.split(/EMAIL\s*\d/i).filter(e => e.trim())
  const emailTypes = ['New Listing Announcement', 'Open House Invitation', 'Price Drop Alert']

  return emails.slice(0, 3).map((email, i) => ({
    title: emailTypes[i],
    body: email.replace(/^[\s-]*:\s*/i, '').trim(),
    contentType: 'email_campaign' as const,
    platform: 'email',
    language,
    tokensUsed: Math.floor(tokensUsed / 3),
  }))
}

export async function generateAdCopy(data: PropertyData, platform: string, language: string = 'english'): Promise<ContentResult[]> {
  const platformInstructions: Record<string, string> = {
    facebook: 'Generate 3 Facebook Ad variations. Each: Headline (25 chars max) + Primary Text (125 chars max) + Description (30 chars max) + CTA button text',
    google: 'Generate 3 Google Ads variations. Each: Headline (30 chars max) + Description (90 chars max) + sitelink suggestions',
    instagram: 'Generate 3 Instagram Ad variations. Each: Caption + CTA + hashtag set (10-15 hashtags)',
  }

  const prompt = `${platformInstructions[platform] || platformInstructions.facebook}

Property Details:
Title: ${data.title}
Type: ${data.propertyType}
Location: ${data.location}${data.neighborhood ? ', ' + data.neighborhood : ''}
Price: ${data.price} ${data.currency || 'KES'}
Bedrooms: ${data.bedrooms}, Bathrooms: ${data.bathrooms}
Features: ${data.features.join(', ') || 'None specified'}

Generate in ${language}.`

  const { content, tokensUsed } = await callAI(REAL_ESTATE_SYSTEM_PROMPT, prompt, { maxTokens: 2000 })

  return [{
    title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Ad Copy`,
    body: content,
    contentType: 'ad_copy' as const,
    platform,
    language,
    tokensUsed,
  }]
}

export async function generateCustomContent(prompt: string, context?: string): Promise<{ content: string; tokensUsed: number }> {
  const systemPrompt = context ? `${REAL_ESTATE_SYSTEM_PROMPT}\n\nContext: ${context}` : REAL_ESTATE_SYSTEM_PROMPT
  return callAI(systemPrompt, prompt, { maxTokens: 3000 })
}
