'use client'

const API_BASE = '/api/v1'

export class ApiClient {
  private apiKey: string | null = null

  setApiKey(key: string | null) {
    this.apiKey = key
  }

  private async request(path: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    }
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
    return response.json()
  }

  async get(path: string) {
    return this.request(path)
  }

  async post(path: string, body: unknown) {
    return this.request(path, { method: 'POST', body: JSON.stringify(body) })
  }

  async put(path: string, body: unknown) {
    return this.request(path, { method: 'PUT', body: JSON.stringify(body) })
  }

  async delete(path: string) {
    return this.request(path, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
