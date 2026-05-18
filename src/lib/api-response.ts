export function apiSuccess(data: unknown, meta?: { tokensUsed?: number; creditsRemaining?: number; processingTimeMs?: number }) {
  return Response.json({
    data,
    meta: {
      request_id: crypto.randomUUID(),
      tokens_used: meta?.tokensUsed ?? 0,
      credits_remaining: meta?.creditsRemaining ?? 0,
      processing_time_ms: meta?.processingTimeMs ?? 0,
    }
  }, { status: 200 })
}

export function apiCreated(data: unknown, meta?: { tokensUsed?: number; creditsRemaining?: number; processingTimeMs?: number }) {
  return Response.json({
    data,
    meta: {
      request_id: crypto.randomUUID(),
      tokens_used: meta?.tokensUsed ?? 0,
      credits_remaining: meta?.creditsRemaining ?? 0,
      processing_time_ms: meta?.processingTimeMs ?? 0,
    }
  }, { status: 201 })
}

export function apiError(code: string, message: string, status: number, details?: unknown) {
  return Response.json({
    error: { code, message, details: details ?? {} }
  }, { status })
}

export function apiPaginated(data: unknown[], page: number, perPage: number, total: number, meta?: { tokensUsed?: number; creditsRemaining?: number; processingTimeMs?: number }) {
  return Response.json({
    data,
    pagination: {
      page,
      per_page: perPage,
      total,
      total_pages: Math.ceil(total / perPage),
      has_next: page * perPage < total,
      has_prev: page > 1,
    },
    meta: {
      request_id: crypto.randomUUID(),
      tokens_used: meta?.tokensUsed ?? 0,
      credits_remaining: meta?.creditsRemaining ?? 0,
      processing_time_ms: meta?.processingTimeMs ?? 0,
    }
  })
}
