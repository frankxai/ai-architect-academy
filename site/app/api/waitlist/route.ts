import { handleJoin, handleState } from '@/lib/demand-capture/handler'
import { PRODUCT_ID, product } from '@/components/Waitlist'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  if (body.productId !== PRODUCT_ID) return Response.json({ error: 'Unknown product' }, { status: 404 })
  try {
    const { status, body: out } = await handleJoin(product(), body, req)
    return Response.json(out, { status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json({ error: `The waitlist is not taking names yet (${message}).` }, { status: 503 })
  }
}

export async function GET(req: Request) {
  if (new URL(req.url).searchParams.get('productId') !== PRODUCT_ID) {
    return Response.json({ error: 'Unknown product' }, { status: 404 })
  }
  try {
    const { status, body } = await handleState(product())
    return Response.json(body, { status })
  } catch {
    return Response.json({ error: 'Waitlist unavailable' }, { status: 503 })
  }
}
