'use client'

import { useAppStore } from '@/store/app-store'
import { ArrowLeft, Play, Webhook, Check } from 'lucide-react'
import { useState } from 'react'

export function DocsWebhooks() {
  const setView = useAppStore((s) => s.setView)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => setView('docs')}
          className="text-zinc-500 hover:text-white text-sm flex items-center gap-1 mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Docs
        </button>

        <div className="flex items-center gap-3 mb-4">
          <Webhook className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">Webhooks</h1>
        </div>
        <p className="text-zinc-400 text-lg mb-8">
          Receive real-time notifications when events occur in your NexusAPI account. Webhooks are HTTP POST requests sent to a URL you specify.
        </p>

        {/* Setup guide */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Setup Guide</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
              <div>
                <h3 className="text-white font-medium text-sm">Create a Webhook Endpoint</h3>
                <p className="text-zinc-400 text-xs mt-1">Set up an HTTP endpoint on your server that can receive POST requests with JSON payloads.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
              <div>
                <h3 className="text-white font-medium text-sm">Register the Webhook</h3>
                <p className="text-zinc-400 text-xs mt-1">Use the API or dashboard to register your endpoint URL and select which events to subscribe to. A secret key will be auto-generated.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
              <div>
                <h3 className="text-white font-medium text-sm">Verify Signatures</h3>
                <p className="text-zinc-400 text-xs mt-1">Always verify the <code className="text-emerald-400 text-xs bg-zinc-800 px-1 rounded">X-NexusAPI-Signature</code> header using HMAC-SHA256 to confirm the request is from NexusAPI.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</div>
              <div>
                <h3 className="text-white font-medium text-sm">Return 200 OK</h3>
                <p className="text-zinc-400 text-xs mt-1">Your endpoint must return a 2xx status code within 10 seconds. Otherwise, the delivery is marked as failed and retried.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create webhook */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Create a Webhook</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode(`POST /v1/webhooks\n\n{\n  "url": "https://yourapp.com/api/webhooks/nexusapi",\n  "events": ["lead.created", "lead.status_changed", "content.generated"]\n}`, 'create')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'create' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`POST /v1/webhooks

{
  "url": "https://yourapp.com/api/webhooks/nexusapi",
  "events": ["lead.created", "lead.status_changed", "content.generated"]
}

// Response:
{
  "success": true,
  "data": {
    "id": "whk_abc123",
    "url": "https://yourapp.com/api/webhooks/nexusapi",
    "events": ["lead.created", "lead.status_changed", "content.generated"],
    "secret": "whsec_a1b2c3d4e5f6g7h8i9j0...",
    "status": "active",
    "created_at": "2025-01-15T10:30:00Z"
  }
}`}</pre>
          </div>
          <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <p className="text-amber-400 text-sm">
              <strong>Important:</strong> The <code className="bg-zinc-800 px-1 rounded text-xs">secret</code> is only shown once when the webhook is created. Store it securely — you&apos;ll need it to verify signatures.
            </p>
          </div>
        </div>

        {/* Available events */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Available Events</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-400 font-medium">Event</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Trigger</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['lead.created', 'A new lead is created'],
                  ['lead.status_changed', 'A lead\'s status is updated'],
                  ['lead.batch_created', 'Multiple leads are created via batch endpoint'],
                  ['content.generated', 'AI content is generated and saved'],
                  ['content.deleted', 'A content record is deleted'],
                  ['property.created', 'A new property is created'],
                  ['property.updated', 'A property is updated'],
                  ['property.deleted', 'A property is deleted'],
                ].map(([event, trigger]) => (
                  <tr key={event} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{event}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{trigger}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payload format */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Payload Format</h2>
          <p className="text-zinc-400 text-sm mb-4">All webhook payloads follow a consistent structure:</p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`{
  "id": "evt_abc123def456",
  "event": "lead.created",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "id": "lead_xyz789",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1-555-0123",
    "status": "new",
    "source": "website",
    "property_id": "prop_abc123",
    "created_at": "2025-01-15T10:30:00Z"
  }
}`}</pre>
          </div>
        </div>

        {/* Headers */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Webhook Headers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-400 font-medium">Header</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Content-Type', 'application/json'],
                  ['X-NexusAPI-Event', 'The event type that triggered this webhook (e.g., lead.created)'],
                  ['X-NexusAPI-Signature', 'HMAC-SHA256 signature of the payload body using your webhook secret'],
                  ['X-NexusAPI-Delivery', 'Unique delivery ID for this webhook attempt'],
                ].map(([header, desc]) => (
                  <tr key={header} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{header}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signature verification */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Signature Verification</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Always verify the signature to ensure the webhook is genuinely from NexusAPI. The signature is computed as HMAC-SHA256 of the raw request body using your webhook secret.
          </p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode(`import crypto from 'crypto';\n\nfunction verifySignature(payload, signature, secret) {\n  const expected = crypto\n    .createHmac('sha256', secret)\n    .update(payload)\n    .digest('hex');\n  return crypto.timingSafeEqual(\n    Buffer.from(signature),\n    Buffer.from(expected)\n  );\n}\n\n// Usage in Express:\napp.post('/webhooks/nexusapi', (req, res) => {\n  const signature = req.headers['x-nexusapi-signature'];\n  const payload = JSON.stringify(req.body);\n  \n  if (!verifySignature(payload, signature, WEBHOOK_SECRET)) {\n    return res.status(401).send('Invalid signature');\n  }\n  \n  // Process the event\n  console.log(req.body.event, req.body.data);\n  res.status(200).send('OK');\n});`, 'sig')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'sig' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`import crypto from 'crypto';

function verifySignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// Usage in Express:
app.post('/webhooks/nexusapi', (req, res) => {
  const signature = req.headers['x-nexusapi-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifySignature(payload, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process the event
  console.log(req.body.event, req.body.data);
  res.status(200).send('OK');
});`}</pre>
          </div>
        </div>

        {/* Retry logic */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Retry Logic</h2>
          <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
            <p className="text-zinc-400 text-sm mb-3">
              If your endpoint doesn&apos;t return a 2xx status code within 10 seconds, the delivery is marked as failed and retried:
            </p>
            <ul className="text-zinc-400 text-sm space-y-1 ml-4">
              <li>&#8226; <strong className="text-white">Attempt 1:</strong> Immediate</li>
              <li>&#8226; <strong className="text-white">Attempt 2:</strong> After 5 minutes</li>
              <li>&#8226; <strong className="text-white">Attempt 3:</strong> After 30 minutes</li>
              <li>&#8226; <strong className="text-white">Attempt 4:</strong> After 2 hours</li>
              <li>&#8226; <strong className="text-white">Attempt 5:</strong> After 12 hours</li>
            </ul>
            <p className="text-zinc-500 text-xs mt-3">After 5 failed attempts, the webhook is marked as failed and no further retries are made. You can view delivery history and failure reasons in the dashboard.</p>
          </div>
        </div>

        {/* Webhook management endpoints */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Management Endpoints</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-400 font-medium">Endpoint</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Method</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['/v1/webhooks', 'GET', 'List all webhooks (secrets are masked)'],
                  ['/v1/webhooks', 'POST', 'Create a new webhook'],
                  ['/v1/webhooks/:id', 'PUT', 'Update webhook URL, events, or status'],
                  ['/v1/webhooks/:id', 'DELETE', 'Delete a webhook'],
                  ['/v1/webhooks/:id/test', 'POST', 'Send a test event to the webhook URL'],
                ].map(([endpoint, method, desc]) => (
                  <tr key={`${endpoint}-${method}`} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{endpoint}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        method === 'POST' ? 'bg-amber-500/10 text-amber-400' :
                        method === 'PUT' ? 'bg-sky-500/10 text-sky-400' :
                        method === 'DELETE' ? 'bg-red-500/10 text-red-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {method}
                      </span>
                    </td>
                    <td className="py-2.5 text-zinc-400">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Try in playground */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Test webhooks live</h3>
            <p className="text-zinc-400 text-sm">Create and test webhooks in the API Playground.</p>
          </div>
          <button
            onClick={() => setView('playground')}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm px-4 py-2.5 rounded-lg cursor-pointer transition-colors"
          >
            <Play className="w-4 h-4" /> Try in Playground
          </button>
        </div>
      </div>
    </div>
  )
}
