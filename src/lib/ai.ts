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

const GLOBAL_RE_SYSTEM_PROMPT = `You are an elite real estate marketing copywriter. You operate globally — from New York to Dubai, London to Singapore, Tokyo to São Paulo. You understand diverse buyer psychology across cultures, neighborhood dynamics, investment potential, and local market nuances worldwide.

Rules:
- Adapt to the local market — use appropriate measurement systems (metric or imperial based on location)
- Reference relevant local landmarks, neighborhoods, and amenities
- Highlight investment potential (appreciation, rental yield, capital gains)
- Use the local currency when mentioned
- Be warm and inviting but professional
- Create emotional connection with the property
- Always include a clear call-to-action
- For non-English languages: use natural, native phrasing — never awkward translations
- Avoid region-specific clichés that don't apply globally
- Understand luxury markets (Monaco, Hong Kong, Manhattan) as well as emerging markets
- Adapt tone and formality to local cultural norms`

// Fallback AI using z-ai-web-dev-sdk (available in this environment)
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

async function callDeepSeek(systemPrompt: string, userPrompt: string, options?: { temperature?: number; maxTokens?: number; model?: string }): Promise<{ content: string; tokensUsed: number }> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    console.log('No DeepSeek API key, using fallback AI')
    return callFallbackAI(systemPrompt, userPrompt, options)
  }

  const body = {
    model: options?.model || 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 2000,
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error(`DeepSeek API error ${response.status}: ${errText}`)
      // If balance error or auth error, fall back to z-ai
      if (response.status === 402 || response.status === 401 || response.status === 429) {
        console.log('DeepSeek unavailable, falling back to alternate AI provider')
        return callFallbackAI(systemPrompt, userPrompt, options)
      }
      throw new Error(`DeepSeek API error ${response.status}: ${errText}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    const tokensUsed = data.usage?.total_tokens ?? 0
    return { content, tokensUsed }
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error'
    // If it's a balance/auth error that wasn't caught above, try fallback
    if (errMsg.includes('402') || errMsg.includes('401') || errMsg.includes('Insufficient Balance')) {
      console.log('DeepSeek failed with auth/balance error, falling back to alternate AI provider')
      return callFallbackAI(systemPrompt, userPrompt, options)
    }
    console.error('DeepSeek call failed:', errMsg)
    // Retry once
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        // On retry failure, fall back
        console.log('DeepSeek retry failed, falling back to alternate AI provider')
        return callFallbackAI(systemPrompt, userPrompt, options)
      }
      const data = await response.json()
      return { content: data.choices?.[0]?.message?.content || '', tokensUsed: data.usage?.total_tokens ?? 0 }
    } catch (retryError: unknown) {
      console.log('DeepSeek retry error, falling back to alternate AI provider')
      return callFallbackAI(systemPrompt, userPrompt, options)
    }
  }
}

export async function generatePropertyDescription(data: PropertyData, language: string = 'english'): Promise<ContentResult[]> {
  const tones = ['professional', 'lifestyle', 'short'] as const
  const results: ContentResult[] = []

  for (const tone of tones) {
    const toneInstructions: Record<string, string> = {
      professional: 'Write a formal, data-driven, investment-focused property description. Include market data references and ROI potential.',
      lifestyle: 'Write a warm, emotional property description focusing on the living experience, lifestyle benefits, and the feeling of home.',
      short: 'Write a punchy, social-media-ready property description under 100 words. Brief, compelling, and shareable.',
    }

    const { content, tokensUsed } = await callDeepSeek(
      GLOBAL_RE_SYSTEM_PROMPT,
      `Generate a ${tone} property description in ${language} for this property:\n\nTitle: ${data.title}\nType: ${data.propertyType}\nLocation: ${data.location}${data.neighborhood ? ', ' + data.neighborhood : ''}\nCity: ${data.city || 'Not specified'}\nCountry: ${data.country || 'Not specified'}\nPrice: ${data.price} ${data.currency || 'USD'}\nBedrooms: ${data.bedrooms}\nBathrooms: ${data.bathrooms}${data.areaSqm ? '\nArea: ' + data.areaSqm + ' sqm' : ''}\nFeatures: ${data.features.join(', ') || 'None specified'}\n\n${toneInstructions[tone]}`
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
  const prompt = `Generate 5 social media posts in ${language} for this property. Format each post with a clear label:

FACEBOOK POST 1: (longer, engaging, with questions)
FACEBOOK POST 2: (longer, engaging, with questions)
INSTAGRAM POST 1: (visual-first, hashtag-heavy)
INSTAGRAM POST 2: (visual-first, hashtag-heavy, story-prompt style)
TWITTER/X POST: (concise, 280 chars max, thread-style)

Property Details:
Title: ${data.title}
Type: ${data.propertyType}
Location: ${data.location}${data.neighborhood ? ', ' + data.neighborhood : ''}
Price: ${data.price} ${data.currency || 'USD'}
Bedrooms: ${data.bedrooms}, Bathrooms: ${data.bathrooms}
${data.areaSqm ? 'Area: ' + data.areaSqm + ' sqm' : ''}
Features: ${data.features.join(', ') || 'None specified'}

Include relevant hashtags for the property's market and location.`

  const { content, tokensUsed } = await callDeepSeek(GLOBAL_RE_SYSTEM_PROMPT, prompt, { maxTokens: 3000 })

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
Price: ${data.price} ${data.currency || 'USD'}
Bedrooms: ${data.bedrooms}, Bathrooms: ${data.bathrooms}
${data.areaSqm ? 'Area: ' + data.areaSqm + ' sqm' : ''}
Features: ${data.features.join(', ') || 'None specified'}

Keep each message short, punchy, optimized for WhatsApp reading.`

  const { content, tokensUsed } = await callDeepSeek(GLOBAL_RE_SYSTEM_PROMPT, prompt, { maxTokens: 2000 })

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
Price: ${data.price} ${data.currency || 'USD'}
Bedrooms: ${data.bedrooms}, Bathrooms: ${data.bathrooms}
Features: ${data.features.join(', ') || 'None specified'}`

  const { content, tokensUsed } = await callDeepSeek(GLOBAL_RE_SYSTEM_PROMPT, prompt, { maxTokens: 4000 })

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
Price: ${data.price} ${data.currency || 'USD'}
Bedrooms: ${data.bedrooms}, Bathrooms: ${data.bathrooms}
Features: ${data.features.join(', ') || 'None specified'}

Generate in ${language}.`

  const { content, tokensUsed } = await callDeepSeek(GLOBAL_RE_SYSTEM_PROMPT, prompt, { maxTokens: 2000 })

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
  const systemPrompt = context ? `${GLOBAL_RE_SYSTEM_PROMPT}\n\nContext: ${context}` : GLOBAL_RE_SYSTEM_PROMPT
  return callDeepSeek(systemPrompt, prompt, { maxTokens: 3000 })
}
