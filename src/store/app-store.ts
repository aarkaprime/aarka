'use client'

import { create } from 'zustand'

type View =
  | 'landing' | 'pricing' | 'docs' | 'login' | 'register'
  | 'dashboard' | 'api-keys' | 'usage' | 'models' | 'logs' | 'chat'
  | 'webhooks' | 'playground' | 'settings' | 'billing'
  | 'docs-getting-started' | 'docs-authentication' | 'docs-ai-generation'
  | 'docs-models' | 'docs-analytics' | 'docs-webhooks'
  | 'docs-ratelimits' | 'docs-errors' | 'docs-sdks' | 'docs-changelog'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface AppState {
  // Navigation
  view: View
  setView: (view: View) => void

  // Auth state
  isAuthenticated: boolean
  developer: Record<string, unknown> | null
  setIsAuthenticated: (val: boolean) => void
  setDeveloper: (dev: Record<string, unknown> | null) => void

  // Sidebar
  sidebarOpen: boolean
  setSidebarOpen: (val: boolean) => void

  // Mobile
  isMobile: boolean
  setIsMobile: (val: boolean) => void

  // Notifications
  toasts: Toast[]
  addToast: (message: string, type: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  view: 'landing',
  setView: (view) => set({ view }),

  isAuthenticated: false,
  developer: null,
  setIsAuthenticated: (val) => set({ isAuthenticated: val }),
  setDeveloper: (dev) => set({ developer: dev }),

  sidebarOpen: true,
  setSidebarOpen: (val) => set({ sidebarOpen: val }),

  isMobile: false,
  setIsMobile: (val) => set({ isMobile: val }),

  toasts: [],
  addToast: (message, type) => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 5000)
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))
