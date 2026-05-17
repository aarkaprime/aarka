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

export const UpdatePropertySchema = PropertySchema.partial()
export const UpdateLeadSchema = LeadSchema.partial()
export const UpdateWebhookSchema = z.object({
  url: z.string().url().optional(),
  events: z.array(z.string()).min(1).max(20).optional(),
  status: z.enum(['active', 'paused']).optional(),
})
