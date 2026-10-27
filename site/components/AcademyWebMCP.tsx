'use client'

import { useEffect } from 'react'
import { createPublicCatalogTools, type PublicCatalogRecord } from '@/lib/public-catalog.mjs'
import { registerWebTools, type ModelContext } from '@/lib/webmcp.mjs'

export function AcademyWebMCP({ stages }: { stages: PublicCatalogRecord[] }) {
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext
    if (!context?.registerTool) return
    const registration = registerWebTools(context, createPublicCatalogTools('academy_path', stages),
      { onError: () => console.warn('Academy browser tools are unavailable.') })
    return registration.stop
  }, [stages])
  return null
}
