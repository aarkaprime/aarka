'use client'

import { useAppStore } from '@/store/app-store'
import { ArrowLeft, Play, AlertCircle, Check } from 'lucide-react'
import { useState } from 'react'

export function DocsErrors() {
  const setView = useAppStore((s) => s.setView)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const errorGroups = [
    {
      title: 'Authentication Errors (401)',
      color: 'text-red-400 bg-red-500/10',
      errors: [
        { code: 'MISSING_API_KEY', status: 401, message: 'API key is required. Include it in the Authorization header as "Bearer ei_sk_..."', solution: 'Add the Authorization header with a valid API key.' },
        { code: 'INVALID_API_KEY', status: 401, message: 'The API key provided is invalid.', solution: 'Verify your API key. Check for typos or whitespace. Regenerate the key if needed.' },
        { code: 'API_KEY_REVOKED', status: 401, message: 'This API key has been revoked.', solution: 'Create a new API key from the dashboard. The old key cannot be reactivated.' },
      ]
    },
    {
      title: 'Authorization Errors (403)',
      color: 'text-amber-400 bg-amber-500/10',
      errors: [
        { code: 'ACCOUNT_SUSPENDED', status: 403, message: 'Your account has been suspended. Contact support.', solution: 'Contact support@estateiq.com to resolve account issues.' },
        { code: 'AI_MODEL_NOT_AVAILABLE', status: 403, message: 'The requested AI model is not available on your plan.', solution: 'Upgrade your plan to access advanced AI models and features.' },
      ]
    },
    {
      title: 'Validation Errors (400)',
      color: 'text-orange-400 bg-orange-500/10',
      errors: [
        { code: 'INVALID_REQUEST_BODY', status: 400, message: 'The request body is invalid or malformed.', solution: 'Ensure your JSON is valid and matches the expected schema.' },
        { code: 'MISSING_REQUIRED_FIELD', status: 400, message: 'Required field is missing.', solution: 'Check the API documentation for required fields in your request.' },
        { code: 'INVALID_CONTENT_TYPE', status: 400, message: 'Invalid content_type.', solution: 'Use one of: property_description, social_post, whatsapp_msg, email_campaign, ad_copy, custom' },
        { code: 'INVALID_PROPERTY_TYPE', status: 400, message: 'Invalid property_type.', solution: 'Use one of: apartment, house, land, commercial, townhouse, villa, studio, duplex' },
        { code: 'GENERATION_LIMIT_EXCEEDED', status: 400, message: 'Count exceeds maximum of 10 per request.', solution: 'Reduce the count parameter to 10 or fewer.' },
        { code: 'INVALID_WEBHOOK_URL', status: 400, message: 'The webhook URL is invalid.', solution: 'Provide a valid HTTPS URL that can accept POST requests.' },
        { code: 'WEBHOOK_LIMIT_EXCEEDED', status: 400, message: 'Maximum number of webhooks for your plan reached.', solution: 'Delete unused webhooks or upgrade your plan.' },
      ]
    },
    {
      title: 'Rate Limit Errors (429)',
      color: 'text-orange-400 bg-orange-500/10',
      errors: [
        { code: 'RATE_LIMIT_EXCEEDED', status: 429, message: 'Too many requests. Slow down and retry.', solution: 'Wait for the retry_after duration and implement exponential backoff.' },
        { code: 'MONTHLY_QUOTA_EXCEEDED', status: 429, message: 'Monthly API call quota exceeded.', solution: 'Upgrade your plan or wait for the next billing cycle reset.' },
      ]
    },
    {
      title: 'Not Found Errors (404)',
      color: 'text-zinc-400 bg-zinc-500/10',
      errors: [
        { code: 'PROPERTY_NOT_FOUND', status: 404, message: 'Property not found.', solution: 'Verify the property ID. Check if the property was deleted.' },
        { code: 'LEAD_NOT_FOUND', status: 404, message: 'Lead not found.', solution: 'Verify the lead ID. Check if the lead was deleted.' },
        { code: 'CONTENT_NOT_FOUND', status: 404, message: 'Content not found.', solution: 'Verify the content ID. Check if the content was deleted.' },
        { code: 'WEBHOOK_NOT_FOUND', status: 404, message: 'Webhook not found.', solution: 'Verify the webhook ID. Check if the webhook was deleted.' },
      ]
    },
    {
      title: 'Server Errors (5xx)',
      color: 'text-red-400 bg-red-500/10',
      errors: [
        { code: 'AI_SERVICE_UNAVAILABLE', status: 503, message: 'The AI service is temporarily unavailable. Please retry.', solution: 'Retry after a short delay. If persistent, check status.estateiq.com.' },
        { code: 'AI_GENERATION_FAILED', status: 500, message: 'AI content generation failed. Please try again.', solution: 'Retry the request. If it persists, simplify the property data or try a different tone.' },
      ]
    },
  ]

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
          <AlertCircle className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">Error Codes</h1>
        </div>
        <p className="text-zinc-400 text-lg mb-8">
          EstateIQ uses standard HTTP status codes and consistent error response format. This reference covers every error code and how to resolve them.
        </p>

        {/* Error response format */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Error Response Format</h2>
          <p className="text-zinc-400 text-sm mb-4">All error responses follow a consistent structure:</p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode(`{\n  "success": false,\n  "error": {\n    "code": "ERROR_CODE",\n    "message": "Human-readable description of the error",\n    "status": 400,\n    "details": {} // Optional additional context\n  }\n}`, 'format')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'format' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description of the error",
    "status": 400,
    "details": {} // Optional additional context
  }
}`}</pre>
          </div>
        </div>

        {/* HTTP status codes */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">HTTP Status Codes</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { status: '200', label: 'OK', desc: 'Request succeeded', color: 'text-emerald-400 bg-emerald-500/10' },
              { status: '201', label: 'Created', desc: 'Resource created successfully', color: 'text-emerald-400 bg-emerald-500/10' },
              { status: '400', label: 'Bad Request', desc: 'Invalid request body or parameters', color: 'text-orange-400 bg-orange-500/10' },
              { status: '401', label: 'Unauthorized', desc: 'Missing or invalid API key', color: 'text-red-400 bg-red-500/10' },
              { status: '403', label: 'Forbidden', desc: 'Insufficient permissions or suspended account', color: 'text-amber-400 bg-amber-500/10' },
              { status: '404', label: 'Not Found', desc: 'Resource does not exist', color: 'text-zinc-400 bg-zinc-500/10' },
              { status: '429', label: 'Too Many Requests', desc: 'Rate limit or quota exceeded', color: 'text-orange-400 bg-orange-500/10' },
              { status: '500', label: 'Server Error', desc: 'Internal server error', color: 'text-red-400 bg-red-500/10' },
              { status: '503', label: 'Service Unavailable', desc: 'AI service temporarily down', color: 'text-red-400 bg-red-500/10' },
            ].map((item) => (
              <div key={item.status} className="flex items-center gap-3 rounded-lg bg-zinc-900/50 border border-zinc-800 p-3">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${item.color}`}>{item.status}</span>
                <div>
                  <span className="text-white text-sm font-medium">{item.label}</span>
                  <span className="text-zinc-500 text-xs ml-2">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error code groups */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">All Error Codes</h2>
          <div className="space-y-8">
            {errorGroups.map((group) => (
              <div key={group.title}>
                <h3 className={`text-sm font-medium mb-3 ${group.color.split(' ')[0]}`}>{group.title}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-2 text-zinc-400 font-medium">Code</th>
                        <th className="text-left py-2 text-zinc-400 font-medium">Message</th>
                        <th className="text-left py-2 text-zinc-400 font-medium">Solution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.errors.map((error) => (
                        <tr key={error.code} className="border-b border-zinc-800/50">
                          <td className="py-2.5 text-emerald-400 font-mono text-xs whitespace-nowrap">{error.code}</td>
                          <td className="py-2.5 text-zinc-400 text-xs">{error.message}</td>
                          <td className="py-2.5 text-zinc-500 text-xs">{error.solution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common error scenarios */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Common Error Scenarios</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-2">Validation Error Example</h3>
              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 overflow-x-auto">
                <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST_BODY",
    "message": "The request body is invalid or malformed.",
    "status": 400,
    "details": {
      "fields": {
        "property.price": "Must be a positive number",
        "property.title": "Required field is missing"
      }
    }
  }
}`}</pre>
              </div>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-2">Handling Errors in Code</h3>
              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 overflow-x-auto">
                <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`try {
  const response = await fetch('https://api.estateiq.com/v1/ai/generate', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!data.success) {
    // Handle API error
    switch (data.error.code) {
      case 'RATE_LIMIT_EXCEEDED':
        console.log(\`Rate limited. Retry after \${data.error.retry_after}s\`);
        break;
      case 'MONTHLY_QUOTA_EXCEEDED':
        console.log('Upgrade your plan at estateiq.com/pricing');
        break;
      case 'INVALID_API_KEY':
        console.log('Check your API key configuration');
        break;
      default:
        console.log(\`Error: \${data.error.message}\`);
    }
    return;
  }

  // Process successful response
  console.log(data.results);
} catch (err) {
  console.error('Network error:', err);
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Try in playground */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Test error handling</h3>
            <p className="text-zinc-400 text-sm">Make invalid requests in the Playground to see error responses.</p>
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
