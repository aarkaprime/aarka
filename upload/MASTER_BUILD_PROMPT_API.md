# MASTER BUILD PROMPT — EstateIQ API Platform
## Copy this ENTIRE document and paste it into your AI coder (Cursor, DeepSeek, Kimi, Windsurf, Trae, etc.)

---

## PROJECT OVERVIEW

**Product Name:** EstateIQ API — AI-Powered Real Estate Marketing API Platform

**One-liner:** A developer platform that lets any developer build real estate marketing apps powered by AI — without building any AI themselves. You ARE the AI infrastructure.

**What you're building:** NOT a SaaS website. NOT a landing page. This is a PURE API platform with a developer portal. Think of it like Stripe or Twilio — developers come here, get an API key, and build apps that use your AI engine.

**Target Users:** Developers who want to build real estate apps (WhatsApp bots, mobile apps, agency dashboards, property websites) and need AI content generation + property management APIs.

**Revenue Model:**
- API subscription plans: $49/mo (Starter), $199/mo (Pro), $499/mo (Business), Custom (Enterprise)
- Pay-per-call billing for AI generations ($0.02-0.05 per call)
- Developer self-service — everything automated

**Tech Stack (NON-NEGOTIABLE — use exactly these):**
- Framework: Next.js 16 with App Router + TypeScript 5
- Styling: Tailwind CSS 4 + shadcn/ui (New York style) + Lucide icons
- Database: Prisma ORM with SQLite (file-based, zero setup)
- Auth: NextAuth.js v4 with credentials provider (email + password login)
- AI: DeepSeek API (https://api.deepseek.com/v1) — the AI engine behind all generation endpoints
- API Authentication: Custom API key middleware (not NextAuth — API keys are separate from user auth)
- Rate Limiting: In-memory sliding window rate limiter
- State: Zustand for client state
- Icons: lucide-react
- Animations: framer-motion (subtle transitions)
- Date: date-fns
- UUID generation: crypto.randomUUID() or uuid package

**CRITICAL RULES:**
- ALL code must be TypeScript — no JavaScript files
- Use shadcn/ui components for ALL UI — do NOT build custom UI from scratch
- Use 'use client' directive for all interactive components
- Use 'use server' directive for all server actions and API routes
- Database: Prisma with SQLite
- The project has only ONE route visible to users: `/` (src/app/page.tsx). Use client-side routing with Zustand to switch between views.
- This is a Single Page Application with these views:
  - Landing/Marketing page
  - Developer Portal (register, login)
  - Developer Dashboard (API key management, usage stats, webhooks, billing)
  - API Documentation (interactive docs with every endpoint)
  - API Playground (test endpoints live)
- Make it FULLY RESPONSIVE — mobile-first design
- Color scheme: Dark theme primary with emerald green accents (developer/platform vibes). Think Stripe's dark dashboard.
- NO indigo/blue colors.
- The API itself lives in /app/api/v1/ — these are REST endpoints that return JSON, NOT HTML pages

---

## STEP 1: DATABASE SCHEMA

Edit `prisma/schema.prisma` with these models:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// ─── DEVELOPER (human user who registers on the portal) ───

model Developer {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  company       String?
  password      String    // hashed with bcrypt
  role          String    @default("developer") // developer, admin
  plan          String    @default("free") // free, starter, pro, business, enterprise
  status        String    @default("active") // active, suspended
  monthlyCallsUsed  Int    @default(0)
  monthlyCallsLimit Int   @default(100) // free tier gets 100 calls
  totalCallsAllTime  Int   @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  apiKeys       ApiKey[]
  webhooks      Webhook[]
  usageLogs     UsageLog[]

  @@index([email])
}

// ─── API KEY (the key developers use to call the API) ───

model ApiKey {
  id            String    @id @default(cuid())
  developerId   String
  developer     Developer @relation(fields: [developerId], references: [id], onDelete: Cascade)
  keyPrefix     String    // first 8 chars for display: "ei_sk_8f3k2..."
  keyHash       String    // full hashed key (never store plaintext)
  name          String    // e.g. "Production Key", "Test Key", "Mobile App Key"
  environment   String    @default("test") // test, production
  status        String    @default("active") // active, suspended, revoked
  lastUsedAt    DateTime?
  monthlyCallsUsed  Int    @default(0)
  monthlyCallsLimit Int   @default(100)
  createdAt     DateTime  @default(now())
  expiresAt     DateTime? // null = no expiry

  usageLogs     UsageLog[]

  @@index([keyHash])
  @@index([developerId])
}

// ─── USAGE LOG (tracks every API call) ───

model UsageLog {
  id            String    @id @default(cuid())
  apiKeyId      String
  apiKey        ApiKey    @relation(fields: [apiKeyId], references: [id], onDelete: Cascade)
  developerId   String
  endpoint      String    // e.g. "POST /v1/ai/generate"
  method        String    // GET, POST, PUT, DELETE
  statusCode    Int       // 200, 401, 429, 500
  tokensUsed    Int       @default(0) // for AI calls
  responseTimeMs Int      @default(0)
  ipAddress     String?
  userAgent     String?
  createdAt     DateTime  @default(now())

  @@index([apiKeyId])
  @@index([developerId])
  @@index([createdAt])
}

// ─── WEBHOOK (developers register URLs to receive events) ───

model Webhook {
  id            String    @id @default(cuid())
  developerId   String
  developer     Developer @relation(fields: [developerId], references: [id], onDelete: Cascade)
  url           String    // the URL to send events to
  events        String    // comma-separated: "ai.completed,lead.created,call.quota_exceeded"
  secret        String    // used to sign webhook payloads so developers can verify
  status        String    @default("active") // active, paused
  lastTriggeredAt DateTime?
  successCount  Int       @default(0)
  failureCount  Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([developerId])
}

// ─── PLAN DEFINITION (stored in DB for flexibility) ───

model Plan {
  id              String  @id @default(cuid())
  slug            String  @unique // free, starter, pro, business, enterprise
  name            String
  priceMonthly    Float   // in USD
  callsPerMonth   Int     // monthly API call limit
  maxApiKeys      Int     // how many API keys they can create
  maxWebhooks     Int     // how many webhooks they can create
  features        String  // JSON string of feature list
  aiModelsAvailable String // comma-separated: "deepseek-chat,deepseek-reasoner"
  rateLimitPerMin Int     @default(60) // requests per minute
  supportLevel    String  @default("community") // community, email, priority, dedicated
  createdAt       DateTime @default(now())
}

// ─── PROPERTY DATA (the API manages properties for developers) ───

model Property {
  id            String    @id @default(cuid())
  developerId   String
  externalId    String?   // developer's own property ID
  title         String
  propertyType  String    @default("apartment") // apartment, house, land, commercial, townhouse, villa, studio, duplex
  location      String
  neighborhood  String?
  city          String    @default("Nairobi")
  country       String    @default("Kenya")
  price         Float     // in local currency
  currency      String    @default("KES")
  bedrooms      Int       @default(0)
  bathrooms     Int       @default(0)
  areaSqm       Float?
  features      String    // JSON array string: ["pool","gym","parking"]
  description   String?
  status        String    @default("active") // active, sold, rented, paused, archived
  metadata      String?   // JSON string for any extra data developer wants to store
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([developerId])
  @@index([status])
  @@index([propertyType])
}

// ─── LEAD DATA (developers track leads through the API) ───

model Lead {
  id            String    @id @default(cuid())
  developerId   String
  propertyId    String?   // optional — can be a general inquiry
  externalId    String?   // developer's own lead ID
  name          String
  email         String?
  phone         String?
  message       String?
  source        String    @default("api") // api, webhook, manual, whatsapp, website
  status        String    @default("new") // new, contacted, viewing, negotiation, closed, lost, archived
  metadata      String?   // JSON string for extra data
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([developerId])
  @@index([propertyId])
  @@index([status])
}

// ─── GENERATED CONTENT (AI output stored for reference/history) ───

model GeneratedContent {
  id            String    @id @default(cuid())
  developerId   String
  propertyId    String?
  externalId    String?   // developer's reference ID
  contentType   String    // property_description, social_post, whatsapp_msg, email_campaign, ad_copy, custom
  platform      String?   // facebook, instagram, twitter, whatsapp, email, sms, custom
  language      String    @default("english") // english, swahili, amharic, french, arabic, custom
  tone          String?   // professional, casual, luxury, urgent, friendly
  title         String
  body          String    // the actual generated content
  tokensUsed    Int       @default(0)
  aiModel       String    @default("deepseek-chat")
  createdAt     DateTime  @default(now())

  @@index([developerId])
  @@index([propertyId])
}
```

After creating the schema, run:
```bash
npx prisma db push
npx prisma generate
```

Then seed the database with plan definitions. Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.plan.upsert({
    where: { slug: 'free' },
    update: {},
    create: {
      slug: 'free',
      name: 'Free',
      priceMonthly: 0,
      callsPerMonth: 100,
      maxApiKeys: 1,
      maxWebhooks: 0,
      features: JSON.stringify(['100 API calls/month', '1 API key', 'Test environment only', 'Community support', 'Basic AI models']),
      aiModelsAvailable: 'deepseek-chat',
      rateLimitPerMin: 10,
      supportLevel: 'community',
    },
  })
  await prisma.plan.upsert({
    where: { slug: 'starter' },
    update: {},
    create: {
      slug: 'starter',
      name: 'Starter',
      priceMonthly: 49,
      callsPerMonth: 1000,
      maxApiKeys: 3,
      maxWebhooks: 2,
      features: JSON.stringify(['1,000 API calls/month', '3 API keys', 'Test + Production environments', '2 webhooks', 'All AI models', 'Email support']),
      aiModelsAvailable: 'deepseek-chat,deepseek-reasoner',
      rateLimitPerMin: 30,
      supportLevel: 'email',
    },
  })
  await prisma.plan.upsert({
    where: { slug: 'pro' },
    update: {},
    create: {
      slug: 'pro',
      name: 'Professional',
      priceMonthly: 199,
      callsPerMonth: 10000,
      maxApiKeys: 10,
      maxWebhooks: 10,
      features: JSON.stringify(['10,000 API calls/month', '10 API keys', 'All environments', '10 webhooks', 'All AI models', 'Priority support', 'Advanced analytics', 'Custom tone/language']),
      aiModelsAvailable: 'deepseek-chat,deepseek-reasoner',
      rateLimitPerMin: 60,
      supportLevel: 'priority',
    },
  })
  await prisma.plan.upsert({
    where: { slug: 'business' },
    update: {},
    create: {
      slug: 'business',
      name: 'Business',
      priceMonthly: 499,
      callsPerMonth: 50000,
      maxApiKeys: 50,
      maxWebhooks: 50,
      features: JSON.stringify(['50,000 API calls/month', '50 API keys', 'All environments', '50 webhooks', 'All AI models', 'Dedicated support', 'Advanced analytics', 'Custom models', 'SLA guarantee', 'White-label option']),
      aiModelsAvailable: 'deepseek-chat,deepseek-reasoner',
      rateLimitPerMin: 120,
      supportLevel: 'dedicated',
    },
  })
  await prisma.plan.upsert({
    where: { slug: 'enterprise' },
    update: {},
    create: {
      slug: 'enterprise',
      name: 'Enterprise',
      priceMonthly: 0, // custom pricing
      callsPerMonth: 999999,
      maxApiKeys: 999,
      maxWebhooks: 999,
      features: JSON.stringify(['Unlimited API calls', 'Unlimited API keys', 'All environments', 'Unlimited webhooks', 'All AI models', 'Dedicated engineer', 'Custom integrations', 'SLA guarantee', 'White-label', 'On-premise option', 'Custom AI training']),
      aiModelsAvailable: 'deepseek-chat,deepseek-reasoner',
      rateLimitPerMin: 300,
      supportLevel: 'dedicated',
    },
  })

  console.log('Database seeded with plans!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Add to package.json scripts: `"seed": "npx tsx prisma/seed.ts"`
Run: `npm run seed`

---

## STEP 2: AUTHENTICATION SYSTEM

### 2A. Developer Auth (for the portal/dashboard)

Create `src/lib/auth.ts` — NextAuth.js v4 with CredentialsProvider:
- Email + password login/register
- Password hashed with bcryptjs
- JWT session strategy
- JWT callback: include developer id, email, name, role, plan
- Session callback: expose developer info to client

Create `src/app/api/auth/[...nextauth]/route.ts` — standard NextAuth handler

Create `src/lib/auth-helpers.ts`:
```typescript
// hashPassword(password: string): Promise<string>
// comparePassword(password: string, hash: string): Promise<boolean>
// getSession(): Get current session (server-side)
// requireAuth(): Redirect to login if not authenticated
```

### 2B. API Key Authentication (for the /api/v1/ endpoints)

This is DIFFERENT from developer auth. API keys are how external developers call your API programmatically.

Create `src/lib/api-auth.ts`:
```typescript
// This middleware runs on EVERY /api/v1/ request

// generateApiKey(): string
//   - Generates a key like: ei_sk_8f3k2j9x4m7p1q5r...
//   - Returns the full key (only shown ONCE to the developer when created)
//   - Hash the key with SHA-256 before storing in DB
//   - Store: keyPrefix (first 12 chars), keyHash (full hash)

// validateApiKey(request: Request): { valid: boolean, apiKey?: ApiKey, developer?: Developer, error?: string }
//   - Extract API key from Authorization header: "Bearer ei_sk_..."
//   - Hash the extracted key with SHA-256
//   - Look up the hash in the ApiKey table
//   - Check: key exists, key status is "active", developer status is "active"
//   - Check: monthly calls not exceeded
//   - Update lastUsedAt timestamp
//   - Return { valid: true, apiKey, developer } or { valid: false, error: "reason" }

// rateLimitCheck(apiKeyId: string, limit: number): { allowed: boolean, remaining: number }
//   - In-memory sliding window rate limiter
//   - Track requests per apiKeyId in last 60 seconds
//   - If over limit: return { allowed: false, remaining: 0 }
//   - If under limit: return { allowed: true, remaining: limit - currentCount }

// logUsage(apiKeyId: string, developerId: string, data: UsageData): Promise<void>
//   - Log every API call to UsageLog table
//   - Increment monthlyCallsUsed on ApiKey and Developer
//   - Async — don't block the response
```

Create `src/middleware.ts` or create a helper function that wraps every /api/v1/ route:
```typescript
// withApiAuth(handler): wrapped handler that:
// 1. Calls validateApiKey()
// 2. If invalid: returns 401 JSON error
// 3. If rate limited: returns 429 JSON error with Retry-After header
// 4. If valid: calls the handler with { developer, apiKey } in the request context
// 5. Logs the usage after response
```

---

## STEP 3: AI ENGINE

Create `src/lib/ai.ts` — DeepSeek API integration:

```typescript
// Base URL: https://api.deepseek.com/v1
// Model: deepseek-chat (fast, cheap: $0.14/M input, $0.28/M output)
// Fallback model: deepseek-reasoner (better quality, slightly more expensive)
// API Key: process.env.DEEPSEEK_API_KEY

// CORE FUNCTION:
async function callDeepSeek(systemPrompt: string, userPrompt: string, options?: {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<{ content: string; tokensUsed: number; model: string }> {
  // 1. Make fetch request to https://api.deepseek.com/v1/chat/completions
  // 2. Parse response
  // 3. Return content + token usage
  // 4. Handle errors gracefully (retry once on failure, return meaningful error)
}

// CONTENT GENERATION FUNCTIONS:

// 1. generatePropertyDescription(data: PropertyData, language?: string): Promise<ContentResult>
//    System prompt for this function:
//    "You are an elite real estate marketing copywriter. You specialize in 
//     the East African property market — Kenya, Ethiopia, Tanzania, Uganda, 
//     Nigeria, South Africa, Ghana. You understand local buyer psychology, 
//     neighborhood dynamics, investment potential, and cultural nuances.
//     
//     Rules:
//     - Use metric system (square meters, not square feet)
//     - Reference local landmarks, neighborhoods, and amenities
//     - Highlight investment potential (appreciation, rental yield, capital gains)
//     - Use the local currency when mentioned
//     - Be warm and inviting but professional
//     - Create emotional connection with the property
//     - Always include a clear call-to-action
//     - For Swahili: use natural Swahili, not translated English
//     - For Amharic: use natural Amharic, not translated English
//     - Never use American/British real estate clichés that don't apply in Africa"
//
//    Generate 3 variations based on tone:
//    - Professional: Formal, data-driven, investment-focused
//    - Lifestyle: Warm, emotional, focuses on living experience
//    - Short: Punchy, social media ready (under 100 words)
//
//    Return array of 3 results

// 2. generateSocialMediaPosts(data: PropertyData, language?: string): Promise<ContentResult[]>
//    Generate 5 posts:
//    - 2 Facebook (longer, engaging, with questions, emojis)
//    - 2 Instagram (visual-first, hashtag-heavy, story-prompt style)
//    - 1 Twitter/X (concise, 280 chars max, thread-style)
//    Each post includes relevant hashtags for the local market

// 3. generateWhatsAppMessages(data: PropertyData, language?: string): Promise<ContentResult[]>
//    Generate 3 messages:
//    - Professional: Formal property listing for serious buyers
//    - Casual: Friendly, conversational, like a friend recommending
//    - Urgent: Price drop, limited availability, FOMO-driven
//    Short, punchy, optimized for WhatsApp reading (people scan quickly)

// 4. generateEmailCampaign(data: PropertyData, language?: string): Promise<ContentResult[]>
//    Generate 3 complete emails:
//    - New Listing Announcement: "New property just listed in [area]"
//    - Open House Invitation: "You're invited to view this property"
//    - Price Drop Alert: "Price reduced on [property]"
//    Each email = subject line + preheader + HTML body (as markdown)

// 5. generateAdCopy(data: PropertyData, platform: string, language?: string): Promise<ContentResult[]>
//    Generate 3 ad variations per platform:
//    - Facebook Ads: headline (25 chars) + primary text (125 chars) + description (30 chars) + CTA
//    - Google Ads: headline (30 chars) + description (90 chars) + sitelinks
//    - Instagram Ads: caption + CTA + hashtag set

// INTERFACES:

interface PropertyData {
  title: string;
  propertyType: string;
  location: string;
  neighborhood?: string;
  city?: string;
  country?: string;
  price: number;
  currency?: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm?: number;
  features: string[];
  description?: string;
}

interface ContentResult {
  title: string;
  body: string;
  contentType: string;
  platform?: string;
  language: string;
  tone?: string;
  tokensUsed: number;
}

// 6. generateCustomContent(prompt: string, context?: string): Promise<{ content: string; tokensUsed: number }>
//    Free-form generation — developer sends any prompt + optional property context
//    Useful for: custom templates, niche content types, translations, etc.
```

---

## STEP 4: WEBHOOK SYSTEM

Create `src/lib/webhooks.ts`:
```typescript
// triggerWebhook(developerId: string, event: string, payload: object): Promise<void>
//   - Find all active webhooks for this developer that include this event type
//   - For each webhook:
//     1. Sign the payload with HMAC-SHA256 using the webhook's secret
//     2. POST the payload to the webhook URL with headers:
//        - Content-Type: application/json
//        - X-EstateIQ-Event: the event name
//        - X-EstateIQ-Signature: the HMAC signature
//        - X-EstateIQ-Delivery: a unique delivery ID (UUID)
//     3. If successful (2xx): increment successCount
//     4. If failed: increment failureCount
//     5. Update lastTriggeredAt
//   - Run asynchronously (don't block the main API response)

// Available events:
// "ai.completed"        — AI content generation finished
// "ai.failed"           — AI content generation failed
// "property.created"    — New property added via API
// "property.updated"    — Property updated via API
// "property.deleted"    — Property deleted via API
// "lead.created"        — New lead captured
// "lead.status_changed" — Lead status updated
// "call.quota_warning"  — API call usage at 80% of limit
// "call.quota_exceeded" — API call usage exceeded limit
// "webhook.failed"      — A webhook delivery failed 3 times
```

---

## STEP 5: API ENDPOINTS — THE CORE PRODUCT

Create ALL of these endpoints under `src/app/api/v1/`. Each endpoint:
- Returns JSON only (never HTML)
- Checks API key authentication via `withApiAuth()` wrapper
- Checks rate limiting
- Validates input with Zod schemas
- Returns proper HTTP status codes (200, 201, 400, 401, 403, 404, 429, 500)
- Returns consistent error format: `{ "error": { "code": "ERROR_CODE", "message": "Human readable message", "details": {} } }`
- Returns consistent success format: `{ "data": {}, "meta": { "request_id": "uuid", "tokens_used": 0, "credits_remaining": 950 } }`
- Logs every call to UsageLog
- Triggers webhooks when appropriate
- Tracks response time

### 5A. AI Generation Endpoints

```
POST /api/v1/ai/generate
Description: Generate AI marketing content for a property

Request Body:
{
  "content_type": "property_description" | "social_post" | "whatsapp_msg" | "email_campaign" | "ad_copy" | "custom",
  "property": {
    "title": string (required),
    "property_type": string (required),
    "location": string (required),
    "neighborhood": string (optional),
    "city": string (optional, default: "Nairobi"),
    "country": string (optional, default: "Kenya"),
    "price": number (required),
    "currency": string (optional, default: "KES"),
    "bedrooms": number (optional, default: 0),
    "bathrooms": number (optional, default: 0),
    "area_sqm": number (optional),
    "features": string[] (optional),
    "description": string (optional)
  },
  "options": {
    "language": "english" | "swahili" | "amharic" | "french" | "arabic" (optional, default: "english"),
    "tone": "professional" | "casual" | "luxury" | "urgent" | "friendly" (optional),
    "platform": "facebook" | "instagram" | "twitter" | "whatsapp" | "email" | "google" (optional, for ad_copy),
    "custom_prompt": string (optional, only for content_type "custom"),
    "count": number (optional, default: 3, max: 10),
    "save": boolean (optional, default: true — save result to GeneratedContent table),
    "webhook_url": string (optional — one-time webhook URL for this specific request)
  }
}

Response (200):
{
  "data": {
    "results": [
      {
        "id": "gc_abc123",
        "title": "Professional Property Description",
        "body": "Nestled in the prestigious Kilimani neighborhood...",
        "content_type": "property_description",
        "language": "english",
        "tone": "professional",
        "tokens_used": 847
      },
      // ... more results based on count
    ],
    "total_results": 3,
    "total_tokens_used": 2541
  },
  "meta": {
    "request_id": "req_xyz789",
    "credits_remaining": 97459,
    "processing_time_ms": 1234
  }
}
```

```
POST /api/v1/ai/generate/batch
Description: Generate content for MULTIPLE properties in one request

Request Body:
{
  "items": [
    {
      "content_type": "social_post",
      "property": { ... },
      "options": { ... }
    },
    {
      "content_type": "property_description",
      "property": { ... },
      "options": { ... }
    }
  ]
}

Response: Array of generation results for each item
```

### 5B. Property Management Endpoints

```
POST   /api/v1/properties          → Create property
GET    /api/v1/properties          → List properties (paginated, filterable, sortable)
GET    /api/v1/properties/search   → Full-text search across properties
GET    /api/v1/properties/:id      → Get single property
PUT    /api/v1/properties/:id      → Update property
DELETE /api/v1/properties/:id      → Delete property

GET /api/v1/properties query params:
  - page (default: 1)
  - per_page (default: 20, max: 100)
  - status (filter: active, sold, rented, paused)
  - type (filter: apartment, house, land, commercial, etc.)
  - city (filter: Nairobi, Mombasa, etc.)
  - min_price, max_price
  - min_bedrooms, max_bedrooms
  - sort (created_at, price, -price, -created_at)
  - search (text search across title, location, description)

GET /api/v1/properties/:id response includes:
  - Full property details
  - All generated content for this property
  - All leads for this property
  - Quick stats (total leads, total content generated)
```

### 5C. Lead Management Endpoints

```
POST   /api/v1/leads               → Create lead
GET    /api/v1/leads               → List leads (paginated, filterable)
GET    /api/v1/leads/:id           → Get single lead
PUT    /api/v1/leads/:id           → Update lead
DELETE /api/v1/leads/:id           → Delete lead
POST   /api/v1/leads/batch         → Create multiple leads at once
GET    /api/v1/leads/stats         → Lead statistics (counts by status, source, etc.)
```

### 5D. Content Management Endpoints

```
GET    /api/v1/content              → List generated content (paginated, filterable)
GET    /api/v1/content/:id          → Get single content item
DELETE /api/v1/content/:id          → Delete content
```

### 5E. Analytics Endpoints

```
GET /api/v1/analytics/overview
→ Total properties, total leads, total content, total API calls this month
→ Conversion rate (leads that became "closed")
→ Average response time

GET /api/v1/analytics/usage
→ Daily API call counts for last 30 days (chart data)
→ Total tokens used
→ Most popular endpoints
→ Average response time per endpoint

GET /api/v1/analytics/content-performance
→ Content generated by type
→ Average tokens per content type
→ Most popular languages
→ Most popular tones

GET /api/v1/analytics/leads-funnel
→ Leads by status (new, contacted, viewing, negotiation, closed, lost)
→ Leads by source
→ Leads by property type
→ Conversion rates
```

### 5F. Webhook Management Endpoints

```
POST   /api/v1/webhooks            → Create webhook
GET    /api/v1/webhooks            → List webhooks
PUT    /api/v1/webhooks/:id        → Update webhook
DELETE /api/v1/webhooks/:id        → Delete webhook
POST   /api/v1/webhooks/:id/test   → Send a test event to this webhook
GET    /api/v1/webhooks/:id/deliveries → Get delivery log for this webhook
```

### 5G. Developer Account Endpoints

```
GET /api/v1/account                → Get current developer account info
PUT /api/v1/account                → Update account (name, company, email)
GET /api/v1/account/usage          → Get detailed usage this month
GET /api/v1/account/keys           → List all API keys (masked — show only prefix)
POST /api/v1/account/keys          → Create new API key
DELETE /api/v1/account/keys/:id    → Revoke API key
GET /api/v1/account/billing        → Get billing info (current plan, next billing date)
POST /api/v1/account/billing/upgrade → Upgrade to a paid plan (integrate Paystack later)
```

### 5H. Utility Endpoints

```
GET /api/v1/health                 → API health check (returns status, uptime, version)
GET /api/v1/supported-languages    → List all supported languages for content generation
GET /api/v1/supported-currencies   → List all supported currencies
GET /api/v1/supported-countries    → List all supported countries with property market data
POST /api/v1/validate/api-key      → Validate an API key (useful for debugging)
```

---

## STEP 6: API DOCUMENTATION

Create a beautiful, interactive documentation page. This is CRITICAL — developers decide to use your API based on the docs.

Build `src/components/docs/` with these sections:

### 6A. Documentation Layout (`docs-layout.tsx`)
- Left sidebar with navigation
- Main content area with documentation
- Code examples with syntax highlighting (use react-syntax-highlighter, already in package.json)
- "Try it" button on every endpoint (opens API playground)
- Dark theme documentation (like Stripe docs or ReadMe.com)

### 6B. Documentation Pages (all client components rendered in the SPA):

```
1. docs-getting-started.tsx
   - "Get Your API Key in 60 Seconds"
   - Step 1: Create account
   - Step 2: Get API key from dashboard
   - Step 3: Make your first API call (show curl example)
   - Quick-start code examples: JavaScript, Python, PHP, cURL

2. docs-authentication.tsx
   - How to authenticate: Bearer token in Authorization header
   - Example requests (correct vs incorrect)
   - Error codes: 401 (invalid key), 403 (suspended), 429 (rate limited)
   - Best practices: never expose API key in frontend, use environment variables

3. docs-ai-generation.tsx
   - Full documentation for POST /v1/ai/generate
   - All parameters explained with examples
   - Content types: property_description, social_post, whatsapp_msg, email_campaign, ad_copy, custom
   - Language options
   - Tone options
   - Complete request/response examples for each content type
   - Tips for best results

4. docs-properties.tsx
   - Full documentation for all /v1/properties endpoints
   - CRUD operations
   - Search and filtering
   - Webhook events for property changes

5. docs-leads.tsx
   - Full documentation for all /v1/leads endpoints
   - Lead lifecycle (new → contacted → viewing → negotiation → closed)
   - Batch creation
   - Lead statistics

6. docs-analytics.tsx
   - Full documentation for /v1/analytics endpoints
   - What data is available
   - How to build dashboards with the analytics API

7. docs-webhooks.tsx
   - What webhooks are and when to use them
   - How to set up webhooks
   - Available events
   - Payload format for each event
   - How to verify webhook signatures (HMAC-SHA256)
   - Retry logic (we retry 3 times with exponential backoff)
   - Best practices

8. docs-ratelimits.tsx
   - Rate limits per plan
   - Headers included in every response: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
   - What to do when rate limited (429 status)
   - Best practices for handling rate limits

9. docs-errors.tsx
   - All error codes explained
   - Error response format
   - Common errors and solutions

10. docs-sdks.tsx
    - Code examples in multiple languages
    - Quick-start guides
    - "Coming soon: Official SDKs" placeholder

11. docs-changelog.tsx
    - API version history
    - Breaking changes
    - New features
```

### 6C. Code Examples (include these in the docs)

**JavaScript/Node.js:**
```javascript
const response = await fetch('https://api.estateiq.com/v1/ai/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ei_sk_YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content_type: 'property_description',
    property: {
      title: 'Luxury 3BR in Kilimani',
      property_type: 'apartment',
      location: 'Nairobi, Kilimani',
      price: 8500000,
      bedrooms: 3,
      bathrooms: 2,
      area_sqm: 180,
      features: ['pool', 'gym', 'parking', 'balcony']
    },
    options: {
      language: 'english',
      tone: 'professional',
      count: 3
    }
  })
});

const result = await response.json();
console.log(result.data.results[0].body);
```

**Python:**
```python
import requests

response = requests.post(
    'https://api.estateiq.com/v1/ai/generate',
    headers={
        'Authorization': 'Bearer ei_sk_YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'content_type': 'social_post',
        'property': {
            'title': 'Modern Villa in Karen',
            'property_type': 'house',
            'location': 'Nairobi, Karen',
            'price': 25000000,
            'bedrooms': 5,
            'bathrooms': 4,
            'features': ['garden', 'swimming pool', 'dsq']
        },
        'options': {
            'language': 'english',
            'count': 5
        }
    }
)

data = response.json()
for post in data['data']['results']:
    print(post['body'])
```

**cURL:**
```bash
curl -X POST https://api.estateiq.com/v1/ai/generate \
  -H "Authorization: Bearer ei_sk_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content_type": "whatsapp_msg",
    "property": {
      "title": "Studio Apartment in Westlands",
      "property_type": "studio",
      "location": "Nairobi, Westlands",
      "price": 35000,
      "currency": "KES",
      "area_sqm": 35
    },
    "options": {
      "language": "swahili",
      "count": 3
    }
  }'
```

**PHP:**
```php
$ch = curl_init('https://api.estateiq.com/v1/ai/generate');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ei_sk_YOUR_API_KEY',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'content_type' => 'ad_copy',
    'property' => [
        'title' => '2BR Apartment in Lavington',
        'property_type' => 'apartment',
        'location' => 'Nairobi, Lavington',
        'price' => 120000,
        'currency' => 'KES',
        'bedrooms' => 2,
        'bathrooms' => 1,
    ],
    'options' => [
        'platform' => 'facebook',
        'count' => 3
    ]
]));

$response = curl_exec($ch);
$data = json_decode($response, true);
print_r($data['data']['results']);
```

---

## STEP 7: DEVELOPER PORTAL UI

Build the developer-facing web application. This is a SPA with client-side routing via Zustand.

### 7A. Views/Routes (Zustand state-based routing):

```
Landing Views (public — no auth required):
├── landing           → Main marketing page (hero, features, pricing, docs link)
├── pricing           → API pricing plans comparison
├── docs              → Documentation hub (links to all doc sections)
├── docs/:section     → Individual doc pages (getting-started, authentication, ai-generation, etc.)
├── login             → Developer login form
└── register          → Developer registration form

Portal Views (authenticated — requires login):
├── dashboard         → Overview: usage stats, recent API calls, quick stats
├── api-keys          → Create, view, revoke API keys (show prefix + full key ONCE on creation)
├── usage             → Detailed usage analytics: charts, daily breakdown, by endpoint
├── properties        → Manage properties stored via the API
├── leads             → View leads captured through the API
├── content           → View AI-generated content history
├── webhooks          → Manage webhook URLs and events
├── playground        → Interactive API tester (like Postman but in the browser)
├── settings          → Account settings (name, email, company, password)
├── billing           → Current plan, usage vs limit, upgrade button
└── docs              → Same docs as public but with "logged in" state
```

### 7B. Components to Build:

**Layout:**
- `src/components/layout/portal-layout.tsx` — Sidebar navigation + top bar + content area
  - Sidebar items: Dashboard, API Keys, Properties, Leads, Content, Webhooks, Playground, Usage, Settings
  - Top bar: EstateIQ logo, developer name, plan badge, logout
  - Mobile: sidebar collapses to hamburger menu
  - Dark theme (dark background, emerald accents)

**Landing Page Components:**
- `src/components/landing/hero.tsx` — 
  Headline: "The AI Engine Behind Africa's Next Real Estate Apps"
  Subheadline: "Generate property descriptions, social media content, WhatsApp messages, and more — through one powerful API. Build your real estate app in hours, not months."
  CTAs: "Get Your Free API Key" + "Read the Docs"
  Code snippet preview showing a simple API call (with syntax highlighting)
  Dark gradient background, emerald accent glow

- `src/components/landing/features-grid.tsx` —
  Feature cards (6-8 cards):
  1. "AI Content Generation" — "Property descriptions, social posts, WhatsApp messages, email campaigns, ad copy — all generated in seconds"
  2. "5 African Languages" — "English, Swahili, Amharic, French, Arabic — content that speaks to your market"
  3. "Property Management API" — "Full CRUD for properties with search, filtering, and pagination"
  4. "Lead Tracking" — "Capture and manage leads from any source through a unified API"
  5. "Real-Time Webhooks" — "Get notified instantly when events happen — lead captured, content generated, quota warnings"
  6. "Developer-First" — "RESTful API, comprehensive docs, code examples in 4 languages, interactive playground"
  7. "99.9% Uptime" — "Built on reliable infrastructure with automatic failover"
  8. "Africa-Native" — "Designed for African markets — KES, NGN, ETB currencies, local neighborhoods, mobile-first users"

- `src/components/landing/pricing-cards.tsx` —
  4 plan cards: Free ($0), Starter ($49), Professional ($199), Business ($499)
  Feature comparison table
  "Enterprise? Contact Us" CTA
  Highlight Professional as "Most Popular"

- `src/components/landing/code-examples.tsx` —
  Tabbed code examples: JavaScript, Python, PHP, cURL
  Shows a complete API call with syntax highlighting
  Copy-to-clipboard button on each example

- `src/components/landing/use-cases.tsx` —
  Cards showing what developers can build:
  1. "WhatsApp Property Bot" — "Automate property inquiries on WhatsApp"
  2. "Property Listing Website" — "Power your listings with AI descriptions"
  3. "Agency Dashboard" — "Manage multiple clients through one API"
  4. "Mobile Property App" — "AI-powered search and recommendations"
  5. "Market Analysis Tool" — "Aggregate and analyze property data"
  6. "SMS Marketing" — "Send AI-generated property alerts via SMS"

- `src/components/landing/stats.tsx` —
  Animated counters:
  "10M+ properties described" / "50K+ API calls daily" / "200+ developers" / "99.9% uptime"
  (These are placeholder numbers for the landing page)

- `src/components/landing/footer.tsx` —
  Logo, navigation links, GitHub link (placeholder), Twitter link (placeholder), copyright

**Auth Components:**
- `src/components/auth/login-form.tsx` — Email + password + "Sign In"
- `src/components/auth/register-form.tsx` — Name, Email, Company (optional), Password + "Create Account"

**Dashboard Components:**
- `src/components/dashboard/overview-stats.tsx` — 
  4 stat cards: API Calls This Month, Credits Remaining, Properties Stored, Total Leads
  Show progress bar for credit usage (e.g., "847 / 1,000 calls used")
  Use shadcn Card components

- `src/components/dashboard/recent-calls.tsx` — 
  Table of last 20 API calls
  Columns: Endpoint, Method badge, Status badge (green 200, red 4xx, orange 429), Response Time, Time Ago
  Real-time feel (refresh periodically)

- `src/components/dashboard/quick-chart.tsx` —
  Line chart showing API calls per day for last 14 days
  Use recharts (already in package.json) — AreaChart component
  Emerald green gradient fill

**API Key Components:**
- `src/components/api-keys/key-list.tsx` —
  List of all API keys
  Each row: Name, Environment badge (test/prod), Key prefix (ei_sk_8f3k...), Status, Last Used, Actions (revoke)
  "Create New Key" button

- `src/components/api-keys/create-key-dialog.tsx` —
  Dialog/modal: Enter key name + select environment
  On create: Show the FULL API key ONCE with a warning:
  "IMPORTANT: Copy this key NOW. You will NEVER be able to see it again."
  Copy-to-clipboard button
  "I have saved this key" confirmation checkbox to dismiss

**Playground Component (THIS IS THE KILLER FEATURE):**
- `src/components/playground/api-playground.tsx` —
  Interactive API tester — like a mini Postman in the browser
  Left panel:
    - Select endpoint from dropdown (all /v1/ endpoints)
    - Auto-fill the request body template based on selected endpoint
    - Editable JSON body with syntax highlighting
    - "Send Request" button
  Right panel:
    - Response status code (color-coded badge)
    - Response time
    - Response body (formatted JSON with syntax highlighting)
    - Response headers
  Bottom:
    - cURL equivalent of the request (auto-generated)
    - Copy cURL button
  Pre-fill the Authorization header with the developer's current API key

**Webhook Components:**
- `src/components/webhooks/webhook-list.tsx` —
  List of all webhooks
  Each row: URL (truncated), Events badge, Status, Success/Failure counts, Last Triggered, Actions

- `src/components/webhooks/create-webhook-dialog.tsx` —
  Dialog: Enter URL, select events (checkboxes), auto-generate secret
  Show the secret once (like API key)

**Usage/Analytics Components:**
- `src/components/usage/usage-overview.tsx` —
  Big number: Total calls this month
  Progress bar: X / Y calls used
  Plan name and limit

- `src/components/usage/usage-chart.tsx` —
  Line chart: Daily API calls for last 30 days
  AreaChart from recharts, emerald gradient

- `src/components/usage/usage-by-endpoint.tsx` —
  Bar chart or table: Breakdown by endpoint (which endpoints are most used)

- `src/components/usage/usage-by-model.tsx` —
  Pie chart or table: Breakdown by AI model used (deepseek-chat vs deepseek-reasoner)

---

## STEP 8: MAIN PAGE (src/app/page.tsx)

Build the client-side SPA router:

```typescript
'use client'

// Use Zustand store for routing
// States: view (string), selectedDoc (string), isAuthenticated (boolean)

// Logic:
// 1. Check NextAuth session on mount
// 2. If NOT authenticated:
//    - landing → render LandingPage
//    - pricing → render PricingPage
//    - docs → render DocsHub
//    - docs/:section → render specific DocPage
//    - login → render LoginPage
//    - register → render RegisterPage
//    - Any portal view → redirect to login
//
// 3. If authenticated:
//    - landing, pricing, docs, login, register → redirect to dashboard
//    - dashboard → render DashboardPage (inside PortalLayout)
//    - api-keys → render ApiKeysPage
//    - playground → render PlaygroundPage
//    - usage → render UsagePage
//    - properties → render PropertiesPage
//    - leads → render LeadsPage
//    - content → render ContentPage
//    - webhooks → render WebhooksPage
//    - settings → render SettingsPage
//    - billing → render BillingPage
//    - docs → render DocsPage (inside PortalLayout)
//
// Use Framer Motion AnimatePresence for smooth page transitions
// Scroll to top on view change
```

---

## STEP 9: MIDDLEWARE & HEADERS

Every API response under /api/v1/ MUST include these headers:

```
X-Request-ID: [unique UUID for this request]
X-RateLimit-Limit: [max requests per minute for this plan]
X-RateLimit-Remaining: [requests remaining in current window]
X-RateLimit-Reset: [Unix timestamp when the rate limit window resets]
X-Response-Time: [response time in milliseconds]
```

Create `src/lib/api-response.ts`:
```typescript
// Helper function for consistent API responses:

function apiSuccess(data: any, meta?: { tokensUsed?: number, creditsRemaining?: number, processingTimeMs?: number }) {
  return Response.json({
    data,
    meta: {
      request_id: crypto.randomUUID(),
      tokens_used: meta?.tokensUsed ?? 0,
      credits_remaining: meta?.creditsRemaining ?? 0,
      processing_time_ms: meta?.processingTimeMs ?? 0,
    }
  }, { status: 200 })
}

function apiCreated(data: any) {
  return Response.json({ data }, { status: 201 })
}

function apiError(code: string, message: string, status: number, details?: any) {
  return Response.json({
    error: {
      code,
      message,
      details: details ?? {}
    }
  }, { status })
}

function apiPaginated(data: any[], page: number, perPage: number, total: number) {
  return Response.json({
    data,
    pagination: {
      page,
      per_page: perPage,
      total,
      total_pages: Math.ceil(total / perPage),
      has_next: page * perPage < total,
      has_prev: page > 1,
    }
  })
}
```

---

## STEP 10: ERROR CODES

Define all error codes as constants in `src/lib/api-errors.ts`:

```typescript
export const API_ERRORS = {
  // Auth errors (401)
  MISSING_API_KEY: { code: 'MISSING_API_KEY', message: 'API key is required. Include it in the Authorization header as "Bearer ei_sk_..."', status: 401 },
  INVALID_API_KEY: { code: 'INVALID_API_KEY', message: 'The API key provided is invalid.', status: 401 },
  API_KEY_REVOKED: { code: 'API_KEY_REVOKED', message: 'This API key has been revoked.', status: 401 },
  ACCOUNT_SUSPENDED: { code: 'ACCOUNT_SUSPENDED', message: 'Your account has been suspended. Contact support.', status: 403 },

  // Rate limit errors (429)
  RATE_LIMIT_EXCEEDED: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Slow down and retry.', status: 429 },
  MONTHLY_QUOTA_EXCEEDED: { code: 'MONTHLY_QUOTA_EXCEEDED', message: 'Monthly API call quota exceeded. Upgrade your plan or wait for reset.', status: 429 },

  // Validation errors (400)
  INVALID_REQUEST_BODY: { code: 'INVALID_REQUEST_BODY', message: 'The request body is invalid or malformed.', status: 400 },
  MISSING_REQUIRED_FIELD: { code: 'MISSING_REQUIRED_FIELD', message: 'Required field is missing.', status: 400 },
  INVALID_CONTENT_TYPE: { code: 'INVALID_CONTENT_TYPE', message: 'Invalid content_type. Must be one of: property_description, social_post, whatsapp_msg, email_campaign, ad_copy, custom', status: 400 },
  INVALID_PROPERTY_TYPE: { code: 'INVALID_PROPERTY_TYPE', message: 'Invalid property_type.', status: 400 },
  GENERATION_LIMIT_EXCEEDED: { code: 'GENERATION_LIMIT_EXCEEDED', message: 'Count exceeds maximum of 10 per request.', status: 400 },

  // AI errors (500/502/503)
  AI_SERVICE_UNAVAILABLE: { code: 'AI_SERVICE_UNAVAILABLE', message: 'The AI service is temporarily unavailable. Please retry.', status: 503 },
  AI_GENERATION_FAILED: { code: 'AI_GENERATION_FAILED', message: 'AI content generation failed. Please try again.', status: 500 },
  AI_MODEL_NOT_AVAILABLE: { code: 'AI_MODEL_NOT_AVAILABLE', message: 'The requested AI model is not available on your plan.', status: 403 },

  // Resource errors (404)
  PROPERTY_NOT_FOUND: { code: 'PROPERTY_NOT_FOUND', message: 'Property not found.', status: 404 },
  LEAD_NOT_FOUND: { code: 'LEAD_NOT_FOUND', message: 'Lead not found.', status: 404 },
  CONTENT_NOT_FOUND: { code: 'CONTENT_NOT_FOUND', message: 'Content not found.', status: 404 },
  WEBHOOK_NOT_FOUND: { code: 'WEBHOOK_NOT_FOUND', message: 'Webhook not found.', status: 404 },

  // Webhook errors
  WEBHOOK_DELIVERY_FAILED: { code: 'WEBHOOK_DELIVERY_FAILED', message: 'Failed to deliver webhook. The endpoint returned an error.', status: 200 }, // Don't fail the main request
  INVALID_WEBHOOK_URL: { code: 'INVALID_WEBHOOK_URL', message: 'The webhook URL is invalid.', status: 400 },
  WEBHOOK_LIMIT_EXCEEDED: { code: 'WEBHOOK_LIMIT_EXCEEDED', message: 'You have reached the maximum number of webhooks for your plan.', status: 400 },
}
```

---

## STEP 11: INPUT VALIDATION (Zod Schemas)

Create `src/lib/schemas.ts` with Zod validation schemas for every endpoint:

```typescript
import { z } from 'zod'

export const PropertySchema = z.object({
  title: z.string().min(1).max(200),
  property_type: z.enum(['apartment', 'house', 'land', 'commercial', 'townhouse', 'villa', 'studio', 'duplex']),
  location: z.string().min(1).max(300),
  neighborhood: z.string().max(200).optional(),
  city: z.string().max(100).default('Nairobi'),
  country: z.string().max(100).default('Kenya'),
  price: z.number().positive(),
  currency: z.string().max(10).default('KES'),
  bedrooms: z.number().int().min(0).default(0),
  bathrooms: z.number().int().min(0).default(0),
  area_sqm: z.number().positive().optional(),
  features: z.array(z.string()).max(30).optional(),
  description: z.string().max(5000).optional(),
})

export const AIGenerateSchema = z.object({
  content_type: z.enum(['property_description', 'social_post', 'whatsapp_msg', 'email_campaign', 'ad_copy', 'custom']),
  property: PropertySchema,
  options: z.object({
    language: z.enum(['english', 'swahili', 'amharic', 'french', 'arabic']).default('english'),
    tone: z.enum(['professional', 'casual', 'luxury', 'urgent', 'friendly']).optional(),
    platform: z.enum(['facebook', 'instagram', 'twitter', 'whatsapp', 'email', 'google']).optional(),
    custom_prompt: z.string().max(2000).optional(),
    count: z.number().int().min(1).max(10).default(3),
    save: z.boolean().default(true),
    webhook_url: z.string().url().optional(),
  }).default({}),
})

export const LeadSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  message: z.string().max(5000).optional(),
  property_id: z.string().optional(),
  source: z.enum(['api', 'webhook', 'manual', 'whatsapp', 'website', 'sms', 'other']).default('api'),
})

export const WebhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1).max(20),
})

// ... schemas for update operations (partial versions of the above)
```

---

## STEP 12: ENVIRONMENT VARIABLES

Create `.env.local`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="[GENERATE WITH: openssl rand -base64 32]"
NEXTAUTH_URL="http://localhost:3000"
DEEPSEEK_API_KEY="[ASK USER FOR THIS — from https://platform.deepseek.com/api_keys]"
```

---

## STEP 13: BUILD ORDER (FOLLOW THIS EXACTLY)

```
1. Edit prisma/schema.prisma → run npx prisma db push → run npx prisma generate
2. Create prisma/seed.ts → add seed script to package.json → run npm run seed
3. Install packages: npm install bcryptjs next-auth @types/bcryptjs
4. Create src/lib/api-errors.ts (error code constants)
5. Create src/lib/schemas.ts (Zod validation schemas)
6. Create src/lib/api-response.ts (response helper functions)
7. Create src/lib/auth.ts + src/app/api/auth/[...nextauth]/route.ts (NextAuth)
8. Create src/lib/auth-helpers.ts (password hashing, session helpers)
9. Create src/lib/api-auth.ts (API key generation, validation, rate limiting)
10. Create src/lib/ai.ts (DeepSeek API integration — ALL generation functions)
11. Create src/lib/webhooks.ts (webhook triggering system)
12. Create src/lib/db-helpers.ts (CRUD helpers for all models)
13. Create src/store/app-store.ts (Zustand store for SPA routing)
14. Create ALL API endpoints under src/app/api/v1/ (follow the endpoint list in Step 5)
15. Create ALL UI components (layout, landing, auth, dashboard, api-keys, playground, usage, webhooks, docs)
16. Build src/app/page.tsx (SPA router)
17. Update src/app/layout.tsx (metadata: "EstateIQ API — AI Real Estate Marketing Platform")
18. Update src/app/globals.css (dark emerald theme for portal, clean white for landing/docs)
19. Run npm run lint → fix all errors
20. Test end-to-end: register → get API key → make API call → see usage in dashboard
```

---

## FINAL NOTES

- This is an API PLATFORM, not a consumer SaaS. The design should feel like Stripe's dashboard — dark, professional, developer-focused.
- The API Playground is your KILLER FEATURE. Make it beautiful and functional. Developers should be able to test every endpoint without leaving the browser.
- Documentation is equally important. Stripe wins because their docs are amazing. Make yours amazing too.
- Every API response must be fast (under 500ms for non-AI endpoints, under 3 seconds for AI endpoints).
- The API must NEVER crash. Handle every error gracefully and return a proper error response.
- Rate limiting must work correctly. One developer should never be able to overload the system.
- The webhook system must be reliable. Retry on failure, track delivery status.
- Mobile responsive: developers check their dashboards on phones too.
- Keep the code clean, modular, and well-documented with TypeScript comments.
- NO placeholder components. Every feature must be FULLY FUNCTIONAL.
- The landing page should make developers want to sign up IMMEDIATELY. Show the value in 5 seconds.

**BUILD THE COMPLETE PLATFORM. NO SHORTCUTS. NO TODOs. EVERYTHING WORKS.**

**ASK THE USER FOR ONLY:**
1. DEEPSEEK_API_KEY — from https://platform.deepseek.com/api_keys
2. NEXTAUTH_SECRET — generate with: openssl rand -base64 32

**SOLVE EVERYTHING ELSE YOURSELF. GO BUILD.**
