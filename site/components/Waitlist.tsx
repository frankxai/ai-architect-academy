import registry from '@/data/products.graph.json'
import { WaitlistForm } from '@/lib/demand-capture/WaitlistForm'
import { handleState, type ProductConfig } from '@/lib/demand-capture/handler'
import type { WaitlistState } from '@/lib/demand-capture/types'

export const PRODUCT_ID = 'ai-architect-academy'

export function product(): ProductConfig {
  const row = registry.products.find((p) => p.id === PRODUCT_ID)
  if (!row) throw new Error(`products.graph.json has no row for ${PRODUCT_ID}`)
  return row as ProductConfig
}

/**
 * Server component. First paint carries the honest state when KV is configured.
 * The shared form is designed for a dark ground, so callers render it inside `.night`.
 */
export async function Waitlist() {
  let initialState: WaitlistState | undefined
  try {
    initialState = (await handleState(product())).body
  } catch {
    initialState = undefined
  }
  return (
    <WaitlistForm
      productId={PRODUCT_ID}
      productName="AI Architect Academy"
      foundingBenefit="The first fifty keep the launch price and are named in the materials."
      initialState={initialState}
    />
  )
}
