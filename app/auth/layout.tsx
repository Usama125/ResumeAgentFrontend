import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'

export const metadata: Metadata = generatePageMetadata('auth')

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
