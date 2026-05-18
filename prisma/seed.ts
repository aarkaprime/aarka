import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.plan.upsert({
    where: { slug: 'free' },
    update: {},
    create: {
      slug: 'free', name: 'Free', priceMonthly: 0, callsPerMonth: 100,
      maxApiKeys: 1, maxWebhooks: 0,
      features: JSON.stringify(['100 API calls/month', '1 API key', 'Test environment only', 'Community support', 'Basic AI models']),
      aiModelsAvailable: 'deepseek-chat', rateLimitPerMin: 10, supportLevel: 'community',
    },
  })
  await prisma.plan.upsert({
    where: { slug: 'starter' },
    update: {},
    create: {
      slug: 'starter', name: 'Starter', priceMonthly: 49, callsPerMonth: 1000,
      maxApiKeys: 3, maxWebhooks: 2,
      features: JSON.stringify(['1,000 API calls/month', '3 API keys', 'Test + Production environments', '2 webhooks', 'All AI models', 'Email support']),
      aiModelsAvailable: 'deepseek-chat,deepseek-reasoner', rateLimitPerMin: 30, supportLevel: 'email',
    },
  })
  await prisma.plan.upsert({
    where: { slug: 'pro' },
    update: {},
    create: {
      slug: 'pro', name: 'Professional', priceMonthly: 199, callsPerMonth: 10000,
      maxApiKeys: 10, maxWebhooks: 10,
      features: JSON.stringify(['10,000 API calls/month', '10 API keys', 'All environments', '10 webhooks', 'All AI models', 'Priority support', 'Advanced analytics', 'Custom tone/language']),
      aiModelsAvailable: 'deepseek-chat,deepseek-reasoner', rateLimitPerMin: 60, supportLevel: 'priority',
    },
  })
  await prisma.plan.upsert({
    where: { slug: 'business' },
    update: {},
    create: {
      slug: 'business', name: 'Business', priceMonthly: 499, callsPerMonth: 50000,
      maxApiKeys: 50, maxWebhooks: 50,
      features: JSON.stringify(['50,000 API calls/month', '50 API keys', 'All environments', '50 webhooks', 'All AI models', 'Dedicated support', 'Advanced analytics', 'Custom models', 'SLA guarantee', 'White-label option']),
      aiModelsAvailable: 'deepseek-chat,deepseek-reasoner', rateLimitPerMin: 120, supportLevel: 'dedicated',
    },
  })
  await prisma.plan.upsert({
    where: { slug: 'enterprise' },
    update: {},
    create: {
      slug: 'enterprise', name: 'Enterprise', priceMonthly: 0, callsPerMonth: 999999,
      maxApiKeys: 999, maxWebhooks: 999,
      features: JSON.stringify(['Unlimited API calls', 'Unlimited API keys', 'All environments', 'Unlimited webhooks', 'All AI models', 'Dedicated engineer', 'Custom integrations', 'SLA guarantee', 'White-label', 'On-premise option', 'Custom AI training']),
      aiModelsAvailable: 'deepseek-chat,deepseek-reasoner', rateLimitPerMin: 300, supportLevel: 'dedicated',
    },
  })
  console.log('Database seeded with plans!')
}
main().catch(console.error).finally(() => prisma.$disconnect())
