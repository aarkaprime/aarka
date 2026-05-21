'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'

const tabs = ['JavaScript', 'Python', 'cURL', 'PHP'] as const

const codeExamples: Record<string, string> = {
  JavaScript: `const response = await fetch(
  'https://api.nexusapi.com/v1/ai/generate',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ei_sk_YOUR_API_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content_type: 'property_description',
      property: {
        title: 'Luxury 3BR in Manhattan',
        property_type: 'apartment',
        location: 'New York, Upper East Side',
        price: 2500000,
        currency: 'USD',
        bedrooms: 3,
        bathrooms: 2,
        area_sqm: 180,
        features: ['doorman', 'gym', 'rooftop', 'parking']
      },
      options: { language: 'english', count: 3 }
    })
  }
);

const result = await response.json();
console.log(result.data.results[0].body);`,

  Python: `import requests

response = requests.post(
    'https://api.nexusapi.com/v1/ai/generate',
    headers={
        'Authorization': 'Bearer ei_sk_YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'content_type': 'social_post',
        'property': {
            'title': 'Modern Villa in Dubai Marina',
            'property_type': 'villa',
            'location': 'Dubai, Marina',
            'price': 15000000,
            'currency': 'AED',
            'bedrooms': 5,
            'bathrooms': 4,
            'features': ['pool', 'gym', 'beach access']
        },
        'options': { 'language': 'english', 'count': 5 }
    }
)

data = response.json()
for post in data['data']['results']:
    print(post['body'])`,

  cURL: `curl -X POST https://api.nexusapi.com/v1/ai/generate \\
  -H "Authorization: Bearer ei_sk_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content_type": "whatsapp_msg",
    "property": {
      "title": "Studio in London Bridge",
      "property_type": "studio",
      "location": "London, Bridge",
      "price": 450000,
      "currency": "GBP",
      "area_sqm": 35
    },
    "options": { "language": "english", "count": 3 }
  }'`,

  PHP: `<?php
$ch = curl_init('https://api.nexusapi.com/v1/ai/generate');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ei_sk_YOUR_API_KEY',
    'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'content_type' => 'ad_copy',
    'property' => [
        'title' => '2BR Apartment in Shibuya',
        'property_type' => 'apartment',
        'location' => 'Tokyo, Shibuya',
        'price' => 80000000,
        'currency' => 'JPY',
        'bedrooms' => 2,
    ],
    'options' => ['platform' => 'facebook', 'count' => 3]
]));
$response = curl_exec($ch);
$data = json_decode($response, true);`,
}

export function CodeExamples() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('JavaScript')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Up and Running in Minutes</h2>
          <p className="text-zinc-400 text-lg">One API call. That&apos;s all it takes.</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-zinc-800 bg-zinc-950/80 overflow-hidden shadow-2xl"
        >
          {/* Tabs */}
          <div className="flex items-center border-b border-zinc-800 px-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
                  activeTab === tab ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab}
              </button>
            ))}
            <button onClick={handleCopy} className="ml-auto p-2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {/* Code */}
          <div className="p-4 overflow-x-auto">
            <pre className="font-mono text-sm text-zinc-300 leading-relaxed whitespace-pre">
              {codeExamples[activeTab]}
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
