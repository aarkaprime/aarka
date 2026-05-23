'use client'

import { useState } from 'react'
import { Send, Loader2, Copy, Check, Cpu, Trash2 } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const AVAILABLE_MODELS = [
  'deepseek-chat',
  'deepseek-reasoner',
  'qwen-turbo',
  'qwen-plus',
  'glm-4',
  'moonshot-v1-8k',
  'yi-lightning',
  'baichuan2-turbo',
]

export function ChatPlayground() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [model, setModel] = useState('deepseek-chat')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [temperature, setTemperature] = useState(0.7)
  const addToast = useAppStore((s) => s.addToast)

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: ChatMessage = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const apiKey = localStorage.getItem('eq_api_key') || ''
      const res = await fetch('/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: newMessages,
          temperature,
          max_tokens: 2048,
        }),
      })

      const data = await res.json()
      if (data.success && data.data?.content) {
        setMessages([...newMessages, { role: 'assistant', content: data.data.content }])
      } else {
        addToast(data.error?.message || 'Failed to get response', 'error')
        setMessages(newMessages)
      }
    } catch (err) {
      addToast('Request failed. Check your API key.', 'error')
      setMessages(newMessages)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleClear = () => {
    setMessages([])
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Chat Playground</h2>
          <p className="text-sm text-zinc-400 mt-1">Test AI chat completions interactively</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <button
            onClick={handleClear}
            className="text-zinc-400 hover:text-red-400 transition-colors p-2 cursor-pointer"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Temperature slider */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500">Temperature:</span>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-32 accent-emerald-500"
        />
        <span className="text-xs text-zinc-400 font-mono">{temperature.toFixed(1)}</span>
      </div>

      {/* Chat messages */}
      <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 overflow-y-auto min-h-[400px] max-h-[500px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Cpu className="w-10 h-10 text-zinc-700 mb-3" />
            <p className="text-zinc-400 text-sm">Start a conversation with any AI model</p>
            <p className="text-zinc-600 text-xs mt-1">Type a message below and press Enter or Send</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 relative group ${
                  msg.role === 'user'
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : 'bg-zinc-800 border border-zinc-700'
                }`}>
                  <p className="text-xs text-zinc-500 mb-1 font-medium">
                    {msg.role === 'user' ? 'You' : model}
                  </p>
                  <p className="text-sm text-zinc-200 whitespace-pre-wrap">{msg.content}</p>
                  <button
                    onClick={() => handleCopy(msg.content, `msg-${i}`)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-white transition-all cursor-pointer"
                  >
                    {copied === `msg-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
          className="flex-1 bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 min-h-[48px] max-h-[120px]"
          rows={1}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-sm px-4 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send
        </button>
      </div>
    </div>
  )
}
