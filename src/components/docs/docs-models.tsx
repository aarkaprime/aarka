'use client'

import { useAppStore } from '@/store/app-store'
import { ArrowLeft, Play, Cpu, Check, Zap, Coins } from 'lucide-react'
import { useState } from 'react'

export function DocsModels() {
  const setView = useAppStore((s) => s.setView)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const models = [
    { slug: 'deepseek-chat', provider: 'DeepSeek', input: '$0.14', output: '$0.28', context: '64K', capabilities: 'Chat, Reasoning, Code' },
    { slug: 'deepseek-reasoner', provider: 'DeepSeek', input: '$0.55', output: '$2.19', context: '64K', capabilities: 'Chat, Reasoning, Math' },
    { slug: 'qwen-turbo', provider: 'Alibaba (DashScope)', input: '$0.05', output: '$0.10', context: '131K', capabilities: 'Chat, Multilingual' },
    { slug: 'qwen-plus', provider: 'Alibaba (DashScope)', input: '$0.40', output: '$1.20', context: '131K', capabilities: 'Chat, Reasoning, Multilingual' },
    { slug: 'glm-4', provider: 'Zhipu AI', input: '$0.15', output: '$0.15', context: '128K', capabilities: 'Chat, Code, Bilingual' },
    { slug: 'moonshot-v1-8k', provider: 'Moonshot AI', input: '$0.14', output: '$0.28', context: '8K', capabilities: 'Chat, Reasoning' },
    { slug: 'yi-lightning', provider: '01.AI', input: '$0.05', output: '$0.05', context: '16K', capabilities: 'Chat, Fast' },
    { slug: 'baichuan2-turbo', provider: 'Baichuan AI', input: '$0.10', output: '$0.30', context: '32K', capabilities: 'Chat, Multilingual' },
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
          <Cpu className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold text-white">AI Models</h1>
        </div>
        <p className="text-zinc-400 text-lg mb-8">
          NexusAPI aggregates the best AI models from Chinese and global providers. One API key, one endpoint, access to all models at the lowest prices.
        </p>

        {/* Models table */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Available Models</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-400 font-medium">Model</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Provider</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Input/1M</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Output/1M</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Context</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Capabilities</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.slug} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{m.slug}</td>
                    <td className="py-2.5 text-zinc-300 text-xs">{m.provider}</td>
                    <td className="py-2.5 text-amber-400 text-xs font-mono">{m.input}</td>
                    <td className="py-2.5 text-orange-400 text-xs font-mono">{m.output}</td>
                    <td className="py-2.5 text-sky-400 text-xs font-mono">{m.context}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{m.capabilities}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* List models endpoint */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">List Models</h2>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode('GET /v1/models', 'list-models')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'list-models' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`GET /v1/models
Authorization: Bearer nxai_your_api_key

// Response:
{
  "success": true,
  "data": {
    "object": "list",
    "data": [
      {
        "id": "deepseek-chat",
        "object": "model",
        "owned_by": "deepseek"
      },
      ...
    ]
  }
}`}</pre>
          </div>
        </div>

        {/* Chat completions */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Chat Completions</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Our chat completion endpoint is OpenAI-compatible. Send messages and receive AI responses.
          </p>
          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto relative">
            <button
              onClick={() => copyCode(`POST /v1/chat/completions`, 'chat-comp')}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white cursor-pointer"
            >
              {copiedId === 'chat-comp' ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-xs">Copy</span>}
            </button>
            <pre className="text-sm text-zinc-300 font-mono whitespace-pre">{`POST /v1/chat/completions
Authorization: Bearer nxai_your_api_key
Content-Type: application/json

{
  "model": "deepseek-chat",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello, how are you?"}
  ],
  "temperature": 0.7,
  "max_tokens": 2048
}

// Response:
{
  "success": true,
  "data": {
    "id": "chatcmpl-1234567890",
    "object": "chat.completion",
    "model": "deepseek-chat",
    "choices": [{
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! I'm doing well, thank you..."
      },
      "finish_reason": "stop"
    }],
    "usage": {
      "prompt_tokens": 20,
      "completion_tokens": 45,
      "total_tokens": 65
    }
  }
}`}</pre>
          </div>
        </div>

        {/* Parameters */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Chat Completion Parameters</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 text-zinc-400 font-medium">Parameter</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Type</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Default</th>
                  <th className="text-left py-2 text-zinc-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['model', 'string', 'deepseek-chat', 'Model ID (see table above)'],
                  ['messages', 'array', 'Required', 'Array of message objects with role and content'],
                  ['temperature', 'number', '0.7', 'Sampling temperature (0-2). Higher = more creative'],
                  ['max_tokens', 'integer', '2048', 'Maximum tokens in the response'],
                  ['stream', 'boolean', 'false', 'Enable streaming responses (SSE)'],
                ].map(([param, type, def, desc]) => (
                  <tr key={param} className="border-b border-zinc-800/50">
                    <td className="py-2.5 text-emerald-400 font-mono text-xs">{param}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{type}</td>
                    <td className="py-2.5 text-zinc-500 text-xs">{def}</td>
                    <td className="py-2.5 text-zinc-400 text-xs">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Price comparison */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Why Chinese AI Models?</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Chinese AI providers offer world-class models at a fraction of the cost of Western alternatives. DeepSeek Chat at $0.14/$0.28 per million tokens is 95% cheaper than GPT-4o. Qwen Turbo at $0.05/$0.10 is one of the cheapest quality models available anywhere.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-emerald-400" />
                <h3 className="text-white font-medium text-sm">Up to 95% Cheaper</h3>
              </div>
              <p className="text-zinc-400 text-xs">Same quality reasoning and coding ability at dramatically lower prices. Perfect for high-volume applications.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-white font-medium text-sm">Massive Context Windows</h3>
              </div>
              <p className="text-zinc-400 text-xs">Qwen and GLM-4 offer 128K-131K context windows, exceeding GPT-4o&apos;s 128K at a fraction of the cost.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <h3 className="text-white font-medium text-sm">Strong Multilingual</h3>
              </div>
              <p className="text-zinc-400 text-xs">Chinese models excel at bilingual (Chinese-English) tasks and support 30+ languages natively.</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-4 h-4 text-sky-400" />
                <h3 className="text-white font-medium text-sm">OpenAI Compatible</h3>
              </div>
              <p className="text-zinc-400 text-xs">Drop-in replacement for OpenAI API. Change the base URL and model name, everything else works the same.</p>
            </div>
          </div>
        </div>

        {/* Try it */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Test AI Models</h3>
            <p className="text-zinc-400 text-sm">Try chat completions in the interactive playground.</p>
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
