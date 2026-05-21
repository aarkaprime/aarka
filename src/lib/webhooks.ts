import { db } from '@/lib/db'
import { createHmac, randomBytes } from 'crypto'

export function generateWebhookSecret(): string {
  return `whsec_${randomBytes(32).toString('hex')}`
}

export async function triggerWebhook(developerId: string, event: string, payload: object): Promise<void> {
  const webhooks = await db.webhook.findMany({
    where: { developerId, status: 'active' },
  })

  const activeWebhooks = webhooks.filter(w => w.events.split(',').includes(event))

  for (const webhook of activeWebhooks) {
    const deliveryId = crypto.randomUUID()
    const body = JSON.stringify({ event, data: payload, timestamp: new Date().toISOString(), delivery_id: deliveryId })

    const signature = createHmac('sha256', webhook.secret)
      .update(body)
      .digest('hex')

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-NexusAPI-Event': event,
          'X-NexusAPI-Signature': `sha256=${signature}`,
          'X-NexusAPI-Delivery': deliveryId,
        },
        body,
      })

      if (response.ok) {
        await db.webhook.update({
          where: { id: webhook.id },
          data: {
            successCount: { increment: 1 },
            lastTriggeredAt: new Date(),
          },
        })
      } else {
        await db.webhook.update({
          where: { id: webhook.id },
          data: {
            failureCount: { increment: 1 },
            lastTriggeredAt: new Date(),
          },
        })
      }
    } catch (error) {
      await db.webhook.update({
        where: { id: webhook.id },
        data: {
          failureCount: { increment: 1 },
          lastTriggeredAt: new Date(),
        },
      })
    }
  }
}
