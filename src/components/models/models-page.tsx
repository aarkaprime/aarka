'use client'

import { useEffect, useState } from 'react'
import { Loader2, Cpu, Zap, Coins, Sparkles } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

interface AiModelItem {
  id: string
  slug: string
  name: string
  provider: string
  description: string | null
  inputPrice1M: number
  outputPrice1M: number
  contextWindow: number
  maxTokens: number
  status: string
  capabilities: string
}

const STATIC_MODELS: AiModelItem[] = [
  { id: '1', slug: 'deepseek-chat', name: 'DeepSeek Chat', provider: 'deepseek', description: 'General-purpose chat model with strong reasoning capabilities', inputPrice1M: 0.14, outputPrice1M: 0.28, contextWindow: 64000, maxTokens: 4096, status: 'active', capabilities: 'chat, reasoning, code' },
  { id: '2', slug: 'deepseek-reasoner', name: 'DeepSeek Reasoner', provider: 'deepseek', description: 'Advanced reasoning model for complex problem-solving', inputPrice1M: 0.55, outputPrice1M: 2.19, contextWindow: 64000, maxTokens: 8192, status: 'active', capabilities: 'chat, reasoning, math' },
  { id: '3', slug: 'qwen-turbo', name: 'Qwen Turbo', provider: 'dashscope', description: 'Fast and affordable model from Alibaba Cloud', inputPrice1M: 0.05, outputPrice1M: 0.10, contextWindow: 131072, maxTokens: 8192, status: 'active', capabilities: 'chat, multilingual' },
  { id: '4', slug: 'qwen-plus', name: 'Qwen Plus', provider: 'dashscope', description: 'Balanced performance and cost model from Alibaba Cloud', inputPrice1M: 0.40, outputPrice1M: 1.20, contextWindow: 131072, maxTokens: 8192, status: 'active', capabilities: 'chat, reasoning, multilingual' },
  { id: '5', slug: 'glm-4', name: 'GLM-4', provider: 'zhipu', description: 'Powerful bilingual model from Zhipu AI', inputPrice1M: 0.15, outputPrice1M: 0.15, contextWindow: 128000, maxTokens: 4096, status: 'active', capabilities: 'chat, code, bilingual' },
  { id: '6', slug: 'moonshot-v1-8k', name: 'Moonshot V1 8K', provider: 'moonshot', description: 'Cost-effective model from Moonshot AI with long context', inputPrice1M: 0.14, outputPrice1M: 0.28, contextWindow: 8192, maxTokens: 4096, status: 'active', capabilities: 'chat, reasoning' },
  { id: '7', slug: 'yi-lightning', name: 'Yi Lightning', provider: 'yi', description: 'Ultra-fast and affordable model from 01.AI', inputPrice1M: 0.05, outputPrice1M: 0.05, contextWindow: 16384, maxTokens: 4096, status: 'active', capabilities: 'chat, fast' },
  { id: '8', slug: 'baichuan2-turbo', name: 'Baichuan4', provider: 'baichuan', description: 'Advanced model from Baichuan AI', inputPrice1M: 0.10, outputPrice1M: 0.30, contextWindow: 32768, maxTokens: 4096, status: 'active', capabilities: 'chat, multilingual' },
]

export function ModelsPage() {
  const [models] = useState<AiModelItem[]>(STATIC_MODELS)
  const [filter, setFilter] = useState<string>('all')

  const providers = ['all', ...new Set(models.map(m => m.provider))]
  const filtered = filter === 'all' ? models : models.filter(m => m.provider === filter)

  const providerColors: Record<string, string> = {
    deepseek: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dashscope: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    zhipu: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    moonshot: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    yi: 'bg-red-500/10 text-red-400 border-red-500/20',
    baichuan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">AI Models</h2>
          <p className="text-sm text-zinc-400 mt-1">Browse available AI models and their pricing</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">{filtered.length} models</span>
        </div>
      </div>

      {/* Provider filter */}
      <div className="flex flex-wrap gap-2">
        {providers.map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filter === p
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
            }`}
          >
            {p === 'all' ? 'All Providers' : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Models grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((model) => (
          <div
            key={model.id}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-emerald-500/20 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold text-sm">{model.name}</h3>
                <p className="text-zinc-500 text-xs font-mono mt-0.5">{model.slug}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${providerColors[model.provider] || 'bg-zinc-700 text-zinc-300'}`}>
                {model.provider}
              </span>
            </div>

            {model.description && (
              <p className="text-zinc-400 text-xs mb-3 line-clamp-2">{model.description}</p>
            )}

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase">Input/1M</p>
                  <p className="text-xs text-zinc-300">${model.inputPrice1M}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-3.5 h-3.5 text-orange-400" />
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase">Output/1M</p>
                  <p className="text-xs text-zinc-300">${model.outputPrice1M}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase">Context</p>
                  <p className="text-xs text-zinc-300">{(model.contextWindow / 1000).toFixed(0)}K</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase">Max Output</p>
                  <p className="text-xs text-zinc-300">{(model.maxTokens / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex gap-1">
                {model.capabilities.split(',').map((cap) => (
                  <span key={cap} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {cap.trim()}
                  </span>
                ))}
              </div>
              <span className={`w-2 h-2 rounded-full ${model.status === 'active' ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
