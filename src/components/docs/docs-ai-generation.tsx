'use client'

import { useAppStore } from '@/store/app-store'
import { ArrowLeft, Play, Sparkles, Check } from 'lucide-react'
import { useState } from 'react'

export function DocsAIGeneration() {
  const setView = useAppStore((s) => s.setView)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const requestExample = `{
  "model": "deepseek-chat",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Explain quantum computing in simple terms."}
  ],
  "temperature": 0.7,
  "max_tokens": 500
}`

  const responseExample = `{
  "success": true,
  "data": {
    "id": "chatcmpl-1705312345678",
    "object": "chat.completion",
    "created": 1705312345,
    "model": "deepseek-chat",
    "choices": [{
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Quantum computing is a type of computing that uses the principles of quantum mechanics..."
      },
      "finish_reason": "stop"
    }],
    "usage": {
      "prompt_tokens": 18,
      "completion_tokens": 156,
      "total_tokens": 174
    }
  },
  "meta": {
    "creditsRemaining": 98
  }
}`

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
          <Sparkles className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">Chat Completions</h1>
        </div>
        <p className="text-zinc-400 text-lg mb-8">
          Send messages to AI models and receive intelligent responses. OpenAI-compatible API format makes migration easy.
        </p>

        {/* Endpoints */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Endpoints</h2>
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
                <tr className="border-b border-zinc-800/50">
                  <td className="py-2.5 text-emerald-400 font-mono text-xs">/v1/chat/completions</td>
                  <td className="py-2.5"><span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">POST</span></td>
                  <td className="py-2.5 text-zinc-400">Send messages and receive AI chat completion</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-2.5 text-emerald-400 font-mono text-xs">/v1/models</td>
                  <td className="py-2.5"><span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">GET</span></td>
                  <td className="py-2.5 text-zinc-400">List all available AI models</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Parameters */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Request Parameters</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-400 font-medium">Parameter</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Type</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Required</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Default</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['model', 'string', 'No', 'deepseek-chat', 'Model ID. See Models page for available options.'],
                  ['messages', 'array', 'Yes', '—', 'Array of message objects with role and content.'],
                  ['temperature', 'number', 'No', '0.7', 'Sampling temperature (0-2). Higher = more creative.'],
                  ['max_tokens', 'integer', 'No', '2048', 'Maximum tokens in the AI response.'],
                  ['stream', 'boolean', 'No', 'false', 'Enable Server-Sent Events streaming.'],
                ].map(([param, type, req, def, desc]) => (
                  <tr key={param} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{param}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{type}</td>
                    <td className="py-2.5">{req === 'Yes' ? <span className="text-amber-400 text-xs">Required</span> : <span className="text-zinc-600 text-xs">Optional</span>}</td>
                    <td className="py-2.5 text-zinc-500 text-xs">{def}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Message roles */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Message Roles</h2>
          <div className="space-y-3">
            {[
              { role: 'system', desc: 'Set the behavior and persona of the AI assistant. Typically the first message.', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
              { role: 'user', desc: 'The user input or question. This is what you want the AI to respond to.', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
              { role: 'assistant', desc: 'Previous AI responses. Include these for multi-turn conversations.', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
            ].map((item) => (
              <div key={item.role} className="flex items-start gap-3 rounded-lg bg-zinc-900/50 border border-zinc-800 p-4">
                <span className={`text-xs px-2.5 py-1 rounded-full border ${item.color} font-mono`}>{item.role}</span>
                <span className="text-zinc-400 text-sm">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Request example */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Request Example</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode(`POST /v1/chat/completions\nAuthorization: Bearer nxai_your_api_key\n\n${requestExample}`, 'request')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'request' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`POST /v1/chat/completions
Authorization: Bearer nxai_your_api_key

${requestExample}`}</pre>
          </div>
        </div>

        {/* Response example */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Response Example</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode(responseExample, 'response')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'response' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{responseExample}</pre>
          </div>
        </div>

        {/* Multi-turn */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Multi-Turn Conversations</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Include previous assistant responses in the messages array to maintain conversation context. This enables back-and-forth dialogue.
          </p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto">
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`{
  "model": "deepseek-chat",
  "messages": [
    {"role": "system", "content": "You are a coding assistant."},
    {"role": "user", "content": "Write a Python function to check if a number is prime."},
    {"role": "assistant", "content": "def is_prime(n):\\n    if n <= 1:\\n        return False\\n    for i in range(2, int(n**0.5) + 1):\\n        if n % i == 0:\\n            return False\\n    return True"},
    {"role": "user", "content": "Now optimize it using the Sieve of Eratosthenes."}
  ]
}`}</pre>
          </div>
        </div>

        {/* Model selection tips */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Choosing a Model</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-2">For Chat & General Tasks</h3>
              <p className="text-zinc-400 text-xs"><code className="text-emerald-400">deepseek-chat</code> — Best value at $0.14/$0.28 per 1M tokens. Strong reasoning and coding abilities.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-2">For Complex Reasoning</h3>
              <p className="text-zinc-400 text-xs"><code className="text-emerald-400">deepseek-reasoner</code> — Advanced step-by-step reasoning for math, logic, and complex problems.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-2">For Speed & Cost</h3>
              <p className="text-zinc-400 text-xs"><code className="text-emerald-400">yi-lightning</code> or <code className="text-emerald-400">qwen-turbo</code> — Ultra-cheap at $0.05/1M tokens. Great for high-volume tasks.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <h3 className="text-white font-medium text-sm mb-2">For Long Context</h3>
              <p className="text-zinc-400 text-xs"><code className="text-emerald-400">qwen-plus</code> or <code className="text-emerald-400">glm-4</code> — 128K+ context windows. Process large documents and codebases.</p>
            </div>
          </div>
        </div>

        {/* Try in playground */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Try chat completions now</h3>
            <p className="text-zinc-400 text-sm">Send your first AI message in the Chat Playground.</p>
          </div>
          <button
            onClick={() => setView('chat')}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm px-4 py-2.5 rounded-lg cursor-pointer transition-colors"
          >
            <Play className="w-4 h-4" /> Try Chat
          </button>
        </div>
      </div>
    </div>
  )
}
