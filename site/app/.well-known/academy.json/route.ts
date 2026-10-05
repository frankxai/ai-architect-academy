import products from '@/data/products.graph.json'
import { publicAcademyManifest } from '@/lib/academy-graph/experience'

export const dynamic = 'force-static'

export function GET() {
  const product = products.products.find(p => p.id === 'ai-architect-academy')
  return Response.json(publicAcademyManifest({ stage: product?.stage ?? 'unknown', gate: product?.gate ?? 'UNGATED' }), {
    headers: { 'Cache-Control': 'public, max-age=300', 'X-Content-Type-Options': 'nosniff' },
  })
}
