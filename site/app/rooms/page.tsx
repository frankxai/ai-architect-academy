import type { Metadata } from 'next'
import { TeachingRoom } from '@/components/TeachingRoom'

export const metadata: Metadata = {
  title: 'Architecture practice rooms',
  description: 'Choose an architecture challenge, draft the required artifact, check its structure and export your work for review.',
}

export default function RoomsPage() {
  return <TeachingRoom />
}
