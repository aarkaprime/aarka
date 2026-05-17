export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json({
    status: 'ok',
    uptime: process.uptime(),
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
}
