import sources from '@/data/knowledge-sources.json'

export const dynamic = 'force-static'
export function GET() {
  return Response.json(sources, { headers: { 'Cache-Control': 'public, max-age=300', 'X-Content-Type-Options': 'nosniff' } })
}
