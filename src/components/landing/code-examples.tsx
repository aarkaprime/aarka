'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const codeExamples: Record<string, string> = {
  javascript: `const response = await fetch(
  'https://api.estateiq.africa/v1/ai/generate',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ei_sk_your_api_key',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content_type: 'property_description',
      property: {
        title: '3BR Apartment in Kilimani',
        location: 'Kilimani, Nairobi',
        price: 45000,
        currency: 'KES',
        bedrooms: 3,
        type: 'apartment'
      },
      language: 'en',
      tone: 'professional'
    })
  }
);

const data = await response.json();
console.log(data.results);`,

  python: `import requests

response = requests.post(
    "https://api.estateiq.africa/v1/ai/generate",
    headers={
        "Authorization": "Bearer ei_sk_your_api_key",
        "Content-Type": "application/json",
    },
    json={
        "content_type": "property_description",
        "property": {
            "title": "3BR Apartment in Kilimani",
            "location": "Kilimani, Nairobi",
            "price": 45000,
            "currency": "KES",
            "bedrooms": 3,
            "type": "apartment",
        },
        "language": "en",
        "tone": "professional",
    },
)

data = response.json()
print(data["results"])`,

  php: `<?php

$ch = curl_init("https://api.estateiq.africa/v1/ai/generate");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer ei_sk_your_api_key",
    "Content-Type: application/json",
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "content_type" => "property_description",
    "property" => [
        "title" => "3BR Apartment in Kilimani",
        "location" => "Kilimani, Nairobi",
        "price" => 45000,
        "currency" => "KES",
        "bedrooms" => 3,
        "type" => "apartment",
    ],
    "language" => "en",
    "tone" => "professional",
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$data = json_decode($response, true);
print_r($data["results"]);`,

  curl: `curl -X POST https://api.estateiq.africa/v1/ai/generate \\
  -H "Authorization: Bearer ei_sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content_type": "property_description",
    "property": {
      "title": "3BR Apartment in Kilimani",
      "location": "Kilimani, Nairobi",
      "price": 45000,
      "currency": "KES",
      "bedrooms": 3,
      "type": "apartment"
    },
    "language": "en",
    "tone": "professional"
  }'`,
}

const tabLabels: Record<string, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  php: 'PHP',
  curl: 'cURL',
}

export function CodeExamples() {
  const [activeTab, setActiveTab] = useState('javascript')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeExamples[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-20 sm:py-28 bg-[#09090b]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Up and running in <span className="text-emerald-400">minutes</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-lg">
            Integrate with your stack in just a few lines of code.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-0">
              <TabsList className="bg-zinc-900 border border-zinc-800">
                {Object.keys(tabLabels).map((key) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-zinc-400"
                  >
                    {tabLabels[key]}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-1 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 mr-1" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            {Object.entries(codeExamples).map(([key, code]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                  <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                    <code>{code}</code>
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}
