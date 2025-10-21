import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'

export const metadata: Metadata = generatePageMetadata('ai-writer')

export default function AIWriterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
