import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'

export const metadata: Metadata = generatePageMetadata('explore')

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
